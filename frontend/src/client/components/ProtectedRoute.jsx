import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // JWT token from login

  if (!token) {
    return <Navigate to="/Frontpage" replace />; // Redirect to Frontpage if not logged in
  }

  return children;
};

export default ProtectedRoute;
