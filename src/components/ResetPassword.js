import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('resetEmail'); // Comes from VerifyCode

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        code,
        newPassword,
      });

      alert('Password reset successful! Please login.');
      localStorage.removeItem('resetEmail');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#e91e63' }}>Reset Password</h2>

      {error && <p style={errorStyle}>{error}</p>}

      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Enter 6-digit verification code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>Reset Password</button>
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

const inputStyle = {
  width: '100%',
  marginBottom: 15,
  padding: 10,
  fontSize: 16,
  borderRadius: 5,
  border: '1px solid #ccc',
  boxSizing: 'border-box',
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
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  marginBottom: 10,
  textAlign: 'center',
};

export default ResetPassword;
