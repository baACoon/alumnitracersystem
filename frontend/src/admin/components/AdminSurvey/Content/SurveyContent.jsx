import React from 'react';
import { Footer } from '../../Footer/Footer';
import { Header } from '../../Header/Header';
import { SurveyFilters } from '../Filters/SurveyFilters';
import { SurveyTable } from '../Table/SurveyTable';
import styles from './SurveyContent.module.css';

export const SurveyContent = () => {
  console.log('SurveyContent is rendering');
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent} role="main">
      <h1 className={styles.pageTitle}>SURVEY MANAGEMENT</h1>
      <SurveyFilters />
    </main>
    </div>
    
  );
};


export default SurveyContent;