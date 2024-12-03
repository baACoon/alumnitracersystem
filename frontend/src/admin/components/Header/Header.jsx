import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.headerBox} role="banner">
      <div className={styles.headerContent}>
        <h1 className={styles.logo}>TUPATS</h1>
        <nav className={styles.navigation} role="navigation">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            DASHBOARD
          </NavLink>
          <NavLink
            to="/AlumniPage"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            ALUMNI
          </NavLink>
          <NavLink
            to="/SurveyContent"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            SURVEYS
          </NavLink>
          <NavLink
            to="/EventTabs"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            EVENTS
          </NavLink>
          <NavLink
            to="/opportunities"
            className={({ isActive }) =>
              isActive ? styles.navLinkActive : styles.navLink
            }
          >
            OPPORTUNITIES
          </NavLink>
        </nav>
      </div>
      <button className={styles.userProfile} aria-label="User profile">
        GARCIA, J
      </button>
    </header>
  );
}

export default Header;
