import React, { createContext, useContext, useState, useEffect } from 'react';

// ১. কনটেক্সট তৈরি
const CartContext = createContext();

// ২. হুক তৈরি (Consumer)
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
};

// ৩. প্রোভাইডার তৈরি (Provider)
export const CartProvider = ({ children }) => {
  // --- State Initialization ---
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
      return [];
    }
  });

  // --- Local Storage Save ---
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems]);

  // --- Core Logic ---
  const addToCart = (product, quantityToAdd = 1) => {
    const qty = parseInt(quantityToAdd, 10);
    if (isNaN(qty) || qty < 1) return;

    setCartItems((prevItems) => {
      const itemExists = prevItems.find((item) => item.id === product.id);

      if (itemExists) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => setCartItems([]);

  // --- Calculations ---
  const itemCount = (cartItems || []).reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const totalPrice = (cartItems || []).reduce(
    (total, item) =>
      total + (item.price || 0) * (item.quantity || 0),
    0
  );

  const value = {
    items: cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    itemCount,
    totalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;