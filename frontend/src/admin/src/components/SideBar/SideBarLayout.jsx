import React, { useState, useEffect } from "react";
import Sidebar from "./Admin-SideBar";
import styles from "./SideBarLayout.module.css";
import RegisterModal from "./RegisterModal"; // Import the modal

export function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [showRegisterModal, setShowRegisterModal] = useState(false); // Add modal state
  const toggleSidebar = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Automatically show sidebar on larger screens
      } else {
        setIsOpen(false); // Automatically hide sidebar on smaller screens
      }
    };

    // Attach event listener for screen resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      {/* Hamburger button */}
      <button
        className={styles.hamburgerButton}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar - pass down the modal handler */}
      <Sidebar 
        isOpen={isOpen} 
        toggleSidebar={toggleSidebar}
        onShowRegisterModal={() => setShowRegisterModal(true)} 
      />

      {/* Main content */}
      <main className={styles.mainContent}>{children}</main>

      {/* Register Modal - now rendered at layout level */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}

export default SidebarLayout;
