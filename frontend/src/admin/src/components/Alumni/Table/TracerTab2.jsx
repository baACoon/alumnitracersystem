import React, { useState } from 'react';
import Notification from './Notification';
import styles from './TracerTabs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck, faBuilding, faCalendar,
  faGraduationCap, faBookOpen, faBriefcase, faUser
} from '@fortawesome/free-solid-svg-icons';

// ...existing imports...

const Tracer2Tab = ({ studentData }) => {
  const tracer1Survey = studentData?.surveys?.find(
    s => s.title?.toLowerCase().includes('tracer 1')
  );
  const tracer2Survey = studentData?.surveys?.find(
    s => s.title?.toLowerCase().includes('tracer 2')
  );

  const [activeTab, setActiveTab] = useState('employment');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Calculate eligibility first
  const gradYear = studentData?.batch || studentData?.student?.batch || '2018';
  const graduationYear = parseInt(gradYear);
  const eligibilityDate = new Date(graduationYear + 2, 0, 1);
  const currentDate = new Date();
  const isEligible = currentDate >= eligibilityDate;

  // Debug logging
  console.log('Debug Info:', {
    gradYear,
    graduationYear,
    eligibilityDate: eligibilityDate.toDateString(),
    currentDate: currentDate.toDateString(),
    isEligible
  });

  // Handle different display cases
  const renderContent = () => {
    // First, check if they're not eligible (this should take precedence)
    if (!isEligible) {
      const eligibilityYear = graduationYear + 2;
      return (
        <div className={`${styles.tracerContainer} ${styles.centerNotice}`}>
          <div className={styles.plainTextNotice}>
            <p>
              No Tracer 2 available today. Come back in <strong>{eligibilityYear}</strong> to answer the Tracer 2.
            </p>
          </div>
        </div>
      );
    }

    // Then check if they've already submitted Tracer 2
    if (tracer2Survey) {
      const surveyInfo = tracer2Survey;
      const jobDetails = surveyInfo.jobDetails || {};
      const education = surveyInfo.education || [];
      const examinations = surveyInfo.examinations || [];
      const trainings = surveyInfo.trainings || [];
      const motivation = surveyInfo.motivation || {};
      const competencies = jobDetails.competencies || {};

      return (
        <div className={styles.tracerContainer}>
          {/* Your existing survey display code */}
          <div className={styles.tracerHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.surveyTitle}>
                <h3>Tracer 2 Survey Response</h3>
                <p className={styles.completionDate}>
                  Completed on {surveyInfo.createdAt ? formatDate(surveyInfo.createdAt) : 'N/A'}
                </p>
              </div>
            </div>

            <div className={styles.tabContainer}>
              <button className={`${styles.tabButton} ${activeTab === 'employment' ? styles.activeTab : ''}`} onClick={() => setActiveTab('employment')}>Employment</button>
              <button className={`${styles.tabButton} ${activeTab === 'education' ? styles.activeTab : ''}`} onClick={() => setActiveTab('education')}>Education</button>
              <button className={`${styles.tabButton} ${activeTab === 'trainings' ? styles.activeTab : ''}`} onClick={() => setActiveTab('trainings')}>Trainings & Exams</button>
              <button className={`${styles.tabButton} ${activeTab === 'motivations' ? styles.activeTab : ''}`} onClick={() => setActiveTab('motivations')}>Motivations</button>
            </div>
          </div>

          {/* Employment */}
          {activeTab === 'employment' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Employment Information</h4>
              <table className={styles.dataTable}>
                <tbody>
                  <tr><td className={styles.fieldLabel}>Job Status</td><td className={styles.fieldValue}>{surveyInfo.job_status || 'N/A'}</td></tr>
                  <tr><td className={styles.fieldLabel}>Occupation</td><td className={styles.fieldValue}>{jobDetails.occupation || 'N/A'}</td></tr>
                  <tr><td className={styles.fieldLabel}>Company Name</td><td className={styles.fieldValue}>{jobDetails.company_name || 'N/A'}</td></tr>
                  <tr><td className={styles.fieldLabel}>Year Started</td><td className={styles.fieldValue}>{jobDetails.year_started || 'N/A'}</td></tr>
                  <tr><td className={styles.fieldLabel}>Type of Organization</td><td className={styles.fieldValue}>{jobDetails.type_of_organization || 'N/A'}</td></tr>
                  <tr><td className={styles.fieldLabel}>Work Alignment</td><td className={styles.fieldValue}>{jobDetails.work_alignment || 'N/A'}</td></tr>
                </tbody>
              </table>

              <h4 className={styles.sectionTitle}>Key Competencies</h4>
              {Object.values(competencies).some(Boolean) ? (
                <div className={styles.gridChecklist}>
                  {Object.entries(competencies).map(([key, value]) =>
                    value && (
                      <div key={key} className={styles.checklistItem}>
                        <FontAwesomeIcon icon={faCircleCheck} style={{ "--fa-secondary-color": "#479e00", marginRight: '8px' }} />
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No competencies reported</p>
              )}

              <div className={styles.quickInfoGrid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}><FontAwesomeIcon icon={faUser} /></div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Status</div>
                    <div className={styles.infoValue}>{surveyInfo.job_status || 'N/A'}</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}><FontAwesomeIcon icon={faBuilding} /></div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Company</div>
                    <div className={styles.infoValue}>{jobDetails.company_name || 'N/A'}</div>
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}><FontAwesomeIcon icon={faCalendar} /></div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Date Hired</div>
                    <div className={styles.infoValue}>{jobDetails.year_started ? formatDate(jobDetails.year_started) : 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Educational Background</h4>
              {education.length > 0 ? (
                education.map((edu, idx) => (
                  <div key={idx} className={styles.trainingItem}>
                    <p><strong>Course:</strong> {edu.course?.join(', ') || 'N/A'}</p>
                    <p><strong>College:</strong> {edu.college?.join(', ') || 'N/A'}</p>
                    <p><strong>Institution:</strong> {edu.institution || 'N/A'}</p>
                    <p><strong>Year Graduated:</strong> {edu.yearGraduated || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No education records available.</p>
              )}
            </div>
          )}

          {/* Trainings & Exams */}
          {activeTab === 'trainings' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Trainings</h4>
              {surveyInfo.noTrainings ? (
                <p>No Trainings Taken</p>
              ) : trainings.length > 0 ? (
                trainings.map((train, idx) => (
                  <div key={idx} className={styles.trainingItem}>
                    <p><strong>Title:</strong> {train.title || 'N/A'}</p>
                    <p><strong>Duration:</strong> {train.duration || 'N/A'}</p>
                    <p><strong>Institution:</strong> {train.institution || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No trainings available.</p>
              )}

              <h4 className={styles.sectionTitle}>Examinations</h4>
              {surveyInfo.noExams ? (
                <p>No Examinations Taken</p>
              ) : examinations.length > 0 ? (
                examinations.map((exam, idx) => (
                  <div key={idx} className={styles.examItem}>
                    <p><strong>Exam Name:</strong> {exam.examName || 'N/A'}</p>
                    <p><strong>Date Taken:</strong> {exam.dateTaken || 'N/A'}</p>
                    <p><strong>Rating:</strong> {exam.rating || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No examinations available.</p>
              )}
            </div>
          )}

          {/* Motivations */}
          {activeTab === 'motivations' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Motivations for Further Studies</h4>
              {Object.values(motivation).some(Boolean) ? (
                <div className={styles.gridChecklist}>
                  {Object.entries(motivation).map(([key, value]) =>
                    value && (
                      <div key={key} className={styles.checklistItem}>
                        <FontAwesomeIcon icon={faCircleCheck} style={{ "--fa-secondary-color": "#479e00", marginRight: '8px' }} />
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No motivations reported.</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // Finally, if they're eligible but haven't submitted
    return (
      <div className={styles.tracerContainer}>
        <Notification
          message={`Tracer 2 is not yet answered. It became available on ${formatDate(eligibilityDate)}.`}
          studentData={studentData}
        />
      </div>
    );
  };

  return renderContent();
};

export { Tracer2Tab };
