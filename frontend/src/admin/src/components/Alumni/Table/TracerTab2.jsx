import React from 'react';
import Notification from './Notification'; // make sure path is correct
import styles from './TracerTabs.module.css';

const Tracer2Tab = ({ studentData }) => {
  const tracer2Survey = studentData?.surveys?.find(s => s.title?.toLowerCase().includes('tracer 2'));

  return (
    <div className={styles.tracerContainer}>
      {tracer2Survey ? (
        <div>
          <h3>Tracer 2 Survey Completed</h3>
          {/* you can now display details from tracer2Survey if needed */}
        </div>
      ) : (
        <Notification studentData={studentData} />
      )}
    </div>
  );
};

export { Tracer2Tab };
