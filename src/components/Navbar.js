import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
    setMenuOpen(false); // Close menu on route change
  }, [location]);

  const handleBack = () => {
    if (canGoBack) navigate(-1);
  };

  return (
    <header className="navbar">
      <div className="left-section">
        <button
          className={`back-button ${!canGoBack ? "disabled" : ""}`}
          onClick={handleBack}
          disabled={!canGoBack}
        >
          <FaArrowLeft size={16} />
          Back
        </button>

        <div className="logo">Rohini Beauty Parlour</div>
      </div>

      {/* Hamburger icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </div>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>

          <li className="dropdown">
            <span
              className="dropdown-toggle"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Services
            </span>

            {dropdownOpen && (
              <ul className="dropdown-menu">
                {[
                  "skincare-treatments",
                  "hair-cuts",
                  "facials",
                  "waxing",
                  "threading",
                  "manicure",
                  "pedicure",
                  "bridal-makeup",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      to={`/services/${service}`}
                      onClick={() => {
                        setDropdownOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {service
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li><Link to="/gallery">Gallery</Link></li>
          <li><Link to="/buy-products">Buy Products</Link></li>

          <li className="cart-icon-wrapper">
            <Link to="/cart" className="cart-link">
              🛒
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </li>

          {isAuthenticated && (
            <li>
              <Link to="/order-history">My Orders</Link>
            </li>
          )}

          {!isAuthenticated ? (
            <li>
              <Link to="/login">Login</Link> /{" "}
              <Link to="/register">Signup</Link>
            </li>
          ) : (
            <li>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
