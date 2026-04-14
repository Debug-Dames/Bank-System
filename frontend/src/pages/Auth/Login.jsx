import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    pin: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    if (!formData.username || !formData.pin) {
      setError('Please enter both username and PIN.');
      setLoading(false);
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (!savedUser) {
      setError('No registered account found. Please register first.');
      setLoading(false);
      return;
    }

    const usernameMatches = formData.username === savedUser.email;
    const pinMatches = formData.pin === savedUser.password;

    if (!usernameMatches || !pinMatches) {
      setError('Invalid username or PIN.');
      setLoading(false);
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(savedUser));
    setSuccess('Login successful. Redirecting...');

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-shell auth-shell--compact">
        <div className="auth-intro">
          <img
            src="/novaBank-logo.jpg"
            alt="Nova Bank"
            className="auth-logo"
          />
          <h1 className="auth-page-title">Welcome Back</h1>
          <p className="auth-page-subtitle">Sign in to continue to your account.</p>
        </div>

        <section className="auth-panel">
          <div className="auth-panel__head">
            <h2 className="auth-panel__title">Login Details</h2>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="username">Email</label>
              <input
                id="username"
                name="username"
                type="email"
                value={formData.username}
                onChange={handleChange}
                placeholder="test@bank.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="pin">PIN</label>
              <input
                id="pin"
                name="pin"
                type="password"
                value={formData.pin}
                onChange={handleChange}
                placeholder="Enter your PIN"
                autoComplete="current-password"
              />
            </div>

            <div className="auth-actions">
              <Button type="submit" size="lg" loading={loading}>
                Sign In
              </Button>
            </div>
          </form>

          <p className="auth-switch-text">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
