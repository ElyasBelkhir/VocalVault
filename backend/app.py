from flask import Flask, request, jsonify
import torch
import firebase_admin
from firebase_admin import credentials, storage
import numpy as np
from transformers import Wav2Vec2FeatureExtractor, WavLMForXVector
import librosa
import os
from dotenv import load_dotenv, find_dotenv

# Initialize Flask app
app = Flask(__name__)

load_dotenv(find_dotenv())

# Initialize Firebase app
cred = credentials.Certificate('service-key.json')
firebase_project_id = os.environ.get('FIREBASE_PROJECT_ID')
firebase_admin.initialize_app(cred, {
    'storageBucket': f'{firebase_project_id}.appspot.com'
})

# Extract embedding vector for each audio sample using pre-trained model for speaker verification (WavLM)
device = "cuda" if torch.cuda.is_available() else "cpu"
feature_extractor_wav2vec = Wav2Vec2FeatureExtractor.from_pretrained("microsoft/wavlm-base-plus-sv")
model_wav_lm = WavLMForXVector.from_pretrained("microsoft/wavlm-base-plus-sv").to(device)

N_SECONDS_SEGMENT = 4
SAMPLING_RATE = 16000

def extract_embeddings(model, feature_extractor, data, device):
    """Use WavLM model to extract embeddings for audio segments"""
    emb_train = list()
    for i in range(len(data)):
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

        emb_train += embeddings_normalized.cpu()

    return torch.stack(emb_train)

def load_wav_file(file_path, sampling_rate):
    """ Load a WAV file. """
    audio, _ = librosa.load(file_path, sr=sampling_rate)
    return audio

def compare_audio(file_name_1, file_name_2):
    # Load initial and new audio files
    wav_file_1 = load_wav_file(file_name_1, SAMPLING_RATE)
    wav_file_2 = load_wav_file(file_name_2, SAMPLING_RATE)

    x_wav_files = [wav_file_1, wav_file_2]
    embeddings = extract_embeddings(model_wav_lm, feature_extractor_wav2vec, x_wav_files, device)

    embedding_1 = embeddings[0]
    embedding_2 = embeddings[1]

    cosine_sim = torch.nn.CosineSimilarity(dim=-1)
    similarity = cosine_sim(embedding_1, embedding_2)
    threshold = 0.86

    return similarity.item() >= threshold

def download_blob_from_firebase(user_email, path_suffix, local_file_name):
    """Download a blob from Firebase Storage."""
    bucket = storage.bucket()
    blob = bucket.blob(f'audios/{user_email}/{path_suffix}.wav')
    blob.download_to_filename(local_file_name)
    
@app.route('/api/voice-verify', methods=['POST'])
def verify():
    print("Received verification request")

    user_email = request.json.get('userEmail')
    if not user_email:
      return jsonify({'error': 'No email provided'}), 400
    
    local_signup_audio = 'temp_signup.wav'
    local_signin_audio = 'temp_signin.wav'

     # Download the sign-up and sign-in audio files from Firebase
    download_blob_from_firebase(user_email, 'signup', local_signup_audio)
    download_blob_from_firebase(user_email, 'signin', local_signin_audio)

    # Compare the audio files using the local paths
    result = compare_audio(local_signup_audio, local_signin_audio)
    print(f"Verification result for user {user_email}: {'Speakers are the same' if result else 'Speakers are not the same'}")

    # Clean up temporary files
    os.remove(local_signup_audio)
    os.remove(local_signin_audio)

    is_verified = result
    return jsonify({"verificationSuccess": is_verified})

if __name__ == "__main__":
    app.run(debug=True)
