import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Admin-SideBar.module.css";
import './sidebarmodal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faUsers,
  faListCheck,
  faCalendarDays,
  faBriefcase
} from '@fortawesome/free-solid-svg-icons';

export function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState("Admin"); // Default name

  useEffect(() => {
    // Fetch the username from localStorage
    const storedUser = localStorage.getItem("username"); 
    if (storedUser) {
      setUserName(storedUser); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token
    localStorage.removeItem("username"); // Remove username
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
      role="navigation"
    >
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>TUPATS</h1>
      </div>
      <nav className={styles.navigation}>
        <NavLink to="/Dashboard" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          <span className={styles.navWithIcon}>
            <FontAwesomeIcon icon={faGauge} className={styles.icon} />
            DASHBOARD
          </span>
        </NavLink>

        <NavLink to="/alumni-page" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          <span className={styles.navWithIcon}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            ALUMNI
          </span>
        </NavLink>

        <NavLink to="/SurveyContent" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          <span className={styles.navWithIcon}>
            <FontAwesomeIcon icon={faListCheck} className={styles.icon} />
            SURVEYS
          </span>
        </NavLink>

        <NavLink to="/EventTabs" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          <span className={styles.navWithIcon}>
            <FontAwesomeIcon icon={faCalendarDays} className={styles.icon} />
            EVENTS
          </span>
        </NavLink>

        <NavLink to="/Opportunities" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          <span className={styles.navWithIcon}>
            <FontAwesomeIcon icon={faBriefcase} className={styles.icon} />
            OPPORTUNITIES
          </span>
        </NavLink>
      </nav>
        <div className="select">
          <div
            class="selected"
            data-one="logout"
          > {userName}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              className="arrow"
            > 
              <path
                d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
              ></path>
            </svg>
          </div>
          <div className="options">
            <div title="">
              <input id="all" name="option" type="radio" checked="" />
              <label className="option"></label>
              <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

    </aside>
  );
}

export default Sidebar;
