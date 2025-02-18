import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';  // Add this import

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting signup with:', {
        email: formData.email.toLowerCase(),
        username: formData.username
      });

      // Basic validation
      if (!formData.username || !formData.email || !formData.password) {
        throw new Error('All fields are required');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Update the endpoint URL to match server route
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',  // Changed from '/api/users/signup'
        {
          username: formData.username.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        }
      );

      console.log('Signup response:', response.data);

      // Check response
      if (response.data.success && response.data.token) {
        login(response.data.token, response.data.user);
        navigate('/');
      } else {
        throw new Error('Signup failed - invalid response');
      }

    } catch (err) {
      console.error('Signup error:', err);
      setErrors({
        submit: err.response?.data?.error || err.message || 'Error creating account'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>
            <span className="welcome-text">Create Account</span>
            <span className="app-name">
              <span role="img" aria-label="sparkles">✨</span> TaskMaster
            </span>
          </h2>
          <p className="auth-subtitle">Start organizing your tasks today</p>
        </div>

        {errors.submit && (
          <div className="error-message">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          <div className="input-group password-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              <span role="img" aria-hidden="true">
                {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
              </span>
            </button>
          </div>

          <button 
            type="submit" 
            className={isLoading ? 'loading' : ''}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
