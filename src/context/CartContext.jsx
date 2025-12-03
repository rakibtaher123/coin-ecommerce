import React, { createContext, useContext, useState } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create a "hook" to use the context
export const useCart = () => {
  return useContext(CartContext);
};

// 3. Create the Provider component (which holds the data)
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    // Check if item is already in cart
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);
      if (itemExists) {
        // Just increase quantity
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    console.log("Added to cart:", product);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const cart = {
    items: cartItems,
    addToCart,
    removeFromCart,
    itemCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  };

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};