import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../Assets/SignIn.css';
import {Link, useNavigate} from "react-router-dom";
import AudioRecorder from "./AudioRecorder.jsx";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Redirect to the /recordaudio page after successful sign-up
            navigate('/recordaudio');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signInContainer">
            <div className="signInForm">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit" onClick={handleSignUp}>Sign Up</button>
                {error && <p className="errorMessage">{error}</p>}
            </div>

            <p className="signUpLink">Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
    );
};

export default SignUp;
