import React, { useEffect, useState } from 'react';
import './Assets/App.css';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./Components/SignIn.jsx";
import SignUp from './Components/SignUp.jsx'
import Header from "./Components/Header.jsx";
import AudioRecorder from './Components/AudioRecorder';
import RecordAudio from './Components/RecordAudio';

const firebaseConfig = {
  apiKey: "AIzaSyBPFPRCkDm0lbeLQOvym-bp0K9pI8JJI5Y",
  authDomain: "aim-project-cd9e0.firebaseapp.com",
  projectId: "aim-project-cd9e0",
  storageBucket: "aim-project-cd9e0.appspot.com",
  messagingSenderId: "644788453808",
  appId: "1:644788453808:web:e35c4695086b51bc6e5675",
  measurementId: "G-ECBERP0P8P"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
      <BrowserRouter>
        <Header/>
        <div className="container">
          <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/record" element={<AudioRecorder />} />
            <Route path="/recordaudio" element={<RecordAudio />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}
export default App;

