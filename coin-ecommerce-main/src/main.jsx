// src/main.jsx (সম্পূর্ণ সংশোধিত কোড)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// আপনার বিদ্যমান Provider গুলো
import { CartProvider } from './context/CartProvider';
import { ProductProvider } from './context/ProductContext'; 

// ✅ নতুন যোগ করা লাইন: AuthProvider ইম্পোর্ট করুন
import { AuthProvider } from './context/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider>
      
      {/* ✅ এইখানে AuthProvider যোগ করুন যাতে এটি CartProvider, BrowserRouter এবং App-কে ঘিরে রাখে। */}
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
      
    </ProductProvider>
  </React.StrictMode>
);