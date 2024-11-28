import React from 'react';
import styles from './SurveyFilters.module.css';

export const SurveyFilters = () => {
  return (
    <section className={styles.filterSection} role="search" aria-label="Survey filters">
      <div className={styles.filterButtons}>
        <button className={`${styles.filterButton} ${styles.primary}`} aria-expanded="false">
          <span>ALL YEAR</span>
          <img src="/icons/calendar.svg" alt="" className={styles.icon} aria-hidden="true" />
        </button>
        <button className={`${styles.filterButton} ${styles.secondary}`} aria-expanded="false">
          <span>ALL COLLEGES</span>
          <img src="/icons/school.svg" alt="" className={styles.icon} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.tabSection}>
        <div className={styles.tabs} role="tablist">
          <button 
            role="tab"
            aria-selected="true"
            className={`${styles.tab} ${styles.active}`}
            id="existing-tab"
            aria-controls="existing-panel"
          >
            EXISTING
          </button>
          <button 
            role="tab"
            aria-selected="false"
            className={styles.tab}
            id="pending-tab"
            aria-controls="pending-panel"
          >
            PENDING
          </button>
        </div>
        <button 
          className={styles.addButton}
          aria-label="Add new survey"
        >
          +
        </button>
      </div>
    </section>
  );
};