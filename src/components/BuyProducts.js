import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import "./BuyProducts.css";

const BuyProducts = () => {
  return (
    <div className="products-page">
      <h2 className="products-heading">Buy Products</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>

            {/* ✅ Add Pack Size here */}
            <p className="product-packsize" style={{
        
              marginBottom: "4px"
            }}>
              Pack Size: {product.packSize}
            </p>

            <p className="product-price">₹{product.price}</p>
            <Link to={`/buynow/${product.id}`} className="buy-now-link">
              Buy Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyProducts;
