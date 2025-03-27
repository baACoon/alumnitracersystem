import React from 'react';
import styles from './SuccessModal.module.css'; 

const SuccessModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null; 

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.checkmark}>✔️</div>
        </div>
        <div className={styles.modalBody}>
          <h2>Thank You!</h2>
          <p>{message}</p>
          <button className={styles.okButton} onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
