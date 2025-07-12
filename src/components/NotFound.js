import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={containerStyle}>
    <h1 style={headingStyle}>404 - Page Not Found</h1>
    <p>The page you are looking for doesn't exist.</p>
    <Link to="/" style={linkStyle}>Go back to Home</Link>
  </div>
);

const containerStyle = {
  textAlign: 'center',
  marginTop: '100px',
  padding: '40px',
};

const headingStyle = {
  fontSize: '48px',
  color: '#e91e63',
  marginBottom: '20px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#2196f3',
  fontSize: '18px',
};

export default NotFound;
