import React, { useState } from 'react';
import './Assets/App.css';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./Components/SignIn.jsx";
import SignUp from './Components/SignUp.jsx'
import RecordAudioSignUp from "./Components/RecordAudioSignUp.jsx";
import RecordAudioSignIn from "./Components/RecordAudioSignIn.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import Dashboard from './Components/Dashboard.jsx';
import FailedVerification from "./Components/FailedVerification.jsx";

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

  const [userEmail, setUserEmail] = useState(null);

  return (
      <BrowserRouter>
        <div className="container">
          <Routes>
            <Route path="/" element={<SignIn setUserEmail={setUserEmail} />}/>
            <Route path="/signin" element={<SignIn setUserEmail={setUserEmail} />} />
            <Route path="/signup" element={<SignUp setUserEmail={setUserEmail} />}/>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/recordsignin" element={<RecordAudioSignIn />} />
            <Route path="/recordsignup" element={<RecordAudioSignUp />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/failedverification" element={<FailedVerification/>} />
          </Routes>
        </div>
      </BrowserRouter>
  );
}
export default App;

