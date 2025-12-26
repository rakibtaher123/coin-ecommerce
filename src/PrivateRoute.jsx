import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useContext(AuthContext); // Use basic isLoggedIn
    const location = useLocation();

    // Wait for loading to finish (if AuthContext handles loading)
    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    // Backup check: LocalStorage for instant feedback if Context is slow
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');


    if (!isLoggedIn && !token) {
        // Redirect to login, saving the current location
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default PrivateRoute;
