import React, { useState } from 'react';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted: ' + feedback);
    setFeedback('');
    // এখানে API কল করে সার্ভারে ডেটা পাঠাতে হবে
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <h4>Have Queries? Give Feedback:</h4>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Enter your feedback..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default FeedbackForm;
