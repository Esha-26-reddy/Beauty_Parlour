import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="logo">Rohini Beauty Parlour</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          
          {/* Dropdown for Services */}
          <li
            className="dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="dropdown-toggle">Services </span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="#skincare">Skincare Treatments</a></li>
                <li><a href="#hairstyling">Hair Styling</a></li>
                <li><a href="#facials">Facials</a></li>
                <li><a href="#waxing">Waxing</a></li>
                <li><a href="#threading">Threading</a></li>
                <li><a href="#bridalmakeup">Bridal Makeup</a></li>
              </ul>
            )}
          </li>

          <li>Gallery</li>
          <li>Testimonials</li>
          <li>Contact</li>
          <li className="phone">📞 +91 8978452925</li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
