import React from 'react';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.headerBox} role="banner">
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>TUPATS</h1>
        <nav className={styles.navigation} role="navigation">
          <a href="#dashboard" className={styles.navLink}>DASHBOARD</a>
          <a href="#alumni" className={styles.navLinkActive} aria-current="page">ALUMNI</a>
          <a href="#surveys" className={styles.navLink}>SURVEYS</a>
          <a href="#events" className={styles.navLink}>EVENTS</a>
          <a href="#opportunities" className={styles.navLink}>OPPORTUNITIES</a>
        </nav>
      </div>
      <button className={styles.userProfile} aria-label="User profile">GARCIA, J</button>
    </header>
  );
}

export default Header;