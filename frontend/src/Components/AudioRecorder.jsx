// AudioRecorder.jsx
import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const AudioRecorder = ({ userEmail }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const storage = getStorage();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = handleDataAvailable;
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing the microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setAudioBlob(event.data);
      setAudioURL(URL.createObjectURL(event.data));
    }
  };

  const uploadAudioToFirebase = async () => {
    if (!audioBlob || !userEmail) {
      alert('Please record something before uploading.');
    } else {
      try {
        // Use userEmail to create a unique storage reference
        const audioStorageRef = ref(storage, `audios/${userEmail}`);
        await uploadBytes(audioStorageRef, audioBlob);
        console.log('Audio uploaded to Firebase Storage!');
      } catch (error) {
        console.error('Error uploading the file', error);
      }
    }
  };  

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={isRecording ? stopRecording : startRecording} className="record-button">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {isRecording && <p style={{ fontSize: '20px', textAlign: 'center' }}>Recording...</p>}
      {audioURL && <audio controls src={audioURL} />}
      <div style={{ textAlign: 'center' }}>
        {isRecording || (
          <button onClick={uploadAudioToFirebase} style={{ marginTop: '20px' }}>
            Upload to Firebase
          </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
