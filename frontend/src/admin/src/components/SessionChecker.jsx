import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

function SessionChecker({ onAuthCheckComplete }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        onAuthCheckComplete();
        return navigate('/login');
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          toast.warning('Session expired. Please login again.');
          onAuthCheckComplete();
          return navigate('/login');
        }

        onAuthCheckComplete();
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token');
        onAuthCheckComplete();
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate, onAuthCheckComplete]);

  return null;
}

export default SessionChecker;