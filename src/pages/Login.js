import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>MediRemind</h1>
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleAuth}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button type="submit" className="btn-primary">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      
      <p>
        {isSignUp 
          ? 'Already have an account?' 
          : "Don't have an account?"} 
        <button 
          className="btn-link" 
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? 'Login' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
}

export default Login;