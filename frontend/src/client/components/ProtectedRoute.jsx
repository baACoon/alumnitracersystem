import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token); // true if token exists
  }, []);

  if (isAuth === null) {
    return null; // or show a loading spinner if you want
  }

  return isAuth ? children : <Navigate to="/Frontpage" replace />;
};

export default ProtectedRoute;
