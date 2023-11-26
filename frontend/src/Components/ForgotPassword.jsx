import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import '../Assets/Authentication.css'
import {Link} from "react-router-dom";
import Header from "./Header.jsx";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const auth = getAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Check your inbox for further instructions');
        } catch (error) {
            setMessage('Error resetting password: ' + error.message);
        }
    };

    return (
        <div>
            <Header/>
            <div className="signInContainer">
                <form onSubmit={handleSubmit} className="signInForm">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit" style={{marginTop: '25px'}}>Reset Password</button>
                    <p style={{fontSize: '17px', textAlign: 'right'}} className="link"><Link to="/signin">Back to sign in</Link></p>
                </form>
                {message && <p style={{textAlign: 'center'}}>{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
