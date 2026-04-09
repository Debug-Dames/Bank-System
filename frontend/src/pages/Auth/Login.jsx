import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

export default function Login() {
  const navigate = useNavigate();

  // Keep login form fields together for simpler state updates.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Feedback messages shown below the subtitle.
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Update whichever input changed by using its "name" attribute.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Basic required field check.
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    // Read registered user saved during registration.
    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!savedUser) {
      setError('No registered account found. Please register first.');
      return;
    }

    // Compare entered credentials with stored credentials.
    const emailMatches = formData.email === savedUser.email;
    const passwordMatches = formData.password === savedUser.password;

    if (!emailMatches || !passwordMatches) {
      setError('Invalid email or password.');
      return;
    }

    // Save the active user session for later features.
    localStorage.setItem('currentUser', JSON.stringify(savedUser));
    setSuccess('Login successful. Redirecting to dashboard...');

    // Move to dashboard after a short delay so user sees success message.
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to access your account.</p>

        {error && <p className="auth-message auth-message-error">{error}</p>}
        {success && <p className="auth-message auth-message-success">{success}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <p className="auth-switch-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
