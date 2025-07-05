import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { FaArrowLeft } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [location]);

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  return (
    <header className="navbar">
      <div className="left-section">
        <button
          className={`back-button ${!canGoBack ? "disabled" : ""}`}
          onClick={handleBack}
          aria-label="Go back to previous page"
          disabled={!canGoBack}
        >
          <FaArrowLeft size={18} />
          Back
        </button>

        <div className="logo">Rohini Beauty Parlour</div>
      </div>

      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>

          {/* Services dropdown */}
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="dropdown-toggle">Services</span>
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
                      onClick={() => setDropdownOpen(false)}
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

          {/* 🛒 Cart with count */}
          <li className="cart-icon-wrapper">
            <Link to="/cart" className="cart-link" title="View Cart">
              🛒
              {cartItems.length > 0 && (
                <span className="cart-count">{cartItems.length}</span>
              )}
            </Link>
          </li>

          {/* Show "My Orders" only when user is logged in */}
          {isAuthenticated && (
            <li>
              <Link to="/order-history">My Orders</Link>
            </li>
          )}

          {/* Login/Logout */}
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
