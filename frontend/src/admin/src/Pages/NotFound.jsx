import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';
import TUPATS from "../components/images/tupats.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFoundContainer}>
      <img src={TUPATS} alt="TUPATS Logo" style={{ marginBottom: '2rem', maxWidth: '200px' }} />
      <h1 className={styles.title}>
        The page you are trying to access is <br />Under Maintenance/Not Existing
      </h1>
      <p className={styles.subtitle}>
        Oops! The page you're looking for doesn't exist or is under maintenance
      </p>
      <button
        onClick={() => navigate('/login')}
        className={styles.button}
      >
        GO BACK
      </button>
    </div>
  );
};

export default NotFound;