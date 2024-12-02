import React, { useState } from 'react';
import './frontpage.css'; 
import Modal from '../Modal/modal';
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'


function FrontPage() {
    const [showModal, setShowModal] = useState(null); // To track which modal to show

    const openModal = (modalType) => {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      setShowModal(modalType); // Set the modal type (login or register)
    };
  
    const closeModal = () => {
      document.body.style.overflow = 'auto'; // Restore background scrolling
      setShowModal(null); // Close the modal
    };

  return (
    <div className="frontpg-container">
      <div className="logo">
        <img src={Tuplogo} alt="TUP logo" className="logo-1" />
        <img src={Alumnilogo} alt="Alumni logo" className="logo-2" />
      </div>

      <div className="system-title">
        <h3 className='system-title-1'>TUPATS</h3>
        <h4 className='system-title-2'>The Technological University of the Philippines Alumni Tracer System</h4>
      </div>

      <div className="btn">
        <button className="login-btn" onClick={() => openModal('login')}>
          LOGIN
        </button>
        <button className="register-btn" onClick={() => openModal('register')}>
          REGISTER
        </button>
      </div>

      {/* Modal Component */}
      {showModal && <Modal modalType={showModal} closeModal={closeModal} />}
    </div>
  );
}

export default FrontPage;
