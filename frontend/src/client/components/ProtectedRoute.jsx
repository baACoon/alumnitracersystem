import React from 'react';
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/Frontpage" replace />;
  }

  try {
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000; // seconds

    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return <Navigate to="/Frontpage" replace />;
    }
  } catch (error) {
    console.error('Invalid token format:', error);
    localStorage.removeItem('token');
    return <Navigate to="/Frontpage" replace />;
  }

  return children;
};

export default ProtectedRoute;
