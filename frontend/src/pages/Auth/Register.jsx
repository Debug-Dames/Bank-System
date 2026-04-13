import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    const {
      firstName,
      lastName,
      idNumber,
      phone,
      email,
      password,
      confirmPassword
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !idNumber ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      return 'Please fill in all fields.';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address.';
    }

    if (idNumber.length < 5) {
      return 'Please enter a valid ID number.';
    }

    if (phone.length < 10) {
      return 'Please enter a valid phone number.';
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const registeredUser = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      idNumber: formData.idNumber,
      phone: formData.phone,
      email: formData.email,
      password: formData.password,
    };

    localStorage.setItem('registeredUser', JSON.stringify(registeredUser));

    setSuccess('Registration successful. Redirecting...');

    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <img
            src="/novaBank-logo.jpg"
            alt="Nova Bank"
            className="auth-logo"
          />
          <h1 className="auth-page-title">Create Account</h1>
          <p className="auth-page-subtitle">Fill in your details to open your banking profile.</p>
        </div>

        <section className="auth-panel">
          <div className="auth-panel__head">
            <h2 className="auth-panel__title">Personal Info</h2>
          </div>

          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className="auth-form auth-form--two-column">
            <div className="auth-field">
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                autoComplete="given-name"
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
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="idNumber">ID Number</label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Enter your ID number"
                inputMode="numeric"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </div>

            <div className="auth-field auth-field--full">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="test@bank.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field auth-field--full">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                autoComplete="new-password"
              />
              <span className="auth-hint">Use at least 8 characters.</span>
            </div>

            <div className="auth-field auth-field--full">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>

            <div className="auth-actions auth-actions--full">
              <Button type="submit" size="lg" loading={loading}>
                Create Account
              </Button>
            </div>
          </form>

          <p className="auth-switch-text">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
