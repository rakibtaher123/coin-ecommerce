import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);   // লোডিং স্টেট
  const [error, setError] = useState(null);       // এরর স্টেট
  const navigate = useNavigate();

  // 🔐 সিকিউরিটি গার্ড (লগইন চেক)
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdminLoggedIn");
    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  // 📦 প্রোডাক্ট লোড করার ফাংশন
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/products');
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // পেজ লোড হওয়ার সাথে সাথে প্রোডাক্ট আনবে
  useEffect(() => {
    loadProducts();
  }, []);

  // ➕ প্রোডাক্ট যোগ করার ফাংশন
  const addProduct = async (productData) => {
    try {
      const response = await fetch('http://localhost:5000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        console.log('✅ Product Added Successfully!');
        loadProducts();
      } else {
        console.log('❌ Failed to add product');
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // 🗑️ প্রোডাক্ট ডিলিট করার ফাংশন
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('🗑️ Product Deleted!');
        setProducts(products.filter((p) => p._id !== id));
      } else {
        console.log('❌ Failed to delete product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // 🚪 লগআউট বাটন
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    console.log("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🛒 Manage Products</h2>
        <button 
          onClick={handleLogout} 
          style={{ backgroundColor: '#333', color: 'white', padding: '8px 15px', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      {/* ফর্ম */}
      <div style={{ marginBottom: '30px', marginTop: '20px' }}>
        <ProductForm onSubmit={addProduct} />
      </div>

      {/* লোডিং / এরর হ্যান্ডলিং */}
      {loading && <p>⏳ Loading products...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {/* প্রোডাক্ট টেবিল */}
      {!loading && products.length > 0 ? (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price} Tk</td>
                <td>{product.stock}</td>
                <td>
                  <button 
                    onClick={() => deleteProduct(product._id)} 
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No products found.</p>
      )}
    </div>
  );
};

export default ManageProducts;
