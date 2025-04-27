import React, { useState } from 'react';
import Notification from './Notification'; 
import styles from './TracerTabs.module.css';

const Tracer2Tab = ({ studentData }) => {
  const tracer2Survey = studentData?.surveys?.find(
    s => s.title?.toLowerCase().includes('tracer 2')
  );

  const surveyInfo = tracer2Survey || {};
  const jobDetails = surveyInfo.jobDetails || {};
  const education = surveyInfo.education || [];
  const examinations = surveyInfo.examinations || [];
  const trainings = surveyInfo.trainings || [];
  const motivation = surveyInfo.motivation || {};
  const competencies = jobDetails.competencies || {};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const [activeTab, setActiveTab] = useState('employment');

  return (
    <div className={styles.tracerContainer}>
      {tracer2Survey ? (
        <>
          <div className={styles.tracerHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.surveyTitle}>
                <h3>Tracer 2 Survey Response</h3>
                <p className={styles.completionDate}>
                  Completed on {tracer2Survey.createdAt ? formatDate(tracer2Survey.createdAt) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className={styles.tabContainer}>
              <button 
                className={`${styles.tabButton} ${activeTab === 'employment' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('employment')}
              >
                Employment
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'education' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('education')}
              >
                Education
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'trainings' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('trainings')}
              >
                Trainings & Exams
              </button>
              <button 
                className={`${styles.tabButton} ${activeTab === 'motivations' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('motivations')}
              >
                Motivations
              </button>
            </div>
          </div>

          {/* Employment Tab */}
          {activeTab === 'employment' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Employment Information</h4>
              <table className={styles.dataTable}>
                <tbody>
                  <tr>
                    <td className={styles.fieldLabel}>Job Status</td>
                    <td className={styles.fieldValue}>{surveyInfo.job_status || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className={styles.fieldLabel}>Occupation</td>
                    <td className={styles.fieldValue}>{jobDetails.occupation || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className={styles.fieldLabel}>Company Name</td>
                    <td className={styles.fieldValue}>{jobDetails.company_name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className={styles.fieldLabel}>Year Started</td>
                    <td className={styles.fieldValue}>{jobDetails.year_started || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className={styles.fieldLabel}>Type of Organization</td>
                    <td className={styles.fieldValue}>{jobDetails.type_of_organization || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className={styles.fieldLabel}>Work Alignment</td>
                    <td className={styles.fieldValue}>{jobDetails.work_alignment || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>

              <h4 className={styles.sectionTitle}>Key Competencies</h4>
              {Object.values(competencies).some(Boolean) ? (
                <div className={styles.gridChecklist}>
                  {Object.entries(competencies).map(([key, value]) =>
                    value && (
                      <div key={key} className={styles.checklistItem}>
                        ✅ {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No competencies reported</p>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Educational Background</h4>
              {education.length > 0 ? (
                education.map((edu, index) => (
                  <div key={index} className={styles.educationItem}>
                    <p><strong>Degree Type:</strong> {edu.degreeType?.join(", ") || 'N/A'}</p>
                    <p><strong>College:</strong> {edu.college?.join(", ") || 'N/A'}</p>
                    <p><strong>Course:</strong> {edu.course?.join(", ") || 'N/A'}</p>
                    <p><strong>Year Graduated:</strong> {edu.yearGraduated || 'N/A'}</p>
                    <p><strong>Institution:</strong> {edu.institution || 'N/A'}</p>
                  </div>
                ))
              ) : (
                <p>No education information available.</p>
              )}
            </div>
          )}

          {/* Trainings & Exams Tab */}
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

          {/* Motivations Tab */}
          {activeTab === 'motivations' && (
            <div className={styles.tabPanel}>
              <h4 className={styles.sectionTitle}>Motivations for Further Studies</h4>
              {Object.values(motivation).some(Boolean) ? (
                <div className={styles.gridChecklist}>
                  {Object.entries(motivation).map(([key, value]) =>
                    value && (
                      <div key={key} className={styles.checklistItem}>
                        ✅ {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p>No motivations reported.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <Notification studentData={studentData} />
      )}
    </div>
  );
};

export { Tracer2Tab };
