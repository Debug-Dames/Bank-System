import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

export default function Register() {
  const navigate = useNavigate();

  // Keep all input values in one state object for easier updates.
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Store feedback messages so the user understands what happened.
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generic input handler: update only the field that changed.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Basic front-end validation before "submitting" registration.
  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return 'Please fill in all fields.';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (password.trim().toLowerCase() === 'password') {
      return 'Password cannot be "password". Choose a stronger password.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Reset previous messages each time user submits.
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // For now we save a mock user locally (no backend yet).
    const registeredUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };
    localStorage.setItem('registeredUser', JSON.stringify(registeredUser));

    setSuccess('Registration successful. Redirecting to login...');

    // Small delay so user can read the success message, then navigate.
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Fill in your details to register.</p>

        {error && <p className="auth-message auth-message-error">{error}</p>}
        {success && <p className="auth-message auth-message-success">{success}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
            />
          </div>

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
              placeholder="Minimum 8 characters"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Register
          </button>
        </form>

        <p className="auth-switch-text">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}
