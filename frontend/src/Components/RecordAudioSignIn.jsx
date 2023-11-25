import AudioRecorder from './AudioRecorder';
import React, {useEffect, useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Assets/RecordAudio.css'
import axios from 'axios';

const RecordAudioSignIn = () => {
  const location = useLocation();
  const { userEmail } = location.state || {};
  const [showRecorder, setShowRecorder] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRecorder(true);
    }, 5000); // This should match the duration of the text animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (userEmail) {
      console.log('User is signed in. Ready to record audio!');
    } else {
      console.log('User is not signed in. Please sign in to record audio.');
    }
  }, [userEmail]);

   // Function to handle voice data submission
   const handleSubmit = async () => {
    if (!voiceFile) {
        console.log('No voice file to submit');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('voiceFile', voiceFile);
        formData.append('email', userEmail);

        const response = await axios.post('/api/voice-verify', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (response.data.verificationSuccess) {
            navigate('/dashboard');
        } else {
            console.log('Voice verification failed');
        }
    } catch (error) {
        console.log('Error submitting voice data:', error);
    }
};

  return (
      <div className="container">
        <h1 className="textBlock">
          Welcome back {userEmail}! Please record or upload an audio clip of yourself so we can verify your identity
        </h1>
        {showRecorder && (
            <div className={`recordAudioContainer ${showRecorder ? 'animate' : ''}`}>
              <AudioRecorder userEmail={userEmail} isSignUp={false}/>
            </div>
        )}
      </div>
  );
};

export default RecordAudioSignIn;
