import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

function SessionChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      const loginPage = '/login';
      
      if (!token) {
        handleSessionEnd();
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          handleSessionEnd(true);
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
        handleSessionEnd();
      }
    };

    const handleSessionEnd = (expired = false) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      if (expired) {
        toast.warning('Your session has expired. Please log in again.', {
          toastId: 'session-expired' // Prevent duplicates
        });
      }
      navigate('/login');
    };

    // Initial check
    checkSession();

    // Set up periodic checking (every 5 minutes)
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}

export default SessionChecker;