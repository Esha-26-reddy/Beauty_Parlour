import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css'; // reuse the same CSS file with .button-custom and .link-custom

const VerifyCode = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !code) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-code', {
        email,
        code,
      });

      setMessage(res.data.message || 'Code verified successfully!');
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('resetCode', code);

      setTimeout(() => {
        navigate('/reset-password');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Verify Code</h2>

      {message && <p style={successStyle}>{message}</p>}
      {error && <p style={errorStyle}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={{}} className="button-custom" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </form>
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

export default VerifyCode;
