import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
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
      // Convert email to lowercase before sending
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email.toLowerCase(),
        password: formData.password,
      });

      const { token, user } = res.data;
      login(token, user);
      localStorage.setItem("userEmail", user.email);
      navigate('/');
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '80px auto',
      padding: 30,
      border: '1px solid #eee',
      borderRadius: 10,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', color: '#e91e63' }}>Login</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          style={{
            width: '100%',
            marginBottom: 15,
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          style={{
            width: '100%',
            marginBottom: 15,
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            fontSize: 16,
            fontWeight: 'bold',
            backgroundColor: '#e91e63',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            transition: '0.3s ease',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Forgot Password Link */}
      <p style={{ textAlign: 'center', marginTop: 10 }}>
        <Link to="/forgot-password" style={{ color: '#e91e63', fontWeight: 'bold' }}>
          Forgot Password?
        </Link>
      </p>

      <p style={{ textAlign: 'center', marginTop: 15 }}>
        Don't have an account?{' '}
        <Link to="/register" style={{ color: '#e91e63', fontWeight: 'bold', borderRadius: 5 }}>
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
