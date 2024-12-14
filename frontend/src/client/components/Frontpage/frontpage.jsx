import React, { useState } from 'react';
import './frontpage.css'
import { useNavigate } from 'react-router-dom';  // Importing useNavigate for redirection
import TestLoginForm from '../test_login/testLoginForm';  // Login Form Modal
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'


const TestFrontPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate function

  const handleLoginClick = () => setShowLoginModal(true);
  const handleRegisterClick = () => navigate('../registerselection');  // Redirect to RegisterSelection page

  const closeLoginModal = () => setShowLoginModal(false);

  return (
    <div className="frontpg-container">
        <div className="logo">
            <img src={Tuplogo} alt="TUP logo" className="logo-1" />
            <img src={Alumnilogo} alt="Alumni logo" className="logo-2" />
        </div>
        <div className="system-title">
            <h3 className='system-title-1'>GALLO</h3>
            <h4 className='system-title-2'>The Technological University of the Philippines Alumni Tracer System</h4>
        </div>
        <div className="btn">
            <button onClick={handleLoginClick}>LOGIN</button>
            <button onClick={handleRegisterClick}>REGISTER</button>
        </div>
      

      {/* Login Modal */}
        {showLoginModal && (
            <div className="modal">
                {showLoginModal && <TestLoginForm modalType={showLoginModal} closeModal={closeLoginModal} />}
            </div>
        )}
        </div>
  );
};

export default TestFrontPage;
