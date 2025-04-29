// src/client/components/SessionChecker.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // if not installed: npm install jwt-decode

function SessionChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // No token, session expired
        navigate('/frontpage');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // in seconds

        if (decoded.exp && decoded.exp < currentTime) {
          // Expired
          alert('Session expired. Please log in again.');
          localStorage.clear();
          navigate('/frontpage');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.clear();
        navigate('/frontpage');
      }
    };

    checkSession();

    // Optional: check every 5 minutes kung gusto mo (safety net)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval); // cleanup
  }, [navigate]);

  return null; // walang UI, background checker lang
}

export default SessionChecker;
