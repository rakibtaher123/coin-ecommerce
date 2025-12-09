// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// ১. Auth Context তৈরি করা
// এটি অন্যান্য কম্পোনেন্টকে লগইন স্টেট অ্যাক্সেস করতে দেবে
export const AuthContext = createContext();

// ২. Auth Provider তৈরি করা
// এটি পুরো অ্যাপ্লিকেশনকে লগইন স্টেট সরবরাহ করবে এবং পরিবর্তনগুলো ম্যানেজ করবে
export const AuthProvider = ({ children }) => {
  // লগইন স্ট্যাটাস ট্র্যাক করার জন্য স্টেট। শুরুতে false থাকবে।
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // লগইন করা ব্যবহারকারীর ডেটা সংরক্ষণের স্টেট। শুরুতে null থাকবে।
  const [user, setUser] = useState(null);

  // ৩. অ্যাপ লোড হওয়ার সময় localStorage চেক করা
  // যাতে পেজ রিফ্রেশ করলেও লগইন স্ট্যাটাস বজায় থাকে
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
      // যদি টোকেন পাওয়া যায়, তাহলে ধরে নেওয়া হয় ইউজার লগড-ইন
      setIsLoggedIn(true);
      
      // এখানে আপনি টোকেন থেকে ইউজার ডেটা ডিকোড করে বা API কল করে নিতে পারেন।
      // আপাতত একটি ডামি অ্যাডমিন ডেটা সেট করা হলো:
      setUser({ id: 'admin123', role: 'Admin' }); 
    }
  }, []); // খালি অ্যারে মানে এই useEffect শুধু একবার অ্যাপ লোডের সময় চলবে

  // ৪. লগইন ফাংশন
  const login = (token, userData) => {
    // সফল লগইনের পর টোকেনটি ব্রাউজারের localStorage-এ সেভ করা
    localStorage.setItem('authToken', token);
    // স্টেট আপডেট করা
    setIsLoggedIn(true);
    setUser(userData);
  };

  // ৫. লগআউট ফাংশন
  const logout = () => {
    // localStorage থেকে টোকেন মুছে ফেলা
    localStorage.removeItem('authToken');
    // স্টেট রিসেট করা
    setIsLoggedIn(false);
    setUser(null);
    // লগআউটের পর ইউজারকে লগইন পেজে রিডাইরেক্ট করার কোড এখানে যুক্ত করা যেতে পারে।
  };

  // ৬. Context এর মাধ্যমে যে ডেটাগুলো সরবরাহ করা হবে
  const contextValue = {
    isLoggedIn, // হেডার দেখাবে কিনা, তা বোঝার জন্য
    user,       // ইউজারের তথ্য অ্যাক্সেস করার জন্য
    login,      // লগইন প্রক্রিয়া চালানোর জন্য
    logout,     // লগআউট প্রক্রিয়া চালানোর জন্য
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};