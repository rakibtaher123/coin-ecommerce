import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  // কার্টে যোগ করার ফাংশন
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        console.log("Item already added to cart!");
        return prevCart;
      }
      return [...prevCart, product];
    });
  };

  // কার্ট থেকে ডিলিট করার ফাংশন
  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (err) { /* ignore */ }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);