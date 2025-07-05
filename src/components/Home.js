import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Chatbot from "./Chatbot";
import {
  FaComments,
  FaEnvelope,
  FaInstagram,
  FaPhoneAlt,
  FaArrowLeft,
  FaArrowRight
} from "react-icons/fa";

const heroSlides = [
  {
    image: "/images/vecteezy_ai-generated-beautiful-woman-with-long-curly-brown-hair_36804136.jpg",
    title: "Elegant Haircuts",
    description: "Transform your style with our trending haircuts."
  },
  {
    image: "/images/beautiful-young-woman-wearing-sari.jpg",
    title: "Bridal Perfection",
    description: "Flawless makeup for your big day."
  },
  {
    image: "/images/beautiful-woman-getting-beauty-treatment.jpg",
    title: "Glow Facial",
    description: "Refresh your skin with our radiant facial."
  },
  {
    image: "/images/woman-s-feet-bowl-with-water-petal (1).jpg",
    title: "Relaxing Pedicure",
    description: "Revive tired feet with expert care."
  },
  {
    image: "/images/mehndi-wedding-ornament-hands-drawn-by-henna.jpg",
    title: "Bridal Mehendi",
    description: "Intricate designs for your special moments."
  }
];

const Home = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  return (
    <div className="home-container">
      <section className="hero-carousel">
        <img
          key={currentSlide}
          src={heroSlides[currentSlide].image}
          alt={heroSlides[currentSlide].title}
          className="hero-carousel-image"
        />
        <div className="hero-text-overlay">
          <h1>{heroSlides[currentSlide].title}</h1>
          <p>{heroSlides[currentSlide].description}</p>
          <Link to="/appointment">
            <button className="appointment-button">Book Appointment</button>
          </Link>
        </div>

        <button className="arrow-button left-arrow" onClick={goToPrev}>
          <FaArrowLeft />
        </button>
        <button className="arrow-button right-arrow" onClick={goToNext}>
          <FaArrowRight />
        </button>
      </section>

      <section className="parlour-info">
        <h2>Parlour Timings</h2>
        <p>
          We are open from <strong>12:00 PM to 7:30 PM</strong>, Monday to Sunday.
        </p>
        <p>
          <strong>Note:</strong> We are closed on <span className="closed-day">Tuesdays</span>.
        </p>
      </section>

      <div className="chat-icon-wrapper">
        <button
          onClick={() => setShowChatbot((prev) => !prev)}
          className="chat-button"
        >
          <FaComments />
        </button>
      </div>

      {showChatbot && (
        <div className="chatbot-box">
          <Chatbot />
        </div>
      )}

      <footer className="footer">
        <p>Contact Us:</p>
        <div className="footer-links">
          <a href="tel:+91 9876543210" className="footer-link">
            <FaPhoneAlt /> +91 98765 43210
          </a>
          <a
            href="mailto:rohinibeautyparlour@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaEnvelope /> rohinibeautyparlour@gmail.com
          </a>
          <a
            href="https://instagram.com/rohinibeauty"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            <FaInstagram /> @rohinibeauty
          </a>
        </div>
        <p>© 2025 Rohini Beauty Parlour. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
