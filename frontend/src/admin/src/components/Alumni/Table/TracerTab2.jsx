// Tracer2Tab.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TracerTabs.module.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faCalendar,
  faUser
} from '@fortawesome/free-regular-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Tracer2Tab = ({ studentData }) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState('both');
  const [scheduleNotification, setScheduleNotification] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tracerData, setTracerData] = useState(null); // State to store Tracer 2 data
  const [fetchError, setFetchError] = useState(null); // State to handle fetch errors

  const [tracer2Data, setTracer2Data] = useState(null);
  const [hasTracer2, setHasTracer2] = useState(false);

  const templates = {
    default: `Dear ${studentData?.personalInfo?.first_name || 'Student'},\n\nWe noticed you haven't completed the Tracer 2 survey yet. Your feedback is important to us. Please take a moment to complete the survey at your earliest convenience.\n\nThank you,\nTUPATS Team`,
    reminder: `Dear ${studentData?.personalInfo?.first_name || 'Student'},\n\nThis is a friendly reminder that the Tracer 2 survey is still pending completion. Your insights are valuable to our institution's development.\n\nThank you,\nTUPATS Team`,
    urgent: `Dear ${studentData?.personalInfo?.first_name || 'Student'},\n\nUrgent: The deadline for the Tracer 2 survey is approaching. Please complete it as soon as possible to ensure your feedback is included in our analysis.\n\nThank you,\nTUPATS Team`,
  };
  
  const [messageTemplate, setMessageTemplate] = useState('default');
  const [customMessage, setCustomMessage] = useState(templates['default']);

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Check if student has completed Tracer 2 survey
  useEffect(() => {
    // Check for tracer2 data in studentData
    if (studentData && studentData.surveys) {
      const tracer2Survey = studentData.surveys.find(
        survey => survey.title?.toLowerCase().includes('tracer 2') || 
                  survey.surveyType?.toLowerCase() === 'tracer2'
      );
      
      if (tracer2Survey) {
        setHasTracer2(true);
        setTracer2Data(tracer2Survey);
      } else {
        // Fallback: Check if there's direct tracer2 data
        if (studentData.tracer2 || studentData.tracer2Survey) {
          setHasTracer2(true);
          setTracer2Data(studentData.tracer2 || studentData.tracer2Survey);
        } else {
          fetchTracer2Data();
        }
      }
    } else {
      fetchTracer2Data();
    }
  }, [studentData]);

  // Fetch Tracer 2 data from API if not already in studentData
  const fetchTracer2Data = async () => {
    if (!studentData || !studentData.id) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:5050/api/tracer2/${studentData.id}`);
      if (response.data && Object.keys(response.data).length > 0) {
        setTracer2Data(response.data);
        setHasTracer2(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching Tracer 2 data:', error);
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    // Check if message is empty
    if (!customMessage.trim()) {
      setErrorMessage('Please fill in the message field.');
      setShowError(true);
      return false;
    }
    
    // Check if schedule is selected but dates are missing
    if (scheduleNotification) {
      if (!scheduleDate || !scheduleTime) {
        setErrorMessage('Please select both date and time for scheduling.');
        setShowError(true);
        return false;
      }
    }

    // Check if email address exists
    if (!studentData?.personalInfo?.email_address) {
      setErrorMessage('No email address found for this student.');
      setShowError(true);
      return false;
    }

    return true;
  };
  
  const handleSendReminder = async () => {
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    setShowError(false);
    setIsLoading(true);
    
    const email = studentData.personalInfo?.email_address;
    const subject = "Reminder: Complete your Tracer 2 Survey";
  
    try {
      const response = await axios.post("http://localhost:5050/api/notifications/send-notification", {
        email: email,
        subject,
        message: customMessage
      });
  
      if (response.status === 200) {
        setIsLoading(false); // Stop loading immediately
        setNotificationSent(true);
        setShowSuccess(true);
    
        // Optional: Auto-hide success after a few seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setIsLoading(false);
      setErrorMessage('Failed to send notification. Please try again.');
      setShowError(true);
    }
  };

  // If we have Tracer 2 data, display it
  if (hasTracer2 && tracer2Data) {
    // Get employment info from tracer 2 data
    const employmentInfo = tracer2Data.employmentInfo || {};
    // Get completion date
    const completionDate = tracer2Data.createdAt || tracer2Data.date;

    return (
      <div className={styles.tracerContainer}>
        <div className={styles.tracerHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.surveyTitle}>
              <h3>Tracer 2 Survey Response</h3>
              <p className={styles.completionDate}>
                Completed on {completionDate ? formatDate(completionDate) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.tabPanel}>
          <h4 className={styles.sectionTitle}>Employment Status</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Current Status</td>
                <td className={styles.fieldValue}>
                  <span className={styles.statusBadge}>{employmentInfo.job_status || tracer2Data.job_status || 'N/A'}</span>
                </td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Present Employment</td>
                <td className={styles.fieldValue}>{employmentInfo.is_present_employment || tracer2Data.is_present_employment ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>First Job After College</td>
                <td className={styles.fieldValue}>{employmentInfo.is_first_job || tracer2Data.is_first_job ? 'Yes' : 'No'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Time to Land First Job</td>
                <td className={styles.fieldValue}>{employmentInfo.time_to_land_job || tracer2Data.time_to_land_job || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles.sectionTitle}>Job Details</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Company Name</td>
                <td className={styles.fieldValue}>{employmentInfo.company_name || tracer2Data.company_name || tracer2Data.company || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Position</td>
                <td className={styles.fieldValue}>{employmentInfo.position || tracer2Data.position || employmentInfo.occupation || tracer2Data.occupation || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Date Hired</td>
                <td className={styles.fieldValue}>{formatDate(employmentInfo.year_started || tracer2Data.year_started) || employmentInfo.year_started || tracer2Data.year_started || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Employment Status</td>
                <td className={styles.fieldValue}>{employmentInfo.job_status || tracer2Data.job_status || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Type of Organization</td>
                <td className={styles.fieldValue}>{employmentInfo.type_of_organization || tracer2Data.type_of_organization || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Work Alignment</td>
                <td className={styles.fieldValue}>{employmentInfo.work_alignment || tracer2Data.work_alignment || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

          <h4 className={styles.sectionTitle}>Job Factors</h4>
          <table className={styles.dataTable}>
            <tbody>
              <tr>
                <td className={styles.fieldLabel}>Reasons for Accepting Job</td>
                <td className={styles.fieldValue}>{employmentInfo.reasons_for_accepting || tracer2Data.reasons_for_accepting || 'N/A'}</td>
              </tr>
              <tr>
                <td className={styles.fieldLabel}>Reasons for Staying in Job</td>
                <td className={styles.fieldValue}>{employmentInfo.reasons_for_staying || tracer2Data.reasons_for_staying || 'N/A'}</td>
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
                <div className={styles.infoValue}>{employmentInfo.job_status || tracer2Data.job_status || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Company</div>
                <div className={styles.infoValue}>{employmentInfo.company_name || tracer2Data.company_name || tracer2Data.company || 'N/A'}</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <FontAwesomeIcon icon={faCalendar} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Date Hired</div>
                <div className={styles.infoValue}>
                  {formatDate(employmentInfo.year_started || tracer2Data.year_started) || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

// Move this outside the component!
const StyledWrapper = styled.div`
  .button-container {
    width: 100%;
    margin-top: 1rem;
  }

  button {
    width: 100%;
    color: white;
    background-color: #1D4ED8;
    font-weight: 500;
    border-radius: 0.5rem;
    font-size: 1rem;
    line-height: 2rem;
    padding: 0.7rem 2rem;
    text-align: center;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #1E40AF;
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  button svg {
    width: 1.3rem;
    height: 1.3rem;
    margin-right: 0.75rem;
    color: white;
  }

  .loading-icon {
    animation: spin_357 1s linear infinite;
  }

  @keyframes spin_357 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .success-alert {
    width: 100%;
    padding: 12px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    background: #EDFBD8;
    border-radius: 8px;
    border: 1px solid #84D65A;
  }

  .success-icon {
    margin-right: 8px;
    color: #84D65A;
  }

  .success-message {
    font-weight: 500;
    font-size: 14px;
    color: #2B641E;
  }

  .error-alert {
    width: 100%;
    padding: 12px;
    margin-top: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    background: #FEEAEA;
    border-radius: 8px;
    border: 1px solid #FF5252;
  }

  .error-icon {
    margin-right: 8px;
    color: #FF5252;
  }

  .error-message {
    font-weight: 500;
    font-size: 14px;
    color: #D32F2F;
  }
`;

  return (
    <div className={styles.tracerContainer}>
      <div className={styles.tracerNotCompleted}>
        <div className={styles.iconContainer}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={styles.clockIcon}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        
        <h3 className={styles.tracerTitle}>Tracer 2 Not Completed</h3>
        
        <p className={styles.tracerMessage}>
          This alumni has not yet completed the Tracer 2 survey. Send a notification to remind them.
        </p>

        {isLoading && <p>Loading...</p>}
        {fetchError && <p className={styles.errorMessage}>{fetchError}</p>}
        {tracerData ? (
          <div className={styles.tracerData}>
            <p><strong>Survey Status:</strong> {tracerData.status}</p>
            <p><strong>Completion Date:</strong> {tracerData.completionDate || 'Not completed'}</p>
            <p><strong>Feedback:</strong> {tracerData.feedback || 'No feedback provided'}</p>
          </div>
        ) : (
          !fetchError && <p>No Tracer 2 data available for this student.</p>
        )}
        
        <StyledWrapper>
          {showSuccess && (
            <div className="success-alert">
              <svg 
                className="success-icon"
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              <span className="success-message">
                Notification has been sent to {studentData?.name || 'student'} via email.
              </span>
            </div>
          )}
          
          {showError && (
            <div className="error-alert">
              <svg 
                className="error-icon"
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="error-message">
                {errorMessage || 'Please fix the errors before sending the notification'}
              </span>
            </div>
          )}
        
          <div className={styles.reminderCard}>
            {/* Notification Method */}
            <div className={styles.methodSection}>
              <label className={styles.sectionLabel}>Notification Method</label>
              <div className={styles.methodOptions}>
                <label 
                  className={`${styles.methodOption} ${notificationMethod === 'email' ? styles.methodOptionSelected : ''}`}
                  onClick={() => setNotificationMethod('email')}
                >
                  <input 
                    type="radio" 
                    name="notificationMethod" 
                    value="email" 
                    checked={notificationMethod === 'email'} 
                    onChange={() => {}} 
                    className={styles.methodRadio} 
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                  <span>Email</span>
                </label>
                
                <label 
                  className={`${styles.methodOption} ${notificationMethod === 'sms' ? styles.methodOptionSelected : ''}`}
                  onClick={() => setNotificationMethod('sms')}
                >
                  <input 
                    type="radio" 
                    name="notificationMethod" 
                    value="sms" 
                    checked={notificationMethod === 'sms'} 
                    onChange={() => {}} 
                    className={styles.methodRadio} 
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>SMS</span>
                </label>
                
                <label 
                  className={`${styles.methodOption} ${notificationMethod === 'both' ? styles.methodOptionSelected : ''}`}
                  onClick={() => setNotificationMethod('both')}
                >
                  <input 
                    type="radio" 
                    name="notificationMethod" 
                    value="both" 
                    checked={notificationMethod === 'both'} 
                    onChange={() => {}} 
                    className={styles.methodRadio} 
                  />
                  <div className={styles.bothIcons}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <span className={styles.plus}>+</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <span>Both</span>
                </label>
              </div>
            </div>
            
            <div className={styles.separator}></div>
            
            {/* Message Section */}
            <div className={styles.messageSection}>
              <div className={styles.messageHeader}>
                <label className={styles.sectionLabel}>Message</label>
                <div className={styles.templateSelector}>
                  <label htmlFor="templateSelect" className={styles.templateLabel}>Template:</label>
                  <select 
                    id="templateSelect" 
                    className={styles.templateSelect}
                    value={messageTemplate}
                    onChange={(e) => {
                      setMessageTemplate(e.target.value);
                      setCustomMessage(templates[e.target.value]); // update the textbox too!
                      setShowError(false); // Clear error when template changes
                    }}
                  >
                    <option value="default">Default</option>
                    <option value="reminder">Reminder</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <textarea 
                className={styles.messageArea}
                value={customMessage}
                onChange={(e) => {
                  setCustomMessage(e.target.value);
                  if (!e.target.value.trim()) {
                    setErrorMessage('Message cannot be empty');
                    setShowError(true);
                  } else {
                    setShowError(false);
                  }
                }}
              />
            </div>
            
            {/* Schedule Option */}
            <div className={styles.scheduleOption}>
              <label className={styles.scheduleCheckbox}>
                <input 
                  type="checkbox" 
                  checked={scheduleNotification}
                  onChange={(e) => {
                    setScheduleNotification(e.target.checked);
                    if (!e.target.checked) {
                      // Clear any schedule-related errors
                      if (errorMessage.includes('date') || errorMessage.includes('time')) {
                        setShowError(false);
                      }
                    }
                  }}
                />
                <div className={styles.checkboxUI}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={styles.checkIcon}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <div className={styles.scheduleLabel}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Schedule for later
                </div>
              </label>
              <div className={styles.infoIcon} data-tooltip="Only required if you want to schedule the notification.">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
            </div>
            
            {/* Schedule Date/Time (conditionally rendered) */}
            {scheduleNotification && (
              <div className={styles.scheduleInputs}>
                <div className={styles.inputGroup}>
                  <label htmlFor="dateInput" className={styles.inputLabel}>Date</label>
                  <div className={styles.dateInputWrapper}>
                    <input 
                      type="date" 
                      id="dateInput"
                      className={styles.dateInput}
                      value={scheduleDate}
                      onChange={(e) => {
                        setScheduleDate(e.target.value);
                        if (scheduleTime && !showError) {
                          setShowError(false);
                        }
                      }}
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={styles.inputIcon}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="timeInput" className={styles.inputLabel}>Time</label>
                  <div className={styles.timeInputWrapper}>
                    <input 
                      type="time" 
                      id="timeInput"
                      className={styles.timeInput}
                      value={scheduleTime}
                      onChange={(e) => {
                        setScheduleTime(e.target.value);
                        if (scheduleDate && !showError) {
                          setShowError(false);
                        }
                      }}
                    />
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={styles.inputIcon}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Send Button */}
          <div className="button-container">
            <button onClick={handleSendReminder} disabled={isLoading || notificationSent} type="button">
              {isLoading ? (
                <>
                  <svg 
                    className="loading-icon" 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Loading...
                </>
              ) : notificationSent ? (
                <>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  Notification Sent
                </>
              ) : (
                "Send Notification"
              )}
            </button>
          </div>
        </StyledWrapper>
      </div>
    </div>
  );
};

export { Tracer2Tab };