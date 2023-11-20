import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../Assets/SignIn.css';
import {Link} from "react-router-dom";
import AudioRecorder from "./AudioRecorder.jsx";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // TODO: Handle voice recording upload
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signInContainer">
            <form onSubmit={handleSignUp} className="signInForm">
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
                <AudioRecorder/>
                <button type="submit">Sign Up</button>
                {error && <p className="errorMessage">{error}</p>}
            </form>

            <p className="signUpLink">Already have an account? <Link to="/signin">Sign in</Link></p>
        </div>
    );
};

export default SignUp;
