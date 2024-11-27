import React from 'react';
import { Header } from './components/Header';
import { AlumniFilters } from './components/AlumniFilters';
import { AlumniTable } from './components/AlumniTable';
import { Footer } from './components/Footer';
import styles from './AlumniPage.module.css';

export function AlumniPage() {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>
        <AlumniFilters />
        <AlumniTable />
      </main>
      <Footer />
    </div>
  );
}