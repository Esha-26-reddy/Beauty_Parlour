import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        aria-label="Go back to previous page"
      >
        <FaArrowLeft size={18} /> Back
      </button>
      <h1 className="site-title">My Website</h1>
    </header>
  );
};

export default Header;
