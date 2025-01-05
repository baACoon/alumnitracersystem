import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Admin-SideBar.module.css";

export function Sidebar({ isOpen, toggleSidebar }) {
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (tab) => {
    setActiveTab((prevTab) => (prevTab === tab ? null : tab)); // Toggle between open/close
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
        {/* Dashboard Tab */}
        <NavLink
          to="/Dashboard"
          className={({ isActive }) =>
            isActive ? styles.mainTabActive : styles.mainTab
          }
        >
          DASHBOARD
        </NavLink>

        <div>
          <NavLink
            to="/alumni-page"
            className={({ isActive }) =>
              isActive ? styles.mainTabActive : styles.mainTab
            }
          >
            ALUMNI
          </NavLink>
        </div>

        <NavLink
          to="/SurveyContent"
          className={({ isActive }) =>
            isActive ? styles.mainTabActive : styles.mainTab
          }
        >
          SURVEYS
        </NavLink>
        
        {/* Events Tab */}
        <NavLink
          to="/EventTabs"
          className={({ isActive }) =>
            isActive ? styles.mainTabActive : styles.mainTab
          }
        >
          EVENTS
        </NavLink>

        <NavLink
          to="/Opportunities"
          className={({ isActive }) =>
            isActive ? styles.mainTabActive : styles.mainTab
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
