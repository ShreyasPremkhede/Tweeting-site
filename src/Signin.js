// create signin page in react

import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';



const Signin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signinuser = async () => {
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => console.log(userCredential)).catch((error) => console.error(error));
    }

    return (
        <div className="auth-container">
            <h2>Sign In here</h2>
            <input type="email" placeholder="Email" id="email" name="email" required></input>
            <input type="password" placeholder="Password" id="password" name="password" required></input>
            <button onClick ="signinuser">Sign in</button>
        </div>
    );
};

export default Signin;