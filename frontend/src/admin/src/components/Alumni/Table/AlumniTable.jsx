// Frontend: AlumniTable.jsx
import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import  {jwtDecode} from 'jwt-decode';

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
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate('/login');
        return;
      }
  
      console.log('Fetching details for student ID:', id);
  
      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/alumni/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
  
      console.log('Response data:', response.data); // Add this debug log
  
      if (response.data?.data) {
        const student = response.data.data;
        // Transform the data to match the expected structure
        const formattedDetails = {
          id: student._id,
          generatedID: student.generatedID,
          personalInfo: {
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            email: student.email || '',
            college: student.gradyear ? `Batch ${student.gradyear}` : 'N/A', // Using gradyear as college
            course: student.course || 'N/A',
            birthday: student.birthday ? new Date(student.birthday).toLocaleDateString() : 'N/A',
            contactNumber: student.contactNumber || 'N/A',
            address: student.address || 'N/A'
          },
          surveys: student.surveys || []
        };
        setStudentDetails(formattedDetails);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.response?.status === 404) {
        alert('Student not found.');
      } else {
        alert('An error occurred while fetching student details. Please try again.');
      }
    }
  };


  const filteredAlumni = alumniData.filter((alumni) =>
    `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className={styles.tableSection}>
      <div className={styles.tableControls}>
        <button
          onClick={() => setSelectedAlumni(new Set())}
          className={styles.deleteButton}
          disabled={selectedAlumni.size === 0}
        >
          DELETE
        </button>
        <div className={styles.searchContainer}>
          <label htmlFor="searchInput">SEARCH ALUMNI</label>
          <input
            type="search"
            id="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <table className={styles.alumniTable}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedAlumni.size === alumniData.length}
              />
            </th>
            <th>USER-ID</th>
            <th>Name</th>
            <th>College</th>
            <th>Course</th>
            <th>Email</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
        {filteredAlumni.map((alumni) => (
            <tr key={alumni.id} onClick={() => openStudentDetails(alumni.id)}>
              <td onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedAlumni.has(alumni.id)}
                  onChange={() => handleSelectAlumni(alumni.id)}
                />
              </td>
              <td>{alumni.generatedID}</td>
              <td>{`${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`}</td>
              <td>{alumni.personalInfo.college || 'N/A'}</td>
              <td>{alumni.personalInfo.course || 'N/A'}</td>
              <td>{alumni.personalInfo.email}</td>
              <td>{alumni.personalInfo.birthday || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {studentDetails && (
        <div className={styles.modalOverlay} onClick={() => setStudentDetails(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setStudentDetails(null)}>×</button>
            <h2>{`${studentDetails.personalInfo.firstName} ${studentDetails.personalInfo.lastName}`}</h2>
            <div className="student-info">
              <h3>Personal Information</h3>
              <p>College: {studentDetails.personalInfo.college || 'N/A'}</p>
              <p>Course: {studentDetails.personalInfo.course || 'N/A'}</p>
              <p>Email: {studentDetails.personalInfo.email || 'N/A'}</p>
              <p>Birthday: {studentDetails.personalInfo.birthday || 'N/A'}</p>
              <p>Contact: {studentDetails.personalInfo.contactNumber || 'N/A'}</p>
              <p>Address: {studentDetails.personalInfo.address || 'N/A'}</p>
            </div>
            {studentDetails.surveys && studentDetails.surveys.length > 0 && (
              <div className="employment-info">
                <h3>Employment Information</h3>
                {studentDetails.surveys.map((survey, index) => (
                  <div key={index} className="employment-entry">
                    <p>Company: {survey.employmentInfo?.company_name || 'N/A'}</p>
                    <p>Position: {survey.employmentInfo?.position || 'N/A'}</p>
                    <p>Status: {survey.employmentInfo?.job_status || 'N/A'}</p>
                    <p>Year Started: {survey.employmentInfo?.year_started || 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AlumniTable;
