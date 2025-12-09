import React, { createContext, useState, useContext } from 'react';

// Context তৈরি করা হলো
const CartContext = createContext();

// Context ব্যবহার করার জন্য কাস্টম হুক
export const useCart = () => useContext(CartContext);

// Provider কম্পোনেন্ট যা ডেটা সরবরাহ করবে
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);


  const addToCart = (product) => {
  
    setCartItems(prevItems => [...prevItems, product]);
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
