import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../Assets/SignIn.css';
import {Link, useNavigate} from "react-router-dom";
import { getStorage, ref, uploadBytes } from 'firebase/storage';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const [audioStorageRef, setAudioStorageRef] = useState(null);
    const storage = getStorage();
    const [userEmail, setUserEmail] = useState(null);


    const handleSignIn = async (e) => {
        e.preventDefault();
        const storage = getStorage();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Create the audio storage reference using the user's email
            const emailStorageRef = ref(storage, `audios/${email}`);
            setAudioStorageRef(emailStorageRef);

            // Set the user email in the state
            setUserEmail(email);

            // Redirect to the /recordaudio page after successful sign-up
            navigate('/recordaudio', { state: { userEmail: email } });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="signInContainer">
            <form onSubmit={handleSignIn} className="signInForm">
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
                <button type="submit">Sign In</button>
                {error && <p>{error}</p>}
            </form>
            {/* TODO: Implement Voice Authentication Section */}
            <p className="signUpLink">Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
    );
};

export default SignIn;