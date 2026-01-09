import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Updated to use Vite Proxy
  const API_BASE_URL = "https://gangaridai-auction.onrender.com"; // Updated to Render URL

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("Fetching products from:", `${API_BASE_URL}/api/products`);

      // Add timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/products`, {
        signal: controller.signal
      });

      clearTimeout(timeoutId);

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
      if (err.name === 'AbortError') {
        setError("Request timed out. Backend might be slow or unreachable.");
      } else {
        setError("Failed to load products. Please ensure the Backend Server is running on port 5000.");
      }
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