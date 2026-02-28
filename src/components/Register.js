import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"

const Register = () => {
  const [formData, setFormData] = useState({ email: '', phone: '', password: '' });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundColor: '#f9f9f9'
    }}
  >
    <form
      onSubmit={handleSubmit}
      style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        padding: '25px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}
    >
      <h2 style={{ color: '#e91e63', marginBottom: '15px' }}>
        Register
      </h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </p>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
        style={{
          width: '100%',
          marginBottom: '12px',
          padding: '10px',
          boxSizing: 'border-box',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <input
        name="phone"
        type="text"
        placeholder="Phone"
        onChange={handleChange}
        value={formData.phone}
        required
        style={{
          width: '100%',
          marginBottom: '12px',
          padding: '10px',
          boxSizing: 'border-box',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
        required
        style={{
          width: '100%',
          marginBottom: '15px',
          padding: '10px',
          boxSizing: 'border-box',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#e91e63',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#e91e63', fontWeight: '500' }}>
          Login
        </Link>
      </p>
    </form>
  </div>
);
};

export default Register;
