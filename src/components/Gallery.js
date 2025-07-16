import React from 'react';
import './Gallery.css';

// Dynamically import all images from the pictures folder
const importAll = (requireContext) => requireContext.keys().map(requireContext);

const images = importAll(
  require.context('../assets/pictures', false, /\.(png|jpe?g|svg)$/)
);

const Gallery = () => {
  return (
    <div className="gallery-container">
      <h1>Our Work</h1>
      <div className="image-grid">
        {images.map((imgSrc, index) => (
          <div key={index} className="image-card">
            <img src={imgSrc} alt={`Parlour ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
