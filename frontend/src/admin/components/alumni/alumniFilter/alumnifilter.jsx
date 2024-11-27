import React from 'react';
import { Header } from './components/header/header';
import { AlumniFilters } from './alumnifilter/alumnifilter';
import { AlumniTable } from './alumnitable/alumnitable';
import { Footer } from './components/footer/footer';
import styles from './alumni/alumnidatabase.css';

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