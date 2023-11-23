import AudioRecorder from './AudioRecorder';
import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import '../Assets/RecordAudio.css'

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
