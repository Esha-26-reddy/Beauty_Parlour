import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '80px', maxWidth: 400, margin: 'auto' }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#e91e63' }}>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8, boxSizing:'border-box',borderRadius:5 }}
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone"
          onChange={handleChange}
          value={formData.phone}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8, boxSizing:'border-box', borderRadius:5}}
           
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
          style={{ width: '100%', marginBottom: 10, padding: 8 , boxSizing:'border-box',borderRadius:5}}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 10,
            backgroundColor: '#e91e63',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p style={{ marginTop: 15 , borderRadius:5}}>
          Already have an account? <Link to="/login" style={{ color: '#e91e63' }}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
