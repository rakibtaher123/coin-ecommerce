import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // 🔐 যদি token না থাকে বা role মেলে না → login এ redirect করবে
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />; // client কে home এ পাঠাবে
  }

  return children;
};

export default ProtectedRoute;
