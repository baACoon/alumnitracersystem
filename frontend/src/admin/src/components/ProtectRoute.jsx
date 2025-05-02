import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const token = localStorage.getItem('token');
  const navigateTarget = '/login'; // Centralized redirect target

  if (!token) {
    localStorage.removeItem('token'); // Clear any invalid token
    return <Navigate to={navigateTarget} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Token expiration check
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to={navigateTarget} replace />;
    }

    // Role-based access control
    if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

  } catch (error) {
    console.error('Token validation error:', error);
    localStorage.removeItem('token');
    return <Navigate to={navigateTarget} replace />;
  }

  return children;
};

export default ProtectedRoute;