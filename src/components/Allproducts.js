import React from "react";
import products from "../data/products"; // ✅ Ensure this path is correct
import "./Allproducts.css";

const Allproducts = () => {
  console.log("✅ Products imported:", products);

  return (
    <div className="products-container">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <img
            src={product.image}
            alt={product.name}
            className="product-img"
          />
          <h3 className="product-name">{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <p className="product-price">₹{product.price}</p>
          <button className="buy-now-btn">Buy Now</button>
        </div>
      ))}
    </div>
  );
};

export default Allproducts;
