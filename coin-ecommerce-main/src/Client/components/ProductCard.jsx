import React from 'react';

const ProductCard = ({ product }) => {
  // ডাটাবেস থেকে আসা নামগুলো এখানে আলাদা করছি (Destructuring)
  // লক্ষ্য করুন: আমরা 'title' এর বদলে 'name' ব্যবহার করছি, কারণ ব্যাকএন্ডে 'name' দিয়েছি
  const { name, price, category, image, _id } = product;

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      width: '250px', // কার্ডের প্রস্থ
      padding: '15px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // একটু ছায়া দিলাম যাতে সুন্দর লাগে
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      
      {/* ১. ছবির অংশ */}
      <div style={{ height: '180px', overflow: 'hidden', borderRadius: '5px', marginBottom: '10px', backgroundColor: '#f0f0f0' }}>
        <img 
          // যদি ইমেজ না থাকে, তবে একটা ডিফল্ট ছবি দেখাবে
          src={image ? image : "https://via.placeholder.com/250x180?text=No+Image"} 
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* ২. তথ্যের অংশ */}
      <div>
        <span style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {category}
        </span>
        <h3 style={{ fontSize: '18px', margin: '5px 0', color: '#333' }}>
          {name}
        </h3>
        <h4 style={{ color: '#e67e22', marginTop: '10px', fontSize: '16px' }}>
          Price: {price} Tk
        </h4>
      </div>

      {/* ৩. বাটন অংশ */}
      <button 
        style={{
          marginTop: '15px',
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: '0.3s'
        }}
        onClick={() => console.log(`Added to cart: ${name}`)}
      >
        Add to Cart
      </button>

    </div>
  );
};

export default ProductCard;