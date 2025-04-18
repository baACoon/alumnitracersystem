// Frontend: AlumniTable.jsx
import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import  {jwtDecode} from 'jwt-decode';
import { TracerComparisonTab } from './TracerTabComparison';
import { Tracer1Tab } from './TracerTab1';
import { Tracer2Tab } from './TracerTab2';



export function AlumniTable({ batch, college, course, searchQuery, filterApplied }) {
  const [alumniData, setAlumniData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [studentDetails, setStudentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Alumni List');
  const [modalTab, setModalTab] = useState('overview');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Session expired. Please log in again.");
          navigate('/login');
          return;
        }

        jwtDecode(token); // Validate token

         // Construct query string based on filters
         const queryParams = new URLSearchParams();
         if (batch) queryParams.append('batch', batch);
         if (college) queryParams.append('college', college);
         if (course) queryParams.append('course', course);

        // For simplicity, we'll fetch all and filter in the frontend
        // In a production app, you'd want to send these filters to the backend
        const response = await axios.get('http://localhost:5050/api/alumni/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.data?.data) {
          const alumniWithStatus = await Promise.all(response.data.data.map(async (alumni) => {
            try {
              const statusRes = await axios.get(`http://localhost:5050/surveys/user-status/${alumni.userId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
    
              let tracerStatusText = '';
              const status = statusRes.data.status;
              if (status.tracer1Completed && status.tracer2Completed) {
                tracerStatusText = 'Tracer 1 & 2';
              } else if (status.tracer1Completed) {
                tracerStatusText = 'Tracer 1';
              } else if (status.currentlyTaking) {
                tracerStatusText = 'Currently taking Tracer 1';
              } else {
                tracerStatusText = 'No Tracer';
              }
    
              return { ...alumni, tracerStatus: tracerStatusText };
            } catch (error) {
              console.error(`Failed to fetch status for ${alumni.userId}`, error);
              return { ...alumni, tracerStatus: 'Unknown' };
            }
          }));
    
          setAlumniData(alumniWithStatus);
        } else {
          alert('No alumni data available.');
          setAlumniData([]);
        }
      } catch (error) {
        console.error('Error fetching alumni data:', error);
        if (error.response?.status === 401) {
          alert("Authentication error. Please log in again.");
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Apply filters when data, search query, or filters change
  useEffect(() => {
    let result = [...alumniData];
    
    // Apply batch filter
    if (batch) {
      result = result.filter(alumni => 
        alumni.personalInfo.gradyear?.toString() === batch.toString()
      );
    }
    
    // Apply college filter
    if (college) {
      result = result.filter(alumni => 
        alumni.personalInfo.college?.toUpperCase() === college.toUpperCase()
      );
    }
    
    // Apply course filter
    if (course) {
      result = result.filter(alumni => 
        alumni.personalInfo.course?.toUpperCase() === course.toUpperCase()
      );
    }
    
    // Apply search query
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(alumni => {
        const fields = [
          alumni.personalInfo.first_name?.toLowerCase() || '',
          alumni.personalInfo.last_name?.toLowerCase() || '',
          alumni.personalInfo.gradyear?.toString().toLowerCase() || '',
          alumni.personalInfo.course?.toLowerCase() || '',
          alumni.generatedID?.toLowerCase() || '',
          alumni.personalInfo.email_address?.toLowerCase() || ''
        ];
        
        return fields.some(field => field.includes(term));
      });
    }
    
    setFilteredData(result);
    
    // Reset selected alumni when filters change
    setSelectedAlumni(new Set());
  }, [alumniData, batch, college, course, searchQuery]);

  
  const handleSelectAll = (e) => {
    setSelectedAlumni(e.target.checked ? new Set(filteredData.map((alumni) => alumni.userId)) : new Set());
  };

  const handleSelectAlumni = (id) => {
    const newSelected = new Set(selectedAlumni);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedAlumni(newSelected);
  };

  const openStudentDetails = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching details for user ID:', userId);

      const [studentRes, statusRes] = await Promise.all([
        axios.get(`http://localhost:5050/api/alumni/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5050/surveys/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      console.log('API response data:', studentRes.data);

      if (studentRes.data?.data) {
        setStudentDetails({
          ...studentRes.data.data,
          tracerStatus: statusRes.data.status,
        });
        console.log('Student Details:', studentRes.data.data);
      } else {
        console.error('Unexpected API response structure:', studentRes.data);
        alert('Failed to fetch student details.');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      if (error.response?.status === 404) {
        alert('Alumnus not found.');
      } else if (error.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else {
        alert('An error occurred while fetching student details.');
      }
    }
  };

  const filteredAlumni = alumniData.filter((alumni) => {
    const term = searchQuery.toLowerCase();
    const fields = [
      alumni.personalInfo.first_name?.toLowerCase() || '',
      alumni.personalInfo.last_name?.toLowerCase() || '',
      alumni.personalInfo.gradyear?.toString().toLowerCase() || '',
      alumni.personalInfo.course?.toLowerCase() || '',
      alumni.generatedID?.toLowerCase() || '',
      alumni.personalInfo.email_address?.toLowerCase() || ''
    ];
  
    return fields.some(field => field.includes(term));
  });
  

  console.log('Filtered Alumni:', filteredAlumni);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };


  return (
    <section className={styles.tableSection}>
      {/*<div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'Alumni List' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('Alumni List')}
        >
          Alumni List
        </button>
      </div>*/}

      {activeTab === 'Alumni List' && (
        <>
          <div className={styles.tableWrapper} role="region" aria-label="Alumni table" tabIndex="0">
            <table className={styles.alumniTable}>
              <thead>
                <tr>
                  <th scope="col">
                    <input
                      type="checkbox"
                      id="selectAll"
                      onChange={handleSelectAll}
                      aria-label="Select all alumni"
                      checked={selectedAlumni.size > 0 && selectedAlumni.size === filteredData.length}
                      />
                  </th>
                  <th scope="col">TUP-ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Course</th>
                  <th scope="col">Year Graduated</th>
                  <th scope="col">Tracer Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((alumni) => (
                  <tr key={alumni.userId} onClick={() => openStudentDetails(alumni.userId)}>
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        id={`select-${alumni.userId}`}
                        checked={selectedAlumni.has(alumni.userId)}
                        onChange={() => handleSelectAlumni(alumni.userId)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Select ${alumni.userId}`}
                      />
                    </td>
                    <td>{alumni.generatedID}</td>
                    <td>{`${alumni.personalInfo.first_name} ${alumni.personalInfo.last_name}`}</td>
                    <td>{alumni.personalInfo.email_address}</td>
                    <td>{alumni.personalInfo.course}</td>
                    <td>{alumni.personalInfo.gradyear}</td>
                    <td>
                      <span className={`${styles.tracerStatus} ${
                        alumni.tracerStatus?.includes('&') ? styles.tracerStatusMultiple : styles.tracerStatusSingle
                      }`}>
                        {alumni.tracerStatus || 'No tracer'}
                      </span>
                    </td>
                    <td>
                      <button className={styles.actionButton} onClick={(e) => {
                        e.stopPropagation();
                        openStudentDetails(alumni.userId);
                      }}>
                        ›
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '1rem', fontStyle: 'italic', color: 'gray' }}>
                    {searchQuery 
                      ? `Sorry, there is no "${searchQuery}" in the alumni list.`
                      : batch || college || course 
                        ? 'No alumni match all the selected filters.'
                        : 'No alumni records found.'
                    }
                  </td>
                </tr>
                )}
              </tbody>

            </table>
          </div>
        </>
      )}


      {/* {activeTab === 'Tracer Comparison' && (
        <div className={styles.emptyState}>
          Left blank as requested 
        </div>
      )}*/}
      
      {studentDetails && (
      <div className={styles.modalOverlay} onClick={() => setStudentDetails(null)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setStudentDetails(null)}>
            ×
          </button>
          
          {studentDetails.personalInfo ? (
            <>
            <div className={`${styles.modalHeader} ${styles.gradientHeader}`}>
                <button 
                  className={styles.closeButton} 
                  onClick={() => setStudentDetails(null)}
                >
                  <i className="fas fa-times"></i>
                </button>

                <div className={styles.headerContent}>
                  <div className={styles.profileAvatar}>
                    <FontAwesomeIcon icon="fa-light fa-user" />
                  </div>

                  <div className={styles.profileInfo}>
                    <h3 className={styles.profileName}>
                      {`${studentDetails.personalInfo.first_name} ${studentDetails.personalInfo.last_name}`}
                    </h3>
                    
                    <div className={styles.badgeContainer}>
                      <span className={styles.infoBadge}>
                        TUP-ID: {studentDetails.generatedID}
                      </span>
                      <span className={styles.infoBadge}>
                        {studentDetails.personalInfo.course || 'N/A'}
                      </span>
                      <span className={styles.infoBadge}>
                        Class of {studentDetails.personalInfo.gradyear || 'N/A'}
                      </span>
                    </div>

                    <div className={styles.contactInfo}>
                      <div className={styles.contactItem}>
                        <i className="fas fa-envelope"></i>
                        <span>{studentDetails.personalInfo.email_address || 'N/A'}</span>
                      </div>
                      <div className={styles.contactItem}>
                        <i className="fas fa-phone"></i>
                        <span>{studentDetails.personalInfo.contact_no || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.profileTabs}>
                <button 
                  className={`${styles.profileTab} ${modalTab === 'overview' ? styles.activeProfileTab : ''}`}
                  onClick={() => setModalTab('overview')}
                >
                  Overview
                </button>
                <button 
                  className={`${styles.profileTab} ${modalTab === 'tracer1' ? styles.activeProfileTab : ''}`}
                  onClick={() => setModalTab('tracer1')}
                >
                  Tracer 1
                </button>
                <button 
                  className={`${styles.profileTab} ${modalTab === 'tracer2' ? styles.activeProfileTab : ''}`}
                  onClick={() => setModalTab('tracer2')}
                >
                  Tracer 2
                </button>
            </div>  

              <div className={styles.profileContent}>
                {modalTab === 'overview' && (
                  <TracerComparisonTab 
                      studentData={studentDetails} 
                      tracerStatus={studentDetails.tracerStatus} // ✅ pass tracerStatus
                    />                
                    )}
                {modalTab === 'tracer1' && <Tracer1Tab studentData={studentDetails} />}
                {modalTab === 'tracer2' && <Tracer2Tab studentData={studentDetails} />}
              </div>

              {/* Moved footer outside the tab content */}
              <div className={styles.modalFooter}>
                <button className={styles.closeModalBtn} onClick={() => setStudentDetails(null)}>
                  Close
                </button>
              </div>
            </>
          ) : (
            <p>Error loading student details.</p>
          )}
        </div>
      </div>
    )}
    </section>
  );
}

export default AlumniTable;
