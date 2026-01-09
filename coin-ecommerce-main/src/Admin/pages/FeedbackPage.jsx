import React, { useState, useEffect } from 'react';

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback লোড করা
  const loadFeedbacks = async () => {
    try {
      const response = await fetch('https://gangaridai-auction.onrender.com/feedback');
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>💬 User Feedback</h2>

      {loading && <p>⏳ Loading feedback...</p>}

      {feedbacks.length === 0 ? (
        <p>No feedback found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {feedbacks.map((fb) => (
            <li key={fb._id} style={{ background: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <strong>{fb.userName}</strong> ({fb.email})  
              <p style={{ marginTop: '5px' }}>{fb.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackPage;

