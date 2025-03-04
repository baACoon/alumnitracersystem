import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Admin-SideBar.module.css";
import './sidebarmodal.css';

export function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("Admin"); // Default name

  useEffect(() => {
    // Fetch the username from localStorage
    const storedUser = localStorage.getItem("username"); 
    if (storedUser) {
      setUserName(storedUser); // ✅ Update the username dynamically
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
          DASHBOARD
        </NavLink>
        <NavLink to="/alumni-page" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          ALUMNI
        </NavLink>
        <NavLink to="/SurveyContent" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          SURVEYS
        </NavLink>
        <NavLink to="/EventTabs" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          EVENTS
        </NavLink>
        <NavLink to="/Opportunities" className={({ isActive }) => isActive ? styles.mainTabActive : styles.mainTab}>
          OPPORTUNITIES
        </NavLink>
      </nav>

      {/* User Profile Dropdown */}
      <hr className="userDivider" />
      <div className="profileContainer">
        <button className="userProfile" onClick={() => setShowDropdown(!showDropdown)}>
          {userName}
        </button>

        {showDropdown && (
          <div className="dropdownMenu">
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>


        <div class="select">
          <div
            class="selected"
            data-default="All"
            data-one="logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              class="arrow"
            >
              <path
                d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
              ></path>
            </svg>
          </div>
          <div class="options">
            <div title="all">
              <input id="all" name="option" type="radio" checked="" />
              <label class="option" for="all" data-txt="All"></label>
              <button className="logoutButton" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>

    </aside>
  );
}

export default Sidebar;
