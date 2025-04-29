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

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const getPageNumbers = () => {
    const pages = [];
    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
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
          <span key={index} className={styles.paginationEllipsis}>...</span>
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
  );
}



export function AlumniTable({ batch, college, course, searchQuery, filterApplied }) {
  const [alumniData, setAlumniData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [studentDetails, setStudentDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('Alumni List');
  const [modalTab, setModalTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
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
        const response = await axios.get('https://alumnitracersystem.onrender.com/api/alumni/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.data?.data) {
          const alumniWithStatus = await Promise.all(response.data.data.map(async (alumni) => {
            try {
              const statusRes = await axios.get(`https://alumnitracersystem.onrender.com/surveys/user-status/${alumni.userId}`, {
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
    setCurrentPage(1); // reset to page 1 when filters/search change
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
        axios.get(`https://alumnitracersystem.onrender.com/api/alumni/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://alumnitracersystem.onrender.com/surveys/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://alumnitracersystem.onrender.com/surveys/tracer2/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(err => {
          console.log('No Tracer 2 data available or error fetching:', err);
          return { data: null };
        }),
        axios.get(`https://alumnitracersystem.onrender.com/surveys/completed/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);
  
      const tracer1Meta = tracer1ListRes.data?.surveys?.find(s => s.surveyType === 'Tracer1');
  
      const tracer1FullRes = tracer1Meta
        ? await axios.get(`https://alumnitracersystem.onrender.com/surveys/view/${tracer1Meta.id}`, {
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
                    checked={selectedAlumni.size > 0 && selectedAlumni.size === currentData.length}
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
              {currentData.length > 0 ? (
                currentData.map((alumni) => (
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

        {/* Move Pagination OUTSIDE the table */}
        {filteredData.length > itemsPerPage && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </div>
        )}
      </>
    )}

    {/* Modal Section - untouched */}
    {studentDetails && (
      <div className={styles.modalOverlay} >
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={() => setStudentDetails(null)}>
            ×
          </button>

          {studentDetails.personalInfo ? (
            <>
              <div className={`${styles.modalHeader} ${styles.gradientHeader}`}>
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
                        Class of {gradYear}
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