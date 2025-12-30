import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ চূড়ান্ত ফিক্স: সার্ভারের সাথে মিলিয়ে 'localhost' ব্যবহার করা হলো
  const API_BASE_URL = "http://localhost:5000";

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status} (${response.statusText || 'Error'})`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        console.log(`✅ Products Loaded: ${data.length} items.`);
        setProducts(data);
        setError(null);
      } else {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from server.");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("Failed to load products. Please ensure the Backend Server is running on port 5000.");
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{ products, loading, error, refreshProducts: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;