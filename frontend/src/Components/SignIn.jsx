import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import '../Assets/Authentication.css';
import {Link, useNavigate} from "react-router-dom";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import Header from "./Header.jsx";

const SignIn = ({ setUserEmail }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const storage = getStorage();
    const [audioStorageRef, setAudioStorageRef] = useState(null);


    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);

            const emailStorageRef = ref(storage, `audios/${email}`);
            setAudioStorageRef(emailStorageRef);

            setUserEmail(email);

            navigate('/recordsignin', { state: { userEmail: email } });
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Header/>
            <div className="signInContainer">
                <form onSubmit={handleSignIn} className="signInForm">
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
                    />
                    <p style={{fontSize: '15px', textAlign: 'right', marginBottom: '20px'}} className="link"><Link to="/forgotpassword">Forgot Password?</Link></p>
                    <button type="submit">Sign In</button>
                    {error && <p>{error}</p>}
                </form>
                <p className="link">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
        </div>
    );
};

export default SignIn;