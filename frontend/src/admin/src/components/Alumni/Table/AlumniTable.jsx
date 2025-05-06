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
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // ✅ valid icon

// Loader Component
function Loader() {
  return (
    <section className={styles.dotsContainer}>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
      <div className={styles.dot}></div>
    </section>
  );
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Show max 5 page numbers at a time

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        start = 2;
        end = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      // Add ellipsis if needed
      if (start > 2) pages.push('...');

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) pages.push('...');

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationWrapper}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>

        {getPageNumbers().map((page, index) =>
          page === '...' ? (
            <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>...</span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.paginationButton} ${currentPage === page ? styles.paginationActive : ''}`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
      <div className={styles.paginationInfo}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}



export function AlumniTable({ batch, college, course, searchQuery, filterApplied }) {
  const [alumniData, setAlumniData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [studentDetails, setStudentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Alumni List');
  const [modalTab, setModalTab] = useState('overview');
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages based on filtered data length
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Session expired. Please log in again.");
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

              // Pull gradyear directly from the student schema (student object in the response)
              const gradYear = alumni.student?.gradyear || 'N/A'; // Adjust based on actual field name in your schema
              const employmentInfo = {
                job_status: alumni.employmentInfo?.job_status === 'Unemployed' 
                  ? 'Unemployed' 
                  : 'Employed'
              };

              return { ...alumni, tracerStatus: tracerStatusText, gradYear, employmentInfo };
            } catch (error) {
              console.error(`Failed to fetch status for ${alumni.userId}`, error);
              return { ...alumni, tracerStatus: 'Unknown', gradYear: 'N/A', employmentInfo: { job_status: 'Unknown' } };
            }
          }));
    
          setAlumniData(alumniWithStatus);
          console.log('Total Alumni Loaded:', alumniWithStatus.length); // Debug log
        }
      } catch (error) {
        console.error('Error fetching alumni data:', error);
        if (error.response?.status === 401) {
          toast.error("Authentication error. Please log in again.");
          navigate('/login');
        }
      } finally {
        setLoading(false); // End loading regardless of outcome
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
    // Reset to first page when filters change
    setCurrentPage(1);
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
  
      const [studentRes, statusRes, tracer2Res, tracer1ListRes] = await Promise.all([
        axios.get(`http://localhost:5050/api/alumni/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5050/surveys/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5050/surveys/tracer2/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          console.log('No Tracer 2 data available or error fetching:', err);
          return { data: null };
        }),
        axios.get(`http://localhost:5050/surveys/completed/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
  
      const tracer1Meta = tracer1ListRes.data?.surveys?.find(s => s.surveyType === 'Tracer1');
  
      const tracer1FullRes = tracer1Meta
        ? await axios.get(`http://localhost:5050/surveys/view/${tracer1Meta.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        : null;
  
      const tracer1Survey = tracer1FullRes?.data
        ? {
            ...tracer1FullRes.data,
            title: 'Tracer 1',
          }
        : null;
  
      if (studentRes.data?.data) {
        const baseData = studentRes.data.data;
        const studentData = {
          ...baseData,
          tracerStatus: statusRes.data.status,
          surveys: [],
        };
  
        // ✅ Push full Tracer 1 survey (with createdAt + education)
        if (tracer1Survey) {
          studentData.surveys.push(tracer1Survey);
  
          // ✅ Sync yearGraduated into personalInfo.gradyear if missing
          const tracer1GradYear = tracer1Survey.education?.[0]?.yearGraduated;
          if (tracer1GradYear) {
            if (!studentData.personalInfo) studentData.personalInfo = {};
            studentData.personalInfo.gradyear = tracer1GradYear;
            console.log('✅ gradyear injected from Tracer 1:', tracer1GradYear);
          }
        }
  
        // ✅ Add Tracer 2 if exists
        if (tracer2Res?.data) {
          studentData.surveys.push({
            ...tracer2Res.data,
            title: 'Tracer 2',
          });
        }
  
        setStudentDetails(studentData);
        console.log('✅ Combined Student Details with createdAt + gradyear:', studentData);
      } else {
        console.error('Unexpected API response structure:', studentRes.data);
        toast.error("Failed to fetch student details.");      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      if (error.response?.status === 404) {
        toast.error('Alumnus not found.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('An error occurred while fetching student details.');
      }
    } finally {
      setLoading(false); // Hide loader after fetch completes
    }
  };

  // Remove this redundant filtering function
  // const filteredAlumni = alumniData.filter((alumni) => {
  //   // ... remove this entire block
  // });

  // Keep only the useEffect filter
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
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [alumniData, batch, college, course, searchQuery]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Add these debug logs
  console.log('Debug Info:', {
    totalAlumni: alumniData.length,
    filteredCount: filteredData.length,
    currentPage,
    startIndex,
    endIndex,
    displayedItems: currentData.length
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Add this console.log to debug pagination
  console.log('Pagination Debug:', {
    totalItems: filteredData.length,
    currentPage,
    itemsPerPage,
    startIndex,
    endIndex,
    currentDataLength: currentData.length
  });

  const tracer1Survey = studentDetails?.surveys?.find(s => s.title?.toLowerCase().includes('tracer 1'));
  const gradYear =
  tracer1Survey?.education?.[0]?.yearGraduated ||
  studentDetails?.personalInfo?.gradyear ||
  studentDetails?.gradyear || // ✅ add this line
  studentDetails?.yearGraduated ||
  'N/A';


  return (
    <section className={styles.tableSection}>
      {activeTab === 'Alumni List' && (
        <>
          {loading ? (
            // Show loader when loading is true
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          ) : (
            // Show table when loading is false
            <div className={styles.tableWrapper} role="region" aria-label="Alumni table" tabIndex="0">
              <table className={styles.alumniTable}>
                <thead>
                  <tr>
                    <th scope="col">TUP-ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Course</th>
                    <th scope="col">Year Graduated</th>
                    <th scope="col">Tracer Status</th>
                    <th scope="col">Employment Status</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((alumni) => (
                      <tr key={alumni.userId} onClick={() => openStudentDetails(alumni.userId)}>
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
                          <span className={`${styles.employmentStatus} ${
                            alumni.employmentInfo?.job_status === 'Unemployed' 
                              ? styles.unemployedStatus 
                              : styles.employedStatus
                          }`}>
                            {alumni.employmentInfo?.job_status === 'Unemployed' ? 'Unemployed' : 'Employed'}
                          </span>
                        </td>
                        <td>
                          <button
                            className={styles.actionButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              openStudentDetails(alumni.userId);
                            }}
                          >
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
                          : 'No alumni records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Update the pagination condition */}
          {!loading && filteredData.length > 0 && (
            <div className={styles.paginationWrapper}>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Modal Section */}
      {studentDetails && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setStudentDetails(null)}>
              ×
            </button>

            {loading ? (
              // Show loader inside modal when loading student details
              <div className={styles.modalLoaderContainer}>
                <Loader />
              </div>
            ) : studentDetails.personalInfo ? (
              <>
                <div className={`${styles.modalHeader} ${styles.gradientHeader}`}>
                  <div className={styles.headerContent}>
                    <div className={styles.profileAvatar}>
                      <FontAwesomeIcon icon={faUser} />
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
                        {/*<span className={styles.infoBadge}>
                          Class of {gradYear}
                        </span>*/}
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
                    <TracerComparisonTab studentData={studentDetails} tracerStatus={studentDetails.tracerStatus} />
                  )}
                  {modalTab === 'tracer1' && <Tracer1Tab studentData={studentDetails} />}
                  {modalTab === 'tracer2' && <Tracer2Tab studentData={studentDetails} />}
                </div>

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