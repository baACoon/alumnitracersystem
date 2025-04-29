import React, { useState } from 'react';
import Notification from './Notification'; 
import styles from './TracerTabs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faBuilding, faCalendar} from '@fortawesome/free-solid-svg-icons'; // or duotone if you're using Pro
import { faGraduationCap, faBookOpen, faBriefcase, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // or duotone if you're using Pro

const Tracer2Tab = ({ studentData }) => {
  const tracer2Survey = studentData?.surveys?.find(
    s => s.title?.toLowerCase().includes('tracer 2')
  );
  
  const surveyInfo = tracer2Survey || {};
  // You might need to adjust these paths based on your actual API response structure
  const jobDetails = surveyInfo.jobDetails || tracer2Survey?.employmentInfo || {};
  const education = surveyInfo.education || tracer2Survey?.education || [];
  const examinations = surveyInfo.examinations || tracer2Survey?.examinations || [];
  const trainings = surveyInfo.trainings || tracer2Survey?.trainings || [];
  const motivation = surveyInfo.motivation || tracer2Survey?.motivation || {};
  const competencies = jobDetails.competencies || tracer2Survey?.competencies || {};
  
  // 2. Add debugging to check data structure:
  console.log('Tracer 2 Survey Data:', tracer2Survey);
  console.log('Job Details:', jobDetails);
  console.log('Education:', education);
  
  // 3. Error handling for conditional rendering:
  if (!tracer2Survey) {
    return (
      <div className={styles.tracerContainer}>
        <Notification 
          message="No Tracer 2 survey data available for this student."
          studentData={studentData} 
        />
      </div>
    );
  }
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
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{
                          "--fa-primary-color": "#f9fafa",
                          "--fa-secondary-color": "#479e00",
                          marginRight: '8px'
                        }}
                      />
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
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Status</div>
                    <div className={styles.infoValue}>{surveyInfo.job_status || 'N/A'}</div>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faBuilding} />
                  </div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Company</div>
                    <div className={styles.infoValue}>{jobDetails.company_name || 'N/A'}</div>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <FontAwesomeIcon icon={faCalendar} />
                  </div>
                  <div className={styles.infoContent}>
                    <div className={styles.infoLabel}>Date Hired</div>
                    <div className={styles.infoValue}>
                      {jobDetails.year_started ? formatDate(jobDetails.year_started) : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education Tab */}
        {/* Education Tab */}
          {activeTab === 'education' && (
            <div className={styles.tabPanel}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Educational Background</h3>
                {education.length > 0 && (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-rose-100 text-rose-800">
                    {education.length} {education.length === 1 ? 'Degree' : 'Degrees'} Completed
                  </span>
                )}
              </div>

              {education.length > 0 ? (
                <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-24px)] before:w-0.5 before:bg-gradient-to-b before:from-rose-600 before:to-emerald-500">
                  {education.map((edu, index) => {
                    const isEvenIndex = index % 2 === 0;
                    const iconColor = isEvenIndex ? 'bg-rose-600' : 'bg-emerald-500';
                    const borderColor = isEvenIndex ? 'border-l-rose-600' : 'border-l-emerald-500';
                    const badgeColor = isEvenIndex ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800';
                    const iconTextColor = isEvenIndex ? 'text-rose-600' : 'text-emerald-500';
                    const progressBg = isEvenIndex ? 'bg-rose-100' : 'bg-emerald-100';
                    const progressIndicator = isEvenIndex ? 'bg-rose-600' : 'bg-emerald-500';

                    return (
                      <div key={index} className="relative mb-8">
                        <div className={`absolute -left-8 flex h-6 w-6 items-center justify-center rounded-full ${iconColor} text-white shadow-md`}>
                        <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
                        </div>

                        <div className={`border-l-4 ${borderColor} bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-all`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}>
                                {edu.yearGraduated || 'N/A'}
                              </span>
                              <h4 className="font-semibold text-lg">{edu.degreeType?.join(", ") || 'Degree'}</h4>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium border rounded text-gray-700 border-gray-300">
                              {edu.institution || 'N/A'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Course</p>
                              <p className="font-medium flex items-center gap-1">
                              <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />                                {edu.course?.join(", ") || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">College</p>
                              <p className="font-medium flex items-center gap-1">
                              <FontAwesomeIcon icon={faBriefcase} className="h-4 w-4" />
                              {edu.college?.join(", ") || 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Program Completion</span>
                              <span className="font-medium">100%</span>
                            </div>
                            <div className={`w-full rounded h-2 ${progressBg}`}>
                              <div className={`${progressIndicator} h-2 rounded`} style={{ width: '100%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white p-6 text-center rounded-md shadow">
                  <div className="flex flex-col items-center justify-center py-8">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
                  <h4 className="text-lg font-semibold mb-2">No Education Records</h4>
                    <p className="text-gray-500">No education information is available for this student.</p>
                  </div>
                </div>
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
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        style={{
                          "--fa-primary-color": "#f9fafa",
                          "--fa-secondary-color": "#479e00",
                          marginRight: '8px'
                        }}
                      />
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
        </>
      ) : (
        <Notification studentData={studentData} />
      )}
    </div>
  );
};

export { Tracer2Tab };
