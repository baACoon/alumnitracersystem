import React from 'react';
import styles from './TracerTabs.module.css';
import EmploymentHistory from './EmploymentHistory';

const Tracer1Tab = ({ studentData }) => {
  // Extract employment data from studentData
  const employmentInfo = studentData?.employmentInfo || {};
  
  // Format completion date from survey data if available
  const completionDate = studentData?.surveys?.find(s => s.title.includes('Tracer 1'))?.createdAt;
  const formattedDate = completionDate ? new Date(completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Not available';

  return (
    <div className={styles.tracerContainer}>
      <div className={styles.tracerHeader}>
        <h3>Tracer 1 Results</h3>
        <p className={styles.completionDate}>
          Survey completed on {formattedDate}
        </p>
      </div>

      {/* Employment History Visualization */}
      <EmploymentHistory employmentInfo={employmentInfo} />

      {/* Dynamic Employment Info Grid */}
      <div className={styles.infoGrid}>
        <div className={styles.infoBox}>
          <h5>Monthly Salary Range</h5>
          <p className={styles.infoValue}>
            {employmentInfo.salary_range || 'Not specified'}
          </p>
        </div>
        <div className={styles.infoBox}>
          <h5>Job Position</h5>
          <p className={styles.infoValue}>
            {employmentInfo.position || 'Not specified'}
          </p>
        </div>
        <div className={styles.infoBox}>
          <h5>Years in Current Job</h5>
          <p className={styles.infoValue}>
            {employmentInfo.years_in_current_job || 'Not specified'}
          </p>
        </div>
        <div className={styles.infoBox}>
          <h5>Job Satisfaction</h5>
          <p className={styles.infoValue}>
            {employmentInfo.job_satisfaction || 'Not specified'}
          </p>
        </div>
      </div>

      {/* Dynamic Survey Responses */}
      <div className={styles.tracerQuestionnaire}>
        <h4>Tracer 1 Survey Responses</h4>
        
        <table className={styles.questionnaireTable}>
          <tbody>
            <tr>
              <td className={styles.questionCol}>Your Name:</td>
              <td className={styles.answerCol}>
                {`${studentData?.personalInfo?.first_name || ''} ${studentData?.personalInfo?.last_name || ''}`.trim() || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Birth Date:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.birthdate || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Sex:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.gender || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Civil Status:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.civil_status || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Address:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.address || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Contact Mobile Number:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.contact_no || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Email Address:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.email_address || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>College:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.college || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Year Graduated:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.gradyear || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Degree/Course:</td>
              <td className={styles.answerCol}>
                {studentData?.personalInfo?.course || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Current Status:</td>
              <td className={styles.answerCol}>
                {employmentInfo.employmentStatus || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Job Title/Position:</td>
              <td className={styles.answerCol}>
                {employmentInfo.position || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Company Name:</td>
              <td className={styles.answerCol}>
                {employmentInfo.companyName || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Type of Organization:</td>
              <td className={styles.answerCol}>
                {employmentInfo.organizationType || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Nature of Work/Business:</td>
              <td className={styles.answerCol}>
                {employmentInfo.natureOfWork || 'N/A'}
              </td>
            </tr>
            <tr>
              <td className={styles.questionCol}>Job Related to Course?</td>
              <td className={styles.answerCol}>
                {employmentInfo.jobRelatedToCourse ? 'Yes' : 'No'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Tracer1Tab };