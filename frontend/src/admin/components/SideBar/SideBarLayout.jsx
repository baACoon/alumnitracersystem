import React, { useState, useEffect } from "react";
import Sidebar from "./Admin-SideBar";
import styles from "./SideBarLayout.module.css";

export function SidebarLayout({ children }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768); // Sidebar visible for larger screens by default

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
      {/* Hamburger button only visible on smaller screens */}
      <button
        className={styles.hamburgerButton}
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}

export default SidebarLayout;
