import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from './Auth';
import firestore from './firebase';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Home from './Home';
import ScrolltoTop from './ScrolltoTop.js';
import Signup from './Signup.js';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  } , []);
  
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Auth />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Navigate to="/" />} />
        <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />
      </Routes>
        
      </Router>      
    </div>
  );
};


export default App;
