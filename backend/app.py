from flask import Flask, render_template, request, redirect
import torch
from tqdm import tqdm
from transformers import Wav2Vec2FeatureExtractor, WavLMForXVector
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
import librosa
import pickle
import os
from datasets import load_dataset

app = Flask(__name__)

device = "cuda" if torch.cuda.is_available() else "cpu"
feature_extractor_wav2vec = Wav2Vec2FeatureExtractor.from_pretrained("microsoft/wavlm-base-plus-sv")
model_wav_lm = WavLMForXVector.from_pretrained("microsoft/wavlm-base-plus-sv").to(device)

# Define constants
N_SECONDS_SEGMENT = 4
SAMPLING_RATE = 16000

def segment_audio(x, y, n_sec, samp_rate):
    """Segment each array in the list of audio arrays to N seconds segments"""
    x_segment = list()
    y_segment = list()
    for x, y in zip(x, y):
        segments = np.array_split(x, round(x.shape[0] / (samp_rate * n_sec)))
        x_segment += segments
        y_segment += [y] * len(segments)

    return x_segment, y_segment

def extract_embeddings_batch(model, feature_extractor, data, device, batch_size=32):
    emb_train = list()

    for i in tqdm(range(0, len(data), batch_size)):
        batch_data = data[i:i+batch_size]

        # Pad and process the batch
        padded_data = [np.pad(segment, (0, max(0, SAMPLING_RATE * N_SECONDS_SEGMENT - segment.shape[0])), 'constant') for segment in batch_data]

        inputs = feature_extractor(
            padded_data,
            sampling_rate=SAMPLING_RATE,
            return_tensors="pt",
            padding="longest"
        ).to(device)

        with torch.no_grad():
            embeddings = model(**inputs).embeddings

        # Normalize embeddings along the last dimension (dimension -1)
        embeddings_normalized = torch.nn.functional.normalize(embeddings, dim=-1)

        emb_train += torch.nn.functional.normalize(embeddings.cpu(), dim=-1).cpu()

    return torch.stack(emb_train)


# Directory where VoxCeleb1 dataset is located
local_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Voxceleb1", "s3prl__mini_voxceleb1")

# Load the dataset and it will be cached in the specified directory
dataset = load_dataset("s3prl/mini_voxceleb1", cache_dir=local_data_dir, download_mode="force_redownload")

# Add labels for each audio file
# Train data
x_train_data = [f['audio']['array'] for f in dataset['train']]
y_train_data = [str(int(i / 10)) for i in range(len(dataset['train']))]

# Test data
x_test_data = [f['audio']['array'] for f in dataset['test']]
y_test_data = [str(int(i / 10)) for i in range(len(dataset['test']))]

# Segment train and test sets
x_train, y_train = segment_audio(x_train_data, y_train_data, N_SECONDS_SEGMENT, SAMPLING_RATE)
x_test, y_test = segment_audio(x_test_data, y_test_data, N_SECONDS_SEGMENT, SAMPLING_RATE)

# Extract embeddings for train and test set using batch processing
x_train_emb = extract_embeddings_batch(
    model=model_wav_lm,
    feature_extractor=feature_extractor_wav2vec,
    data=x_train,
    device=device
)

x_test_emb = extract_embeddings_batch(
    model=model_wav_lm,
    feature_extractor=feature_extractor_wav2vec,
    data=x_test,
    device=device
)

# Fit k-NN model if the model file doesn't exist
N_NEIGHBORS = 10
model_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'knn_model.pkl')

if not os.path.exists(model_file_path):
    model_knn = KNeighborsClassifier(
        n_neighbors=N_NEIGHBORS,
        metric='cosine',
        algorithm='brute'
    )

    # Fit the model
    model_knn.fit(x_train_emb, y_train)

    # Save the k-NN model using pickle
    with open(model_file_path, 'wb') as model_file:
        pickle.dump(model_knn, model_file)
else:
    # Load the pre-trained k-NN model
    with open(model_file_path, 'rb') as model_file:
        model_knn = pickle.load(model_file)

def load_wav_file(file_path, sampling_rate):
    """Load a WAV file using librosa."""
    audio_data, _ = librosa.load(file_path, sr=sampling_rate)
    return audio_data

# Define a function to calculate similarity and accuracy
def calculate_similarity_and_accuracy(file_path_1, file_path_2, model, feature_extractor, device, threshold=0.86):
    # Load WAV files
    wav_file_1 = load_wav_file(file_path_1, SAMPLING_RATE)
    wav_file_2 = load_wav_file(file_path_2, SAMPLING_RATE)

    # Extract embeddings
    x_wav_files = [wav_file_1, wav_file_2]
    embeddings = extract_embeddings_batch(model, feature_extractor, x_wav_files, device)

    embedding_1 = embeddings[0]
    embedding_2 = embeddings[1]

    # Calculate cosine similarity
    cosine_sim = torch.nn.CosineSimilarity(dim=-1)
    similarity = cosine_sim(embedding_1, embedding_2)

    # Print similarity and determine if speakers are the same based on the threshold
    print(f"\nSimilarity: {similarity.item()}")
    if similarity < threshold:
        print("Speakers are not the same")
        return False
    else:
        print("Speakers are the same")
        return True

if __name__ == "__main__":
    app.run(debug=True)
