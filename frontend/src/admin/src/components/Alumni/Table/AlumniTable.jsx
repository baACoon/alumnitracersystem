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

  const handleSelectAll = (e) => {
    setSelectedAlumni(e.target.checked ? new Set(alumniData.map((alumni) => alumni.id)) : new Set());
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

    const response = await axios.get(`https://alumnitracersystem.onrender.com/api/alumni/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('API response data:', response.data);

    if (response.data?.data) {
      setStudentDetails(response.data.data);
      console.log('Student Details:', studentDetails)
    } else {
      console.error('Unexpected API response structure:', response.data);
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
  const filteredAlumni = alumniData.filter((alumni) =>
    `${alumni.personalInfo.firstName} ${alumni.personalInfo.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log('Filtered Alumni:', filteredAlumni);

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
            <th>TUP-ID</th>
            <th>Name</th>
            <th>College</th>
            <th>Course</th>
            <th>Email</th>
            <th>Birthday</th>
          </tr>
        </thead>
        <tbody>
        
          {filteredAlumni.map((alumni) => (
            
              <tr
                key={alumni.userId || alumni.id}
                onClick={() => {
                  if (alumni.userId) {
                    console.log('Clicked userId:', alumni.userId)
                    openStudentDetails(alumni.userId);
                  } else {
                    console.error('No userId for alumnus:', alumni);
                    alert('Error: Missing userId for selected alumnus.');
                  }
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAlumni.has(alumni.userId)}
                    onChange={() => handleSelectAlumni(alumni.userId)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>{alumni.generatedID || 'N/A'}</td>
                <td>{`${alumni.personalInfo?.firstName || 'N/A'} ${alumni.personalInfo?.lastName || 'N/A'}`}</td>
                <td>{alumni.personalInfo?.college || 'N/A'}</td>
                <td>{alumni.personalInfo?.course || 'N/A'}</td>
                <td>{alumni.personalInfo?.email || 'N/A'}</td>
                <td>{alumni.personalInfo?.birthday || 'N/A'}</td>
              </tr>

              
            ))}
           </tbody>
      </table>

      {studentDetails && (
        <div
          className={styles.modalOverlay}
          onClick={() => setStudentDetails(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setStudentDetails(null)}
            >
              ×
            </button>
            {studentDetails.personalInfo ? (
              <>
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
