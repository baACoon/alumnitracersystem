import React, { useState } from 'react';
import styles from './TracerTabs.module.css';
import EmploymentHistory from './EmploymentHistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faCalendar,
  faUser
} from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Tracer1Tab = ({ studentData }) => {
  // Extract data from studentData - aligning with backend schema names
  const survey = studentData.survey || {};
  const employmentInfo = studentData?.employmentInfo || {};
  const personalInfo = studentData?.personalInfo || {};
  
  // Format completion date
  const surveyData = studentData?.surveys?.find(
    s => s.title?.toLowerCase().includes('tracer 1')
  );
  const responseInfo = surveyData?.personalInfo || {};
  const completionDate = surveyData?.createdAt || surveyData?.date;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Tab state
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className={styles.tracerContainer}>
      <div className={styles.tracerHeader}>
        <div className={styles.headerInfo}>
          <div className={styles.surveyTitle}>
            <h3>Tracer 1 Survey Response</h3>
            <p className={styles.completionDate}>
              Completed on {completionDate ? formatDate(completionDate) : 'N/A'}
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'personal' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal
          </button>
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
        </div>
      </div>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <div className={styles.tabPanel}>
          <h4 className={styles.sectionTitle}>Personal Information</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>TUP-ID</td>
                <td className={styles.fieldValue}>{studentData.generatedID || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Name</td>
                <td className={styles.fieldValue}>
                  {`${personalInfo.first_name || ''} ${personalInfo.middle_name || ''} ${personalInfo.last_name || ''}`.trim() || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Course</td>
                <td className={styles.fieldValue}>{personalInfo.course || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Year Graduated</td>
                <td className={styles.fieldValue}>{personalInfo.gradyear || studentData?.yearGraduated || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Sex</td>
                <td>{personalInfo.sex || studentData?.personalInfo?.sex || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Contact Number</td>
                <td className={styles.fieldValue}>{personalInfo.contact_no || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Email</td>
                <td className={styles.fieldValue}>{personalInfo.email_address || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Address</td>
                <td className={styles.fieldValue}>{personalInfo.address || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Birthdate</td>
                <td className={styles.fieldValue}>{formatDate(personalInfo.birthdate) || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Nationality</td>
                <td>{personalInfo.nationality || responseInfo.nationality || 'N/A'}</td>
                </tr>
            </tbody>
          </table>

          <div className={styles.quickInfoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Status</div>
                <div className={styles.infoValue}>{employmentInfo.job_status || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Company</div>
                <div className={styles.infoValue}>{employmentInfo.company_name || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Date Hired</div>
                <div className={styles.infoValue}>
                  {formatDate(employmentInfo.year_started) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Employment Tab */}
      {activeTab === 'employment' && (
        <div className={styles.tabPanel}>
          <h4 className={styles.sectionTitle}>Employment Status</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Current Status</td>
                <td className={styles.fieldValue}>
                  <span className={styles.statusBadge}>{employmentInfo.job_status || 'N/A'}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Present Employment</td>
                <td className={styles.fieldValue}>{employmentInfo.is_present_employment ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>First Job After College</td>
                <td className={styles.fieldValue}>{employmentInfo.is_first_job ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Time to Land First Job</td>
                <td className={styles.fieldValue}>{employmentInfo.time_to_land_job || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles.sectionTitle}>Job Details</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Company Name</td>
                <td className={styles.fieldValue}>{employmentInfo.company_name || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Position</td>
                <td className={styles.fieldValue}>{employmentInfo.position || employmentInfo.occupation || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Date Hired</td>
                <td className={styles.fieldValue}>{formatDate(employmentInfo.year_started) || employmentInfo.year_started || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Employment Status</td>
                <td className={styles.fieldValue}>{employmentInfo.job_status || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Type of Organization</td>
                <td className={styles.fieldValue}>{employmentInfo.type_of_organization || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Work Alignment</td>
                <td className={styles.fieldValue}>{employmentInfo.work_alignment || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles.sectionTitle}>Job Factors</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Reasons for Accepting Job</td>
                <td className={styles.fieldValue}>{employmentInfo.reasons_for_accepting || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Reasons for Staying in Job</td>
                <td className={styles.fieldValue}>{employmentInfo.reasons_for_staying || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.quickInfoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Status</div>
                <div className={styles.infoValue}>{employmentInfo.job_status || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Company</div>
                <div className={styles.infoValue}>{employmentInfo.company_name || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Date Hired</div>
                <div className={styles.infoValue}>
                  {formatDate(employmentInfo.year_started) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Education Tab */}
      {activeTab === 'education' && (
        <div className={styles.tabPanel}>
          <h4 className={styles.sectionTitle}>Educational Background</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Degree</td>
                <td className={styles.fieldValue}>{personalInfo.degree || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Course</td>
                <td className={styles.fieldValue}>{personalInfo.course || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>College</td>
                <td className={styles.fieldValue}>{personalInfo.college || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export { Tracer1Tab };