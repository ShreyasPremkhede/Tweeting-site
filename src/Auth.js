// Auth.js
import React, { useState } from 'react';
import { auth, provider } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ErrorDialog from './ErrorDialog'; // Import the ErrorDialog component
import './App.css'; // Import the CSS file

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home'); // Navigate to home page after sign in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/home'); // Navigate to home page after Google sign in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        className="input-email"
        type="text"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input-password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />

      <button onClick={handleSignin}>Sign In</button>
      <button className="google-button" onClick={handleSignInWithGoogle}>Sign In with Google</button>
      <h3>OR</h3>
      <button className="signup-link" onClick={() => navigate('/signup')}>
        Sign Up
      </button>

      <ErrorDialog message={error} onClose={handleCloseError} />
    </div>
  );
};

export default Auth;
