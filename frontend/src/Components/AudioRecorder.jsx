import React, { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

function AudioRecorder() {
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
        if (audioBlob) {
            const storageRef = ref(storage, `audios/${new Date().getTime()}.wav`);
            try {
                await uploadBytes(storageRef, audioBlob);
                console.log('Audio uploaded to Firebase Storage!');
            } catch (error) {
                console.error('Error uploading the file', error);
            }
        }
    };

    return (
        <div className="container">
            <div className="recorder">
                <button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {isRecording || (
                    <button onClick={uploadAudioToFirebase} disabled={!audioBlob}>
                        Upload to Firebase
                    </button>
                )}
            </div>

            <div className="player">
                {audioURL && <audio src={audioURL} controls />}
            </div>
        </div>
    );
}

export default AudioRecorder;
