
// Tracer2Tab.jsx
import React from 'react';
import styles from './TracerTabs.module.css';

const Tracer2Tab = ({ studentData }) => {
  return (
    <div className={styles.tracerContainer}>
      <div className={styles.tracerNotCompleted}>
        <div className={styles.clockIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3>Tracer 2 Not Completed</h3>
        <p>
          This alumni has not yet completed the Tracer 2 survey. The
          <br />second tracer survey is scheduled to be distributed soon.
        </p>
        <button className={styles.reminderButton}>Send Reminder</button>
      </div>
    </div>
  );
};

export { Tracer2Tab};