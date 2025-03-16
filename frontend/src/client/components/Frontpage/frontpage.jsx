import React, { useState, useEffect } from 'react';
import styles from './frontpage.module.css';// Import module-based styles
import LoginForm from '../Login_Alumni/LoginForm';  // Login Form Modal
import Register_NewAlumni from '../Register_NewAlumni/register_newalumni';  // Form for users without Alumni ID
import Tuplogo from '../../components/image/Tuplogo.png';
import Alumnilogo from '../../components/image/alumniassoc_logo.png';

const TestFrontPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister_NewAlumniModal, setShowRegister_NewAlumniModal] = useState(false);
  const [loading, setLoading ] = useState(true)


  const handleLoginClick = () => setShowLoginModal(true);
  const openRegister_NewAlumniModal = () => setShowRegister_NewAlumniModal(true);

  useEffect(() => {
    // Animation for "TUPATS" to drop one by one
    gsap.to(".letter", {
      opacity: 1,
      y: -10, // Bounce effect upwards
      duration: 0.5,
      stagger: 0.2, // One by one drop effect
      ease: "power4.out"
    });

    gsap.to(".letter", {
      y: 0, // Settle into position
      repeat: 1,
      yoyo: true,
      delay: 0.5,
      stagger: 0.2,
      ease: "bounce.out"
    });

    // Simulate loading time (e.g., 3 seconds)
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  
  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegister_NewAlumniModal(false);
  };

  // Show loading animation while waiting
  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.gearbox}>
            <div className={styles.overlay}></div>
            <div className={`${styles.gear} ${styles.one}`}>
              <div className={styles.gearInner}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
            <div className={`${styles.gear} ${styles.two}`}>
              <div className={styles.gearInner}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
            <div className={`${styles.gear} ${styles.three}`}>
              <div className={styles.gearInner}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
            <div className={`${styles.gear} ${styles.four} ${styles.large}`}>
              <div className={styles.gearInner}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
              </div>
            </div>
          </div>
        </div>

        {/* TUPATS text bouncing below the gears */}
        <div className={styles.tupatsContainer}>
          <span className={styles.letter}>T</span>
          <span className={styles.letter}>U</span>
          <span className={styles.letter}>P</span>
          <span className={styles.letter}>A</span>
          <span className={styles.letter}>T</span>
          <span className={styles.letter}>S</span>
        </div>
      </div>
    );
  }

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
