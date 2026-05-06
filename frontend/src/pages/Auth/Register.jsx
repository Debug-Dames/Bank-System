import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { register } from "../../features/authSlice";

import './auth.css';

import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    phoneNumber: '',
    email: '',
    password: '',
    pin: '',
    confirmPassword: '',
  });

  const [localError, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      phoneNumber,
      email,
      password,
      confirmPassword,
      pin
    } = formData;

    if (
      !firstName ||
      !lastName ||
      !idNumber ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword ||
      !pin
    ) {
      return 'Please fill in all fields.';
    }

    if (!email.includes('@')) return 'Please enter a valid email address.';
    if (idNumber.length < 5) return 'Please enter a valid ID number.';
    if (phoneNumber.length < 10) return 'Please enter a valid phone number.';
    if (pin.length < 4) return 'PIN must be at least 4 digits.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';

    return '';
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  const errorMsg = validateForm();
  if (errorMsg) {
    setError(errorMsg);
    return;
  }

  const payload = {
    firstName: formData.firstName?.trim(),
    lastName: formData.lastName?.trim(),
    idNumber: formData.idNumber?.trim(),
    phoneNumber: formData.phoneNumber?.trim(),
    email: formData.email?.trim(),
    password: formData.password,
    confirmPassword: formData.confirmPassword,
    pin: formData.pin,
  };

  try {
    const result = await dispatch(register(payload));

    if (register.fulfilled.match(result)) {
      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setError(result.payload || "Registration failed");
    }
  } catch (err) {
    setError("Something went wrong. Please try again.");
  }
};

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-intro">
          <img src="/novaBank-logo.jpg" alt="Nova Bank" className="auth-logo" />
          <h1 className="auth-page-title">Create Account</h1>
          <p className="auth-page-subtitle">
            Fill in your details to open your banking profile.
          </p>
        </div>

        <section className="auth-panel">
          <div className="auth-panel__head">
            <h2 className="auth-panel__title">Personal Info</h2>
          </div>

          {localError && <Alert variant="error">{localError}</Alert>}
          {error && <Alert variant="error">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <form onSubmit={handleSubmit} className="auth-form auth-form--two-column">

            <div className="auth-field">
              <label>First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label>Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label>ID Number</label>
              <input name="idNumber" value={formData.idNumber} onChange={handleChange} />
            </div>

            <div className="auth-field">
              <label>Phone Number</label>
              <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>

            <div className="auth-field auth-field--full">
              <label>Email</label>
              <input name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="auth-field auth-field--full">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
            </div>

            <div className="auth-field auth-field--full">
              <label>PIN</label>
              <input type="password" name="pin" value={formData.pin} onChange={handleChange} />
            </div>

            <div className="auth-field auth-field--full">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <div className="auth-actions auth-actions--full">
              <Button type="submit" size="lg" loading={isLoading}>
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
