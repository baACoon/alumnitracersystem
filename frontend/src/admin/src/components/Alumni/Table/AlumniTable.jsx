import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export function AlumniTable() {
  const [alumniData, setAlumniData] = useState([]);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState(''); 
  const [StudentDetails, setSelectedStudentDetails] = useState(null); // Add this line
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
  
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          if (!decoded.id) throw new Error('Invalid token');
        } catch (err) {
          alert("Invalid session. Please log in again.");
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
  
        const response = await fetch('https://alumnitracersystem.onrender.com/api/alumni/all', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)// Assuming `data` contains the list of alumni

          }

        const data = await response.json(); // Parse JSON response

          if (data && data.data) {
            setAlumniData(data.data); // Assuming the list of alumni is in `data.data`
          } else {
            console.error('Unexpected response structure:', data);
            setAlumniData([]); // Fallback to empty data
          }
  
        //const data = await response.json();
        //console.log('Fetched data:', data);
        //setAlumniData(data.data);
  
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
    if (e.target.checked) {
      setSelectedAlumni(new Set(alumniData.map(alumni => alumni.id)));
    } else {
      setSelectedAlumni(new Set());
    }
  };

  const handleSelectAlumni = (id) => {
    const newSelected = new Set(selectedAlumni);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAlumni(newSelected);
  };

  {/* Student Details Modal const handleDelete = () => {
    //const newData = alumniData.filter(alumni => !selectedAlumni.has(alumni.id));
    setAlumniData(newData);
    setSelectedAlumni(new Set());
  };*/}

  const openStudentDetails = async (student) => {
    const token = localStorage.getItem('token');
    
    // First set basic student info
    //setSelectedStudentDetails(student);
    try {
      // Fetch detailed info including surveys
      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/alumni/${student.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 200 && response.data.data) {
        console.log('Received student details:', response.data.data); // Debug log
        setSelectedStudentDetails(response.data.data);
      } else {
        console.error('Invalid response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  const closeStudentDetails = () => {
    setSelectedStudentDetails(null);
  };

  const filteredAlumni = alumniData.filter(alumni =>
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
              <th scope="col">Department</th>
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
                    id={`select-${alumni.id}`}
                    checked={selectedAlumni.has(alumni.id)}
                    onChange={() => handleSelectAlumni(alumni.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${alumni.id}`}
                  />
                </td>
                <td>{alumni.generatedID}</td>
                <td>{`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}</td>
                <td>{alumni.personalInfo.college || 'N/A'}</td>
                <td>{alumni.personalInfo.department || 'N/A'}</td>
                <td>{alumni.personalInfo.course || 'N/A'}</td>
                <td>{alumni.personalInfo.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Details Modal */}
      {StudentDetails && (
        <div className={styles.modalOverlay} onClick={closeStudentDetails}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeStudentDetails}>
              ×
            </button>

            {/* Render only if StudentDetails is available */}
            {StudentDetails ? (
              <>
                {/* Student Profile Section */}
                <div className={styles.studentProfile}>
                  <img
                    src={StudentDetails.profileImage || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                  <div className={styles.profileInfo}>
                    <div>
                      <strong>College:</strong> {StudentDetails.personalInfo.college}
                    </div>
                    <div>
                      <strong>Course:</strong> {StudentDetails.personalInfo.course}
                    </div>
                    <div>
                      <strong>Graduation Year:</strong> {StudentDetails.personalInfo.graduationYear}
                    </div>
                    <div>
                      <strong>Last Name:</strong> {StudentDetails.personalInfo.lastName}
                    </div>
                    <div>
                      <strong>First Name:</strong> {StudentDetails.personalInfo.firstName}
                    </div>
                    <div>
                      <strong>Middle Name:</strong> {StudentDetails.personalInfomiddleName || 'N/A'}
                    </div>
                    <div>
                      <strong>Suffix:</strong> {StudentDetails.personalInfo.suffix || 'N/A'}
                    </div>
                    <div>
                      <strong>Address:</strong> {StudentDetails.personalInfo.address}
                    </div>
                    <div>
                      <strong>Birthday:</strong> {StudentDetails.personalInfo.birthday}
                    </div>
                    <div>
                      <strong>Email:</strong> {StudentDetails.personalInfo.email}
                    </div>
                    <div>
                      <strong>Contact No:</strong> {StudentDetails.personalInfo.contactNumber}
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