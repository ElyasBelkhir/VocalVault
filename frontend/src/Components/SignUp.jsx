import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../Assets/SignIn.css';
import {Link, useNavigate} from "react-router-dom";
import AudioRecorder from "./AudioRecorder.jsx";
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const SignUp = ({ setUserEmail }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const storage = getStorage();
    const [audioStorageRef, setAudioStorageRef] = useState(null);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Create the audio storage reference using the user's email
            const emailStorageRef = ref(storage, `audios/${email}`);
            setAudioStorageRef(emailStorageRef);

            // Set the user email in the state
            setUserEmail(email);
            /// Redirect to the /recordaudio page after successful sign-up
            navigate('/recordaudio', { state: { userEmail: email } });
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
