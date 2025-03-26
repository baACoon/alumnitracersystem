import React, { useState } from 'react';
import styles from './SurveyFilters.module.css';
import SidebarLayout from "../../SideBar/SideBarLayout";
import { SurveyTable } from '../Table/SurveyTable';
import { PendingSurvey } from '../Table/PendingSurvey';
import { CreateSurvey } from '../CreateSurvey/CreateSurvey';
import { ViewSurvey } from "../Table/ViewSurvey";

export const SurveyFilters = () => {
  const [activeTab, setActiveTab] = useState('existing');
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [viewSurveyId, setViewSurveyId] = useState(null);

  const handleAddSurvey = () => {
    setIsCreatingSurvey(true);
    setViewSurveyId(null);
  };

  const handleBackToSurveyFilters = () => {
    setIsCreatingSurvey(false);
    setViewSurveyId(null);
  };

  return (
    <SidebarLayout>
      {isCreatingSurvey ? (
        <CreateSurvey onBack={handleBackToSurveyFilters} />
      ) : viewSurveyId ? (
        <ViewSurvey surveyId={viewSurveyId} onBack={handleBackToSurveyFilters} />
      ) : (
        <section className={styles.filterSection} aria-label="Survey filters">
          <div className={styles.header}>
            <h2 className={styles.pageTitle}>SURVEY MANAGEMENT</h2>
            <button
              className={styles.createButton}
              aria-label="Add new survey"
              onClick={handleAddSurvey}
            >
              + Create New Survey
            </button>
          </div>

          {/* Tabs Section */}
          <div className={styles.tabSection} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'existing'}
              className={`${styles.tab} ${activeTab === 'existing' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('existing')}
            >
              EXISTING
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'pending'}
              className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              PENDING
            </button>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'existing' && <SurveyTable onView={setViewSurveyId} />}
            {activeTab === 'pending' && <PendingSurvey onView={setViewSurveyId} />}
          </div>
        </section>
      )}
    </SidebarLayout>
  );
};
