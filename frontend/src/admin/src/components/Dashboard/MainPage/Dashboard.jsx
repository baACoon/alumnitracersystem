import React from 'react';
import { Sidebar } from '../../SideBar/Admin-SideBar';
import { DashFilter } from '../../Dashboard/MainPage/Dash-Filter';
import { Footer } from '../../Footer/Footer';
import styles from './Dashboard.module.css';

export function Dashboard() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <DashFilter />
      </main>
      <Footer />
    </div>
  );
}
export default Dashboard