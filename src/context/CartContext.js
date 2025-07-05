import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingIndex !== -1) {
        // If product already exists, update its quantity
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingIndex];

        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 1) + (item.quantity || 1),
        };

        return updatedItems;
      } else {
        // If product is new, add it with default quantity
        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
