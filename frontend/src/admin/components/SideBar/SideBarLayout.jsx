import React from 'react';
import Sidebar from './Admin-SideBar'; // Import your Sidebar component
import styles from './SideBarLayout.module.css';

export function SidebarLayout({ children }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.mainContent}>
        {children} {/* This renders the page content dynamically */}
      </main>
    </div>
  );
}

export default SidebarLayout;
