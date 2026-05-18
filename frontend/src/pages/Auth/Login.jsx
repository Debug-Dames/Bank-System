import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { login } from "../../features/authSlice";
import './auth.css';

import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
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

    if (!formData.username.trim() || !formData.password) {
      setError('Please enter both ID number and password or PIN.');
      setLoading(false);
      return;
    }

    dispatch(
      login({
        idNumber: formData.username.trim(),
        password: formData.password,
      })
    )
      .unwrap()
      .then(() => {
        setSuccess('Login successful. Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      })
      .catch((err) => {
        setError(err || 'Login failed');
        setLoading(false);
      });
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
          <p className="auth-page-subtitle">
            Sign in with your ID number to continue.
          </p>
        </div>

        <section className="auth-panel">
          <div className="auth-panel__head">
            <h2 className="auth-panel__title">Login Details</h2>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="username">ID Number</label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your ID number"
                autoComplete="username"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="pin">Password or PIN</label>
              <input
                id="pin"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password or PIN"
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
