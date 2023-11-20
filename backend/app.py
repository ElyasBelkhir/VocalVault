from flask import Flask, render_template, request
import torch
import numpy as np
from tqdm import tqdm
from transformers import Wav2Vec2FeatureExtractor
from transformers import WavLMForXVector
import librosa
import os

# Initialize Flask app
app = Flask(__name__)

# Extract embedding vector for each audio sample using pre-trained
# model for speaker verification (WavLM)
device = "cuda" if torch.cuda.is_available() else "cpu"
feature_extractor_wav2vec = Wav2Vec2FeatureExtractor.from_pretrained(
    "microsoft/wavlm-base-plus-sv")
model_wav_lm = WavLMForXVector.from_pretrained(
    "microsoft/wavlm-base-plus-sv").to(device)

N_SECONDS_SEGMENT = 4
SAMPLING_RATE = 16000

def extract_embeddings(model, feature_extractor, data, device):
    """Use WavLM model to extract embeddings for audio segments"""
    emb_train = list()
    for i in tqdm(range(len(data))):
        # Add padding to ensure compatibility
        padded_data = np.pad(data[i], (0, max(0, SAMPLING_RATE * N_SECONDS_SEGMENT - data[i].shape[0])), 'constant')
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

        emb_train += torch.nn.functional.normalize(
            embeddings.cpu(), dim=-1).cpu()

    return torch.stack(emb_train)

def load_wav_file(file_path, sampling_rate):
    """ Load a WAV file. """
    audio, _ = librosa.load(file_path, sr=sampling_rate)
    return audio

# Update compare_audio function to return result
def compare_audio(file_name_1, file_name_2):
    file_path_1 = f"./{file_name_1}"
    file_path_2 = f"./{file_name_2}"

    wav_file_1 = load_wav_file(file_path_1, SAMPLING_RATE)
    wav_file_2 = load_wav_file(file_path_2, SAMPLING_RATE)

    x_wav_files = [wav_file_1, wav_file_2]
    embeddings = extract_embeddings(model_wav_lm, feature_extractor_wav2vec, x_wav_files, device)

    embedding_1 = embeddings[0]
    embedding_2 = embeddings[1]

    cosine_sim = torch.nn.CosineSimilarity(dim=-1)
    similarity = cosine_sim(embedding_1, embedding_2)
    threshold = 0.86

    if similarity < threshold:
        return "Speakers are not the same"
    else:
        return "Speakers are the same"

# Update compare_speakers function to handle result
@app.route('/', methods=['GET', 'POST'])
def index():
    result = None

    if request.method == 'POST':
        file_1 = request.files['file1']
        file_2 = request.files['file2']

        file_path_1 = 'temp_file_1.wav'
        file_path_2 = 'temp_file_2.wav'
        file_1.save(file_path_1)
        file_2.save(file_path_2)

        result = compare_audio(file_path_1, file_path_2)

        os.remove(file_path_1)
        os.remove(file_path_2)

    return render_template('index.html', result=result)

if __name__ == "__main__":
    app.run(debug=True)