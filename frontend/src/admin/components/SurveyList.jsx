import React from 'react';
import { SURVEY_STATUS } from '../AlumniTypes';
import styles from '../styles/SurveySection.module.css';

const SurveyList = ({ surveys, onExport }) => {
  return (
    <section className={styles.surveySection} aria-labelledby="survey-title">
      <h2 id="survey-title" className={styles.sectionTitle}>SUBMITTED SURVEYS</h2>
      
      <div className={styles.surveyContent} role="region" aria-label="Survey list">
        {surveys.length === 0 ? (
          <p className={styles.noSurveys}>No surveys submitted yet</p>
        ) : (
          <ul className={styles.surveyList}>
            {surveys.map(survey => (
              <li key={survey.id} className={styles.surveyItem}>
                <h3>{survey.title}</h3>
                <p>Submitted: {new Date(survey.submissionDate).toLocaleDateString()}</p>
                <span className={styles.status}>{survey.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <button 
        className={styles.exportButton}
        onClick={onExport}
        disabled={surveys.length === 0}
        aria-label="Export survey summary"
      >
        EXPORT SUMMARY
      </button>
    </section>
  );
};

export default SurveyList;