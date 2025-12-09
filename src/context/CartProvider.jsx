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
      // আমরা 'cartItems' কি (Key) ব্যবহার করছি যাতে অন্য পেজের সাথে মিলে যায়
      const raw = localStorage.getItem('cartItems');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to load cart from localStorage", err);
      return [];
    }
  });

  // --- Local Storage Save ---
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to localStorage", err);
    }
  }, [cartItems]);

  // --- Core Logic (Updated with Stock Check) ---
  const addToCart = (product, quantityToAdd = 1) => {
    const qty = parseInt(quantityToAdd, 10);
    if (isNaN(qty) || qty < 1) return;

    // MongoDB তে ID হলো '_id'
    const productId = product._id; 

    // ১. প্রথমেই চেক: ইউজার যা চাচ্ছে তা স্টকে আছে কিনা?
    if (product.countInStock && qty > product.countInStock) {
      alert(`দুঃখিত! স্টকে পর্যাপ্ত পণ্য নেই। আছে মাত্র ${product.countInStock} টি।`);
      return;
    }

    setCartItems((prevItems) => {
      // কার্টে পণ্যটি আগে থেকেই আছে কিনা দেখা
      const existingItem = prevItems.find((item) => item._id === productId);

      if (existingItem) {
        const newTotalQty = existingItem.qty + qty;

        // ২. দ্বিতীয় চেক: কার্টের আগের সংখ্যা + নতুন সংখ্যা কি স্টকের চেয়ে বেশি হয়ে যাচ্ছে?
        if (product.countInStock && newTotalQty > product.countInStock) {
          alert(`দুঃখিত! আপনি ইতিমধ্যে ${existingItem.qty} টি কার্টে রেখেছেন। মোট স্টক ${product.countInStock} টি।`);
          return prevItems; // কিছুই পরিবর্তন না করে ফেরত পাঠানো
        }

        // আইটেম আপডেট করা (আমরা 'qty' ব্যবহার করছি, 'quantity' না)
        return prevItems.map((item) =>
          item._id === productId
            ? { ...item, qty: newTotalQty }
            : item
        );
      }

      // যদি নতুন পণ্য হয় (এখানেও 'qty' ব্যবহার করা হলো)
      return [...prevItems, { ...product, qty: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item._id !== productId)
    );
  };

  const clearCart = () => setCartItems([]);

  // --- Calculations ---
  // আইটেম সংখ্যা এবং মোট দাম হিসাব করা
  const itemCount = cartItems.reduce((total, item) => total + item.qty, 0);
  
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.qty, 
    0
  );

  const value = {
    cartItems,      // ✅ এখন নাম 'cartItems' (আগে 'items' ছিল, যা ভুল)
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