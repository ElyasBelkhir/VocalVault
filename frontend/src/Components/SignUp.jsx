import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import '../Assets/Authentication.css';
import {Link, useNavigate} from "react-router-dom";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Header from "./Header.jsx";

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

            const emailStorageRef = ref(storage, `audios/${email}`);
            setAudioStorageRef(emailStorageRef);

            setUserEmail(email);

            navigate('/recordsignup', { state: { userEmail: email } });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Header/>
            <div className="signInContainer">
                <div className="signInForm">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        style={{marginBottom: '45px'}}
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        style={{marginBottom: '45px'}}
                    />
                    <button type="submit" onClick={handleSignUp}>Sign Up</button>
                    {error && <p className="errorMessage">{error}</p>}
                </div>
                <p className="link">Already have an account? <Link to="/signin">Sign in</Link></p>
            </div>
        </div>
    );
};

export default SignUp;
