import React, { useState } from 'react';
import './frontpage.css'
import TestLoginForm from '../test_login/testLoginForm';  // Login Form Modal
import Register_NewAlumni from '../Register_NewAlumni/register_newalumni';  // Form for users without Alumni ID
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'


const TestFrontPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister_NewAlumniModal, setShowRegister_NewAlumniModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const openRegister_NewAlumniModal = () => setShowRegister_NewAlumniModal(true);

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegister_NewAlumniModal(false);
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
            <button onClick={handleLoginClick}>LOGIN</button>
            <button onClick={openRegister_NewAlumniModal}>REGISTER</button>
          </div>
      
          {/* Login Modal */}
          {showLoginModal && (
            <div className="modal">
              <TestLoginForm closeModal={closeModal} />
            </div>
          )}
      
          {/* Register Modal */}
          {showRegister_NewAlumniModal && (
            <div className="modal">
              <Register_NewAlumni closeModal={closeModal} />
            </div>
          )}
        </div>
      );      
};

export default TestFrontPage;
