import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import "./Allproducts.css";

const Allproducts = () => {
  return (
    <div className="products-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img src={product.image} alt={product.name} className="product-img" />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <Link to={`/buy/${product.id}`} className="buy-now-btn">
            Buy Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Allproducts;
