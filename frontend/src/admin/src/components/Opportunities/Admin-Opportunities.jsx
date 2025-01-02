import React from 'react';
import { Sidebar } from '../SideBar/Admin-SideBar';
import { OpportunityFilters } from './Opp-Filter';
import { Footer } from '../Footer/Footer';
import styles from './Admin-Opportunities.module.css';

export function Opportunities() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <OpportunityFilters />
      </main>
      <Footer />
    </div>
  );
}
export default Opportunities