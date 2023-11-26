import React, {useState, useRef, useCallback} from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import { useNavigate } from 'react-router-dom';
import '../Assets/AudioRecorder.css'
import axios from 'axios';

const AudioRecorder = ({ userEmail, isSignUp }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorder = useRef(null);
  const storage = getStorage();
  const pathSuffix = isSignUp ? 'signup' : 'signin';
  const navigate = useNavigate();


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000
      });
      mediaRecorder.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing the microphone', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stopRecording(() => {
        let blob = mediaRecorder.current.getBlob();
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
      });
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
      return;
    }
  
    try {
      const audioStorageRef = ref(storage, `audios/${userEmail}/${pathSuffix}.wav`);
      await uploadBytes(audioStorageRef, audioBlob);
  
      if (!isSignUp) {
        // For sign-in, only trigger the Flask backend with the user's email
        const response = await axios.post('api/voice-verify', { userEmail: userEmail }, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
          if (response.data.verificationSuccess) {
            navigate('/dashboard');
          } else {
            navigate('/failedverification');
      }
      } else {
        alert('Audio uploaded to Firebase Storage!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [drag, setDrag] = useState(false);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setDrag(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setDrag(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    setDrag(false);
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type === "audio/wav") {
      const file = files[0];
      setAudioBlob(file);
      setAudioURL(URL.createObjectURL(file));
    } else {
      alert("Please drop a .wav file.");
    }
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={isRecording ? stopRecording : startRecording} className="record-button">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      {isRecording && <p style={{ fontSize: '20px', textAlign: 'center' }}>Recording...</p>}
      {audioURL && <audio controls src={audioURL} />}
      <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: drag ? "2px dashed #000" : "2px dashed #aaa",
            padding: "20px",
            textAlign: 'center',
            marginTop: '20px',
            backgroundColor: drag ? "#e3e3e3" : ""
          }}
      >
        Drag and drop a .wav file here
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {!isRecording && audioBlob && (
            <button onClick={uploadAudioToFirebase} className="record-button">
              Upload to Firebase
            </button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
