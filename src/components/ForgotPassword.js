import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // Import CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/forgot-password',
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(res.data.message || 'Verification code sent! Check your email.');

      setTimeout(() => {
        navigate('/verify-code');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Forgot Password</h2>

      {message && (
        <>
          <p style={successStyle}>{message}</p>
          <p style={{ textAlign: 'center' }}>
            <Link to="/verify-code" className="link-custom">
              Enter verification code
            </Link>
          </p>
        </>
      )}

      {error && <p style={errorStyle}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={inputStyle}
        />
        <button type="submit" disabled={loading} className="button-custom">
          {loading ? 'Sending...' : 'Send Verification Code'}
        </button>
      </form>

      <p style={footerTextStyle}>
        Remembered password?{' '}
        <Link to="/login" className="link-custom">
          Login
        </Link>
      </p>
    </div>
  );
};

const containerStyle = {
  maxWidth: 400,
  margin: '80px auto',
  padding: 30,
  border: '1px solid #eee',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff',
};

const headingStyle = {
  textAlign: 'center',
  color: '#e91e63',
  marginBottom: 20,
};

const inputStyle = {
  width: '100%',
  marginBottom: 15,
  padding: 10,
  fontSize: 16,
  borderRadius: 5,
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

const successStyle = {
  color: 'green',
  textAlign: 'center',
  marginBottom: 10,
};

const errorStyle = {
  color: 'red',
  textAlign: 'center',
  marginBottom: 10,
};

const footerTextStyle = {
  textAlign: 'center',
  marginTop: 15,
};

export default ForgotPassword;
