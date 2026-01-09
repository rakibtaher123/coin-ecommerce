import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // API থেকে ডেটা আনার ফাংশন
    const fetchProducts = async () => {
      try {
        // ১. আপনার লোকাল সার্ভারের সঠিক URL দেওয়া হলো
        const response = await fetch('https://gangaridai-auction.onrender.com/products'); 
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setProducts(data);
        
      } catch (error) {
        console.error("Error fetching products:", error);
        
        // ২. ব্যাকএন্ডের স্কিমার সাথে মিল রেখে ডামি ডেটা (যাতে এরর খেলেও সাইট চলে)
        setProducts([
          { _id: '1', name: 'Janapada Coin (Demo)', price: 500, image: '' },
          { _id: '2', name: 'British India Coin (Demo)', price: 1200, image: '' },
        ]);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Welcome to Coin Collector</h1>
      
      {/* ফ্লেক্স ডিজাইন: যাতে কার্ডগুলো পাশাপাশি সুন্দরভাবে বসে */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {products.map(product => (
          // ৩. MongoDB তে unique id হলো _id
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
