// Tracer2Tab.jsx
import React, { useState } from 'react';
import axios from 'axios';
import styles from './TracerTabs.module.css';

const Notification = ({ studentData }) => {
  const [notificationSent, setNotificationSent] = useState(false);
  const [notificationMethod, setNotificationMethod] = useState('both');
  const [scheduleNotification, setScheduleNotification] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [messageTemplate, setMessageTemplate] = useState('default');

  // Default message template
  const templates = {
    default: `Dear ${studentData?.name || 'Student'},\n\nWe noticed you haven't completed the Tracer 2 survey yet. Your feedback is important to us. Please take a moment to complete the survey at your earliest convenience.\n\nThank you,\nTUPATS Team`,
    reminder: `Dear ${studentData?.name || 'Student'},\n\nThis is a friendly reminder that the Tracer 2 survey is still pending completion. Your insights are valuable to our institution's development.\n\nThank you,\nTUPATS Team`,
    urgent: `Dear ${studentData?.name || 'Student'},\n\nUrgent: The deadline for the Tracer 2 survey is approaching. Please complete it as soon as possible to ensure your feedback is included in our analysis.\n\nThank you,\nTUPATS Team`,
  };

  const handleSendReminder = async () => {
    const email = studentData.personalInfo?.email_address;
    const subject = "Reminder: Complete your Tracer 2 Survey";
    const text = templates[messageTemplate];
  
    if (!email) {
      alert("❌ No email address found for this student. Please verify the student's data.");
      return;
    }
  
    try {
      const response = await axios.post(`http://localhost:5050/api/notifications/send-notification`, {
        email,
        subject,
        message: text
      });
  
      if (response.status === 200) {
        setNotificationSent(true);
        setTimeout(() => setNotificationSent(false), 3000);
        alert("✅ Notification sent successfully!");
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('❌ Failed to send notification');
    }
  };

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
                  onChange={(e) => setMessageTemplate(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="reminder">Reminder</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <textarea 
              className={styles.messageArea}
              value={templates[messageTemplate]}
              onChange={(e) => {
                // Handle custom template
              }}
            />
          </div>
          
          {/* Schedule Option */}
          <div className={styles.scheduleOption}>
            <label className={styles.scheduleCheckbox}>
              <input 
                type="checkbox" 
                checked={scheduleNotification}
                onChange={(e) => setScheduleNotification(e.target.checked)}
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
            <div className={styles.infoIcon}>
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
                    onChange={(e) => setScheduleDate(e.target.value)}
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
                    onChange={(e) => setScheduleTime(e.target.value)}
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
          
          {/* Send Button */}
          <button
            className={`${styles.sendButton} ${notificationSent ? styles.sentButton : ''}`}
            onClick={handleSendReminder}
            disabled={notificationSent}
          >
            {notificationSent ? (
              <>
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
                  className={styles.buttonIcon}
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Notification Sent
              </>
            ) : (
              <>
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
                  className={styles.buttonIcon}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                Send Notification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Notification;
