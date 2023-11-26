import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Assets/FailedVerification.css';
import warning from '../Images/warning.png'

const FailedVerification = () => {
    const navigate = useNavigate();

    const handleGoBackToSignIn = () => {
        navigate('/');
    };

    return (
        <div className="verification-failure">
            <img src={warning} height="200px" width="200px" alt="warning logo" />
            <h2>Verification Failed</h2>
            <p>Sorry, we could not verify your identity. If you think this is an error, please try again.</p>
            <button onClick={handleGoBackToSignIn} className="btn">
                Return to Sign In
            </button>
        </div>
    );
};

export default FailedVerification;
