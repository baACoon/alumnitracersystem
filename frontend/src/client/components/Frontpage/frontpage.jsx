import React, { useState } from 'react';
import styles from './frontpage.module.css';// Import module-based styles
import LoginForm from '../Login_Alumni/LoginForm';  // Login Form Modal
import Register_NewAlumni from '../Register_NewAlumni/register_newalumni';  // Form for users without Alumni ID
import Tuplogo from '../../components/image/Tuplogo.png';
import Alumnilogo from '../../components/image/alumniassoc_logo.png';

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
    <div className={styles.frontpgContainer}>
      <div className={styles.logo}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
      </div>
      <div className={styles.systemTitle}>
        <h3 className={styles.systemTitle1}>TUPATS</h3>
        <h4 className={styles.systemTitle2}>
          The Technological University of the Philippines Alumni Tracer System
        </h4>
      </div>
      <div className={styles.btnFrontPage}>
        <button onClick={handleLoginClick}>LOGIN</button>
        <button onClick={openRegister_NewAlumniModal}>REGISTER</button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className={styles.modal}>
          <LoginForm closeModal={closeModal} />
        </div>
      )}

      {/* Register Modal */}
      {showRegister_NewAlumniModal && (
        <div className={styles.modal}>
          <Register_NewAlumni closeModal={closeModal} />
        </div>
      )}
    </div>
  );
};

export default TestFrontPage;
