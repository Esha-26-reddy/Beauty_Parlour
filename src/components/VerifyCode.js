// src/components/VerifyCode.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyCode = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/verify-code', { email, code });

      alert('Code verified successfully');
      localStorage.setItem('resetEmail', email); // Store email for password reset
      navigate('/reset-password');
    } catch (err) {
      console.error("Verification Error:", err);
      setError(err.response?.data?.message || 'Invalid verification code');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#e91e63', textAlign: 'center' }}>Verify Code</h2>

      {error && <p style={errorStyle}>{error}</p>}

      <form onSubmit={handleVerify}>
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Verify</button>
      </form>
    </div>
  );
};

// ✅ Styles
const containerStyle = {
  maxWidth: 400,
  margin: '80px auto',
  padding: 30,
  border: '1px solid #eee',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  backgroundColor: '#fff'
};

const inputStyle = {
  width: '100%',
  marginBottom: 15,
  padding: 10,
  fontSize: 16,
  borderRadius: 5,
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%',
  padding: 10,
  backgroundColor: '#e91e63',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 16,
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer'
};

const errorStyle = {
  color: 'red',
  marginBottom: 10,
  textAlign: 'center'
};

export default VerifyCode;
