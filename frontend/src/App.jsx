import React, { useEffect, useState } from 'react';
import './Assets/App.css';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { getStorage, ref } from 'firebase/storage';
import SignIn from "./Components/SignIn.jsx";
import SignUp from './Components/SignUp.jsx'
import Header from "./Components/Header.jsx";
import RecordAudioSignUp from "./Components/RecordAudioSignUp.jsx";
import RecordAudioSignIn from "./Components/RecordAudioSignIn.jsx";

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
  const [audioStorageRef, setAudioStorageRef] = useState(null);
  const storage = getStorage();
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Set the audio storage reference using the user's email
      if (user) {
        const emailStorageRef = ref(storage, `audios/${user.email}`);
        setAudioStorageRef(emailStorageRef);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, storage]);

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
            <Route path="/" element={<SignIn setUserEmail={setUserEmail} />}/>
            <Route path="/signin" element={<SignIn setUserEmail={setUserEmail} />} />
            <Route path="/signup" element={<SignUp setUserEmail={setUserEmail} />}/>
            <Route path="/recordsignin" element={<RecordAudioSignIn />} />
            <Route path="/recordsignup" element={<RecordAudioSignUp />} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}
export default App;

