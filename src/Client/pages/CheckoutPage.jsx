import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// আপনার CartProvider থেকে useCart ইম্পোর্ট করুন
import { useCart } from '../context/CartProvider';

const CheckoutPage = () => {
  // আগের কোডে useCart() ব্যবহার করা ভালো, কারণ আপনি Context ওভাবেই বানিয়েছেন
  // items: কার্টের প্রোডাক্ট লিস্ট, totalPrice: মোট দাম (যা প্রোভাইডারে করা আছে)
  const { items, totalPrice, clearCart } = useCart(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [trxId, setTrxId] = useState('');

  // আপনার প্রোভাইডার যদি totalPrice না দেয়, তবে ব্যাকআপ হিসেবে এখানে হিসাব করা হলো
  const calculatedTotal = totalPrice || items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if ((paymentMethod === 'bkash' || paymentMethod === 'rocket') && !trxId) {
      alert("Please enter your Transaction ID!"); // console.log এর বদলে alert দেওয়া ভালো ইউজার দেখার জন্য
      return;
    }

    const orderData = {
      customerName: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      products: items, // 'cart' এর বদলে 'items'
      totalPrice: calculatedTotal,
      paymentMethod,
      transactionId: paymentMethod === 'cod' ? '' : trxId,
      status: 'Pending'
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 Order Placed Successfully!");
        if (clearCart) clearCart(); // কার্ট ক্লিয়ার করা
        navigate('/');
      } else {
        alert(data.error || "Failed to place order. Try again.");
      }
    } catch (error) {
      console.error("Order Error:", error);
      alert("Server Error! Make sure backend is running.");
    }
  };

  if (!items || items.length === 0) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Your cart is empty! 🛒</h2>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
      
      {/* Shipping Form */}
      <div style={{ flex: 1, backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
        <h2 style={{ color: '#166534', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>🚚 Shipping Information</h2>
        
        <form id="checkout-form" onSubmit={handlePlaceOrder}>
          <div style={{ marginBottom: '15px' }}>
            <label>Name</label>
            <input type="text" name="name" required onChange={handleChange} style={inputStyle} placeholder="Full Name" />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Mobile Number</label>
            <input type="text" name="mobile" required onChange={handleChange} style={inputStyle} placeholder="017xxxxxxxx" />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email (Optional)</label>
            <input type="email" name="email" onChange={handleChange} style={inputStyle} placeholder="example@gmail.com" />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Full Address</label>
            <textarea name="address" required onChange={handleChange} style={{ ...inputStyle, height: '80px' }} placeholder="House, Road, City..." />
          </div>
        </form>
      </div>

      {/* Order Summary + Payment */}
      <div style={{ width: '350px', height: 'fit-content' }}>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
          <h3>Order Summary</h3>
          {items.map((item, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0', fontSize: '14px' }}>
              <span>{item.name} x {item.quantity || 1}</span>
              <span>৳{item.price * (item.quantity || 1)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontWeight: 'bold', fontSize: '18px', color: '#d97706' }}>
            <span>Total:</span>
            <span>৳ {calculatedTotal}</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3>Payment Method</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ ...radioStyle, border: paymentMethod === 'cod' ? '2px solid green' : '1px solid #ccc' }}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
              <span> 🏠 Cash on Delivery</span>
            </label>

            <label style={{ ...radioStyle, border: paymentMethod === 'bkash' ? '2px solid #e2136e' : '1px solid #ccc' }}>
              <input type="radio" name="payment" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} />
              <span> 🚀 bKash Payment</span>
            </label>

            <label style={{ ...radioStyle, border: paymentMethod === 'rocket' ? '2px solid #8c3494' : '1px solid #ccc' }}>
              <input type="radio" name="payment" value="rocket" checked={paymentMethod === 'rocket'} onChange={() => setPaymentMethod('rocket')} />
              <span> 🟣 Rocket Payment</span>
            </label>
          </div>

          {(paymentMethod === 'bkash' || paymentMethod === 'rocket') && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff7ed', borderRadius: '5px', border: '1px solid orange' }}>
              <p style={{ fontSize: '12px', margin: '0 0 5px 0' }}>
                Please send <strong>৳{calculatedTotal}</strong> to <br/> 
                <strong>017XXXXXXXX (Personal)</strong> using "Send Money".
              </p>
              <input 
                type="text" 
                placeholder="Enter Transaction ID (TrxID)" 
                value={trxId}
                onChange={(e) => setTrxId(e.target.value)}
                style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px' }}
              />
            </div>
          )}

          <button 
            type="submit" 
            form="checkout-form"
            style={{ width: '100%', marginTop: '20px', padding: '12px', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            CONFIRM ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

// স্টাইলগুলো নিচে ডিফাইন করা হলো
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  borderRadius: '5px',
  border: '1px solid #ddd',
  outline: 'none'
};

// আপনার কোডে এই স্টাইলটি মিসিং ছিল
const radioStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'border 0.2s ease-in-out'
};

export default CheckoutPage;