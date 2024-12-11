import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Admin-SideBar.module.css'; // Updated CSS file

export function Sidebar() {
  return (
    <aside className={styles.sidebar} role="navigation">
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>TUPATS</h1>
      </div>
      <nav className={styles.navigation}>
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
      <button className={styles.userProfile} aria-label="User profile">
        GARCIA, J
      </button>
    </aside>
  );
}

export default Sidebar;
