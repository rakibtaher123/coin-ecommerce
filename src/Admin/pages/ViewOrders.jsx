import React, { useState, useEffect } from 'react';

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState({});
  const [loading, setLoading] = useState(true);   // লোডিং স্টেট
  const [error, setError] = useState(null);       // এরর স্টেট

  // 📦 অর্ডার লোড করা (API থেকে)
  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/orders');
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🚚 স্ট্যাটাস আপডেট করা
  const updateStatus = async (id, newStatus) => {
    let courierName = "";

    if (newStatus === 'Shipped') {
      courierName = selectedCourier[id];
      if (!courierName) {
        console.log("⚠️ Please select a Courier Service first! (Redx/Pathao/etc)");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, courier: courierName }),
      });

      if (response.ok) {
        console.log(`✅ Order marked as ${newStatus}`);
        loadOrders();
      } else {
        console.log("❌ Failed to update order status");
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 🗑️ অর্ডার ডিলিট
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`http://localhost:5000/orders/${id}`, { method: 'DELETE' });
      if (response.ok) {
        console.log("🗑 Order Deleted!");
        loadOrders();
      } else {
        console.log("❌ Failed to delete order");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  // কুরিয়ার সিলেক্ট করলে স্টেট আপডেট
  const handleCourierChange = (orderId, value) => {
    setSelectedCourier({ ...selectedCourier, [orderId]: value });
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* হেডার */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '3px solid #166534', paddingBottom: '10px' }}>
        <h2 style={{ color: '#166534', margin: 0 }}>📦 Manage Customer Orders</h2>
        <span style={{ backgroundColor: '#166534', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '14px' }}>
          Total Orders: {orders.length}
        </span>
      </div>

      {/* লোডিং / এরর */}
      {loading && <p style={{ textAlign: 'center' }}>⏳ Loading orders...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>❌ {error}</p>}

      {/* অর্ডার লিস্ট */}
      {!loading && orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
          <h3>No orders found yet.</h3>
          <p>Wait for customers to place orders.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order._id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', borderLeft: `5px solid ${order.status === 'Pending' ? 'orange' : order.status === 'Shipped' ? 'blue' : 'green'}` }}>
              
              {/* কাস্টমার ও পেমেন্ট ইনফো */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>Order ID: {order._id}</span>
                  <h3 style={{ margin: '5px 0', color: '#111827' }}>👤 {order.customerName}</h3>
                  <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>📞 {order.mobile}</p>
                  <p style={{ margin: '2px 0', color: '#4b5563', fontSize: '14px' }}>📍 {order.address}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                   <div style={{ marginBottom: '5px' }}>
                      <span style={{ fontSize: '14px', color: '#555' }}>Payment: </span> 
                      <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}>
                        {order.paymentMethod}
                      </span>
                   </div>
                   
                   {order.transactionId && (
                     <div style={{ fontSize: '13px', color: '#059669', fontWeight: 'bold', marginBottom: '5px', backgroundColor: '#ecfdf5', padding: '2px 5px', display: 'inline-block' }}>
                       TrxID: {order.transactionId}
                     </div>
                   )}

                   <h2 style={{ color: '#d97706', margin: '5px 0' }}>৳ {order.totalPrice}</h2>
                </div>
              </div>

              {/* অ্যাকশন ও কুরিয়ার */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                
                {/* বর্তমান স্ট্যাটাস */}
                <div>
                   <span style={{ fontWeight: 'bold', color: '#555' }}>Current Status: </span> 
                   <span style={{ 
                     backgroundColor: order.status === 'Pending' ? '#fff7ed' : (order.status === 'Shipped' ? '#eff6ff' : '#f0fdf4'), 
                     color: order.status === 'Pending' ? '#c2410c' : (order.status === 'Shipped' ? '#1d4ed8' : '#15803d'), 
                     padding: '6px 15px', borderRadius: '20px', fontWeight: 'bold', border: '1px solid #ddd'
                   }}>
                     {order.status}
                   </span>
                   
                   {order.courier && (
                     <span style={{ marginLeft: '10px', fontSize: '14px', color: '#4b5563', backgroundColor: '#f3f4f6', padding: '5px 10px', borderRadius: '5px' }}>
                       via 🚚 <strong>{order.courier}</strong>
                     </span>
                   )}
                </div>

                {/* অ্যাকশন বাটনস */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  
                  {order.status === 'Pending' && (
                    <>
                      <select 
                        onChange={(e) => handleCourierChange(order._id, e.target.value)}
                        style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="">Select Courier...</option>
                        <option value="Redx">Redx</option>
                        <option value="Pathao">Pathao</option>
                        <option value="Sundarban">Sundarban</option>
                        <option value="SA Paribahan">SA Paribahan</option>
                      </select>

                      <button 
                        onClick={() => updateStatus(order._id, 'Shipped')} 
                        style={{ backgroundColor: '#2563eb', color: