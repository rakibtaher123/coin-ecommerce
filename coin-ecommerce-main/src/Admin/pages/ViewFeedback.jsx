import React, { useState } from 'react';

const ViewFeedback = () => {
  // এই ডেটা API থেকে আসবে (GET /feedback)
  const [feedbacks] = useState([
    { id: 1, userEmail: 'a@example.com', message: 'Great service! Loved the app.' },
    { id: 2, userEmail: 'b@example.com', message: 'Payment gateway was slow.' },
  ]);

  return (
    <div>
      <h1>Received Feedback</h1>
      {feedbacks.map(f => (
        <div key={f.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '15px 0', background: '#fff' }}>
          <strong>From: {f.userEmail}</strong>
          <p>{f.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ViewFeedback;
