import React from 'react';
import { Sidebar } from '../../SideBar/Admin-SideBar';
import { AlumniFilters } from '../Filters/AlumniFilters';
import { AlumniTable } from '../Table/AlumniTable';
import { GraduatesList } from '../BatchList/GraduatesList'
import { Footer } from '../../Footer/Footer';
import styles from './AlumniPage.module.css';

export function AlumniPage() {
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <AlumniFilters />
      </main>
      <Footer />
    </div>
  );
}
export default AlumniPage