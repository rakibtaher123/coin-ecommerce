import React from 'react';
import { useNavigate } from 'react-router-dom'; // রাউটার হুক ইম্পোর্ট
import './EshopPage.css'; 

const EshopPage = () => {
  const navigate = useNavigate(); // নেভিগেশন হুক

  // ডাটাবেসের (data.js) কী (key) এর সাথে মিল রেখে ফোল্ডার নাম
  const categories = [
    { name: "Janapada Series", folder: "janapada_series" },
    { name: "Ancient Bengal", folder: "ancient_bengal" },
    { name: "Medieval Bengal", folder: "medieval_bengal" },
    { name: "Sultanate Period", folder: "sultanate_period" },
    { name: "Mughal Empire", folder: "mughal_empire" },
    { name: "East India Company", folder: "east_india_company" },
    { name: "British Indian Coins", folder: "british_indian_coins" },
    { name: "British Indian Notes", folder: "british_indian_notes" },
    { name: "Pakistani Coins", folder: "pakistani_coins" },
    { name: "Pakistani Notes", folder: "pakistani_notes" },
    { name: "Bangladeshi Republic Coins", folder: "bd_republic_coins" },
    { name: "Bangladeshi Republic Notes", folder: "bd_republic_notes" }
  ];

  // ক্লিক করলে এই ফাংশনটি ক্যাটাগরি পেজে নিয়ে যাবে
  const handleCategoryClick = (folderName) => {
    console.log("Navigating to:", folderName); // কনসোলে চেক করার জন্য
    navigate(`/category/${folderName}`);
  };

  return (
    <div className="eshop-container">
      <h1 className="page-title">E-SHOP: Historical Categories</h1>

      <div className="category-card">
        <h2 className="card-subtitle">Choose a Historical Era</h2>
        
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="category-item" 
              // এই লাইনটি গুরুত্বপূর্ণ: ক্লিক ইভেন্ট যোগ করা হলো
              onClick={() => handleCategoryClick(cat.folder)}
              style={{ cursor: 'pointer' }} // মাউস নিলে হাত চিহ্ন আসবে
            >
              <span>{cat.name}</span>
              <span className="arrow-icon">&gt;</span>
            </div>
          ))}
        </div>

        <button className="view-all-btn" onClick={() => navigate('/category/all')}>
          VIEW ALL COINS &gt;
        </button>
      </div>
    </div>
  );
};

export default EshopPage;