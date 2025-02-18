import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
        const cleanEmail = email.trim().toLowerCase();
        
        if (!cleanEmail || !password) {
            throw new Error('Please fill in all fields');
        }

        console.log('Attempting login with email:', cleanEmail);

        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: cleanEmail,
            password: password
        });

        console.log('Server response:', response.data);

        if (response.data && response.data.token) {
            login(response.data.token, response.data.user);
            navigate('/');
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (err) {
        console.error('Login error details:', err.response || err);
        setError(
            err.response?.data?.error || 
            err.message || 
            'Unable to login. Please check your credentials.'
        );
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>
            <span className="welcome-text">Welcome to</span>
            <span className="app-name">TaskMaster</span>
          </h2>
          <p className="auth-subtitle">Your personal productivity companion</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
          />
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span role="img" aria-hidden="true">
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </button>
          </div>
          <button 
            type="submit" 
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
