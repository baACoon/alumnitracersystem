import React, { useState } from 'react';
import Login_client from '../Login_client/Login_client'; // Path to Login Component

import './modal.css';

function Modal({ modalType, closeModal }) {

  // This will close the modal if you click on the overlay (background)
  const handleOverlayClick = () => {
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
        {/* Render Login or Register Form */}
        {modalType === 'login' ? <Login_client /> : <Register_client />}
      </div>
   
  );
  
}

export default Modal;