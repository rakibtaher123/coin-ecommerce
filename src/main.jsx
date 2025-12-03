import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
// কার্ট কনটেক্সট ইম্পোর্ট করা হচ্ছে
import { CartProvider } from './context/CartProvider'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CartProvider দিয়ে পুরো অ্যাপকে মুড়িয়ে দেওয়া হলো */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>,
)