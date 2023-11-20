import React, { useState, useRef } from 'react';

function AudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorder = useRef(null);

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

    const handleUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'audio/wav') {
            setAudioBlob(file);
            setAudioURL(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'audio/wav') {
            setAudioBlob(file);
            setAudioURL(URL.createObjectURL(file));
        }
    };

    return (
        <div className="container">
            <div className="recorder">
                <button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

            <div className="player">
                {audioURL && <audio src={audioURL} controls />}
            </div>

            <div className="upload" onDragOver={handleDragOver} onDrop={handleDrop}>
                <label htmlFor="audioUpload" className="label-upload">
                    Upload WAV File
                </label>
                <input
                    id="audioUpload"
                    type="file"
                    accept=".wav"
                    onChange={handleUpload}
                    style={{ display: 'none' }} // Hide the default input
                />
            </div>
        </div>
    );
}

export default AudioRecorder;
