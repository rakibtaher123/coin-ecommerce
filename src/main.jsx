import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartProvider'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* পুরো অ্যাপকে CartProvider দিয়ে মুড়া হলো */}
    <CartProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
