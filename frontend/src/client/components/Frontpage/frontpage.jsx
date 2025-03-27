import React, { useEffect, useState } from 'react';
import styles from './frontpage.module.css';// Import module-based styles
import LoginForm from '../Login_Alumni/LoginForm';  // Login Form Modal
import Register_NewAlumni from '../Register_NewAlumni/register_newalumni';  // Form for users without Alumni ID
import Tuplogo from '../../components/image/Tuplogo.png';
import Alumnilogo from '../../components/image/alumniassoc_logo.png';
import gsap from "gsap";

const TestFrontPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister_NewAlumniModal, setShowRegister_NewAlumniModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Ensure animations apply after component is mounted
    setTimeout(() => {
      // Animation to fade out the loading screen
      gsap.to(".loadingPage", {
        opacity: 0,
        duration: 1.5,
        delay: 3.5, // Loading screen lasts for 3.5 seconds
        onComplete: () => {
          setLoading(false);
          document.querySelector(".loadingPage").style.display = "none"; // Hide it after animation completes
        },
      });
  
      // Animation for "TUPATS" letters (Angry Bounce Effect)
      gsap.to(".letter", {
        opacity: 1,
        y: -10, // Angry bounce UP
        duration: 0.5,
        stagger: 0.2, // One-by-one delay
        ease: "power4.out",
      });
  
      gsap.to(".letter", {
        y: 0, // Settle in final position
        repeat: 1,
        yoyo: true,
        delay: 0.5,
        stagger: 0.2,
        ease: "bounce.out",
      });
  
      // Animation for logo name
      gsap.fromTo(
        ".logo-name",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, delay: 0.5 }
      );
  
      // Add class to ensure visibility
      document.querySelectorAll(".letter").forEach((letter) => {
        letter.classList.add("animated");
      });
    }, 500); // Small delay ensures DOM is ready
  }, []);
  
  const handleLoginClick = () => setShowLoginModal(true);
  const openRegister_NewAlumniModal = () => setShowRegister_NewAlumniModal(true);

  const closeModal = () => {
    setShowLoginModal(false);
    setShowRegister_NewAlumniModal(false);
  };

    // Show loading animation first
    if (loading) {
      return (
        <div className={styles.loadingPage}>
          <div className={styles.loadingContainer}>
          <div className='tupname-container'>
             <h1 className='tupname'>TECHNOLOGICAL UNIVERSITY OF THE PHILIPPINES-MANILA</h1>
          </div>
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
  
            {/* Make sure the {styles.letter}s are visible */}
            <div className={styles.tupatsContainer}>
              <span className="letter">T</span>
              <span className="letter">U</span>
              <span className="letter">P</span>
              <span className="letter">A</span>
              <span className="letter">T</span>
              <span className="letter">S</span>
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
