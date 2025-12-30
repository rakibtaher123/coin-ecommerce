import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const OrderStatusPage = () => {
  const status = "Processing"; // এই স্ট্যাটাস API থেকে আসবে

  return (
    <div>
      <h1>Order Status</h1>
      <p>Order Status: <strong>{status}</strong></p>
      <p>Courier Service: Coming Soon (API integration needed)</p>
      <FeedbackForm />
    </div>
  );
};

export default OrderStatusPage;
