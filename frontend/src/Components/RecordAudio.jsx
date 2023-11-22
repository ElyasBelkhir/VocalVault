import AudioRecorder from './AudioRecorder';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RecordAudio = () => {
  const location = useLocation();
  const { userEmail } = location.state || {};

  useEffect(() => {
    if (userEmail) {
      console.log('User is signed in. Ready to record audio!');
    } else {
      console.log('User is not signed in. Please sign in to record audio.');
    }
  }, [userEmail]);

  return (
    <div>
      <h2>Record Audio Page</h2>
      <AudioRecorder userEmail={userEmail} />
    </div>
  );
};

export default RecordAudio;
