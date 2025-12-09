import React, { useState } from 'react';

const ProductForm = ({ onSubmit }) => {
  // ফর্মের জন্য স্টেট (ব্যাকএন্ডের স্কিমা অনুযায়ী)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ডাটাগুলো একটি অবজেক্ট আকারে সাজানো হলো
    const productData = {
      name: name,
      price: parseFloat(price),
      category: category,
      image: image,
      stock: 1 // ডিফল্ট স্টক ১ দিলাম
    };

    // ManageProducts.jsx এর addProduct ফাংশনকে কল করা হলো
    onSubmit(productData);

    // ফর্ম রিসেট (খালি) করা হলো
    setName('');
    setPrice('');
    setCategory('');
    setImage('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3>Add New Product</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* 1. Name */}
        <input 
          type="text" 
          placeholder="Coin Name (e.g. Janapada)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />

        {/* 2. Category */}
        <input 
          type="text" 
          placeholder="Category (e.g. Ancient/British)" 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />

        {/* 3. Image URL */}
        <input 
          type="text" 
          placeholder="Image URL (Link)" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          style={{ padding: '8px' }}
        />

        {/* 4. Price */}
        <input 
          type="number" 
          placeholder="Price (Tk)" 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          required 
          style={{ padding: '8px' }} 
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', cursor: 'pointer' }}>
          Save Product
        </button>

      </div>
    </form>
  );
};

export default ProductForm;