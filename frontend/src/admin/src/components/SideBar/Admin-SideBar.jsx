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
            to="/AlumniPage"
            className={({ isActive }) =>
              isActive ? styles.mainTabActive : styles.mainTabButton
            }
          >
            ALUMNI
          </NavLink>
        </div>
{/* Tabs with Sub-Tabs */}
<div>
          <button
            className={styles.mainTabButton}
            onClick={() => toggleTab("surveys")}
          >
            SURVEYS
          </button>
          {activeTab === "surveys" && (
            <div className={styles.subTabs}>
              <NavLink
                to="/SurveyContent"
                className={({ isActive }) =>
                  isActive ? styles.subTabActive : styles.subTab
                }
              >
                Published
              </NavLink>
              <NavLink
                to="/SurveyContent/Pending"
                className={({ isActive }) =>
                  isActive ? styles.subTabActive : styles.subTab
                }
              >
                Pending
              </NavLink>
            </div>
          )}
        </div>
        
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