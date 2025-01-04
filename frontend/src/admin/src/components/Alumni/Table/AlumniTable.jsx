// Frontend: AlumniTable.jsx
import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

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
      console.log('Fetching details for student ID:', id);

      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/alumni/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      console.log('API response data:', response.data);

      if (response.status === 200 && response.data.data) {
        const detailedData = response.data.data;

        // Map fields to expected frontend structure
        setStudentDetails({
          ...detailedData,
          personalInfo: {
            ...detailedData.personalInfo,
            firstName: detailedData.personalInfo.first_name,
            lastName: detailedData.personalInfo.last_name,
          },
        });
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
    `${alumni.firstName} ${alumni.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
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
            <th>TUP-ID</th>
            <th>Name</th>
            <th>College</th>
            <th>Department</th>
            <th>Course</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlumni.map((alumni) => (
            <tr key={alumni.id} onClick={() => openStudentDetails(alumni.id)}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedAlumni.has(alumni.id)}
                  onChange={() => handleSelectAlumni(alumni.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td>{alumni.generatedID}</td>
              <td>{`${alumni.firstName} ${alumni.lastName}`}</td>
              <td>{alumni.college || 'N/A'}</td>
              <td>{alumni.department || 'N/A'}</td>
              <td>{alumni.course || 'N/A'}</td>
              <td>{alumni.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {studentDetails && (
        <div className={styles.modalOverlay} onClick={closeStudentDetails}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeStudentDetails}>×</button>
            <h2>{`${studentDetails.personalInfo.firstName} ${studentDetails.personalInfo.lastName}`}</h2>
            <p>College: {studentDetails.personalInfo.college || 'N/A'}</p>
            <p>Course: {studentDetails.personalInfo.course || 'N/A'}</p>
            <p>Graduation Year: {studentDetails.personalInfo.gradYear || 'N/A'}</p>
            <p>Email: {studentDetails.personalInfo.email || 'N/A'}</p>
            <h3>Employment History</h3>
            <ul>
              {studentDetails.employmentInfo?.map((job, index) => (
                <li key={index}>{job.occupation} at {job.companyName}</li>
              )) || <li>No employment history available</li>}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default AlumniTable;
