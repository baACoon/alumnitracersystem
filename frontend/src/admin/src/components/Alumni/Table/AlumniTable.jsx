// Frontend: AlumniTable.jsx
import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  jwtDecode from 'jwt-decode';

export function AlumniTable() {
  const [alumniData, setAlumniData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [studentDetails, setStudentDetails] = useState(null);
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

        const response = await axios.get('https://alumnitracersystem.onrender.com/api/alumni/all', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        console.log('API Response Data:', response.data); // Debug log
        if (response.data?.data) {
          setAlumniData(response.data.data);
        } else {
          console.error('Unexpected response structure:', response.data);
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

  const handleSelectAll = (e) => {
    setSelectedAlumni(e.target.checked ? new Set(alumniData.map((alumni) => alumni.id)) : new Set());
  };

  const handleSelectAlumni = (id) => {
    const newSelected = new Set(selectedAlumni);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedAlumni(newSelected);
  };

  const openStudentDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching details for student ID:', alumni._id);
  
      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/alumni/update/${alumni._id}`, 
       {
        headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('API response data:', response.data);


      if (response.data?.data) {
            setStudentDetails(response.data.data);
          } else {
            console.error('Unexpected API response structure:', response.data);
            alert('Failed to fetch student details.');
          }
        } catch (error) {
          console.error('Error fetching student details:', error);
          alert('An error occurred while fetching student details.');
        }
    };

  const closeStudentDetails = () => {
    setStudentDetails(null);
  };

  const filteredAlumni = alumniData.filter((alumni) =>
    `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  
  return (

    <section className={styles.tableSection} aria-label="Alumni data">
      <div className={styles.tableControls}>
      <button
          onClick={() => setSelectedAlumni(new Set())}
          className={styles.deleteButton}
          aria-label={`Delete ${selectedAlumni.size} selected alumni`}
          disabled={selectedAlumni.size === 0}
        >
          DELETE
        </button>
        <div className={styles.searchContainer}>
          <label htmlFor="searchInput" className={styles.searchLabel}>
            SEARCH ALUMNI
          </label>
          <input
            type="search"
            id="searchInput"
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search alumni"
          />
        </div>
      </div>
      
      <div className={styles.tableWrapper} role="region" aria-label="Alumni table" tabIndex="0">
        <table className={styles.alumniTable}>
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectedAlumni.size === alumniData.length}
                  onChange={handleSelectAll}
                  aria-label="Select all alumni"
                />
              </th>
              <th scope="col">TUP-ID</th>
              <th scope="col">Name</th>
              <th scope="col">College</th>
              <th scope="col">Course</th>
              <th scope="col">Personal Email</th>
            </tr>
          </thead>
          <tbody>
          {filteredAlumni.map((alumni) => (
              <tr
                key={alumni._id}
                className={selectedAlumni.has(alumni._id) ? styles.selectedRow : ''}
                onClick={() => openStudentDetails(alumni)}
              >
                <td>
                  <input
                    type="checkbox"
                    id={`select-${alumni._id}`}
                    checked={selectedAlumni.has(alumni._id)}
                    onChange={() => handleSelectAlumni(alumni._id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${alumni._id}`}
                  />
                </td>
                <td>{alumni.generatedID}</td>
                <td>{`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}</td>
                <td>{alumni.personalInfo.college || 'N/A'}</td>
                <td>{alumni.personalInfo.course || 'N/A'}</td>
                <td>{alumni.personalInfo.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {studentDetails && (
        <div className={styles.modalOverlay} onClick={closeStudentDetails}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeStudentDetails}>
              ×
            </button>

            {/* Render only if StudentDetails is available */}
            {studentDetails ? (
              <>
                {/* Student Profile Section */}
                <div className={styles.studentProfile}>
                  <img
                    src={studentDetails.profileImage || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <div className={styles.profileInfo}>
                    <div>
                      <strong>College:</strong> {studentDetails.personalInfo.college}
                    </div>
                    <div>
                      <strong>Course:</strong> {studentDetails.personalInfo.course}
                    </div>
                    <div>
                      <strong>Graduation Year:</strong> {studentDetails.personalInfo.graduationYear}
                    </div>
                    <div>
                      <strong>Last Name:</strong> {studentDetails.personalInfo.lastName}
                    </div>
                    <div>
                      <strong>First Name:</strong> {studentDetails.personalInfo.firstName}
                    </div>
                    <div>
                      <strong>Middle Name:</strong> {studentDetails.personalInfomiddleName || 'N/A'}
                    </div>
                    <div>
                      <strong>Suffix:</strong> {studentDetails.personalInfo.suffix || 'N/A'}
                    </div>
                    <div>
                      <strong>Address:</strong> {studentDetails.personalInfo.address}
                    </div>
                    <div>
                      <strong>Birthday:</strong> {studentDetails.personalInfo.birthday}
                    </div>
                    <div>
                      <strong>Email:</strong> {studentDetails.personalInfo.email}
                    </div>
                    <div>
                      <strong>Contact No:</strong> {studentDetails.personalInfo.contactNumber}
                    </div>
                  </div>
                </div>

                <hr className={styles.sectionDivider} />

                {/* Employment History Section */}
                <div className={styles.employmentHistory}>
                  <h3 style={{ color: '#900c3f' }}>Alumni's Employment History</h3>
                  <table className={styles.employmentTable}>
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Years of Employment</th>
                      </tr>
                    </thead>
                    <tbody>
                    {StudentDetails.employmentInfo && StudentDetails.employmentInfo.map((job, index) =>  (
                        <tr key={index}>
                          <td>{job.company}</td>
                          <td>{job.years}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <hr className={styles.sectionDivider} />

                {/* Submitted Surveys Section */}
                <div className={styles.submittedSurveys}>
                  <h3 style={{ color: '#900c3f' }}>Submitted Surveys</h3>
                  <table className={styles.surveysTable}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Date Survey Received</th>
                        <th>Date Survey Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                    {StudentDetails.surveys && StudentDetails.surveys.map((survey, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{survey.title}</td>
                          <td>{survey.dateReceived}</td>
                          <td>{survey.dateSubmitted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button className={styles.exportButton}>Export Summary</button>
                </div>
              </>
            ) : (
              <p>Loading student details...</p>
            )}
          </div>
        </div>
      )}


    </section>

  );
}

export default AlumniTable;

