import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

export function Header() {
  const [showDropdown, setShowDropdown] = useState('')
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

            {/* User Profile Dropdown */}
            <div className={styles.profileContainer}>
            <button
              className={styles.userProfile}
              aria-label="User profile"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              TESTING
            </button>

            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
              </div>
            )}
        </div>
      </div>
    </header>
  );
}

export default Header;
