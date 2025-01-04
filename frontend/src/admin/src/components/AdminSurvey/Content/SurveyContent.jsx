import React from 'react';
import { Footer } from '../../Footer/Footer';
import { Sidebar } from '../../SideBar/Admin-SideBar';
import { SurveyFilters } from '../Filters/SurveyFilters';
import { SurveyTable } from '../Table/SurveyTable';
import styles from './SurveyContent.module.css';

export const SurveyContent = () => {
  console.log('SurveyContent is rendering');
  return (
    <div className={styles.pageContainer}>
      <Sidebar />
      <main className={styles.mainContent} role="main">
      <SurveyFilters />
    </main>
    </div>
    
  );
};


export default SurveyContent;