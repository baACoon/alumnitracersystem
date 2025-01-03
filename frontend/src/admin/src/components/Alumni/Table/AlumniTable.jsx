import React, { useEffect, useState } from 'react';
import styles from './AlumniTable.module.css';
import axios from 'axios';

const initialAlumniData = [
  {
    id: 'TUPM-21-2231',
    college: 'COE',
    department: 'CE',
    course: 'BSCE',
    email: 'choiseungcholpogi@gmail.com',
    firstName: 'Choi',
    lastName: 'Seungcheol',
    graduationYear: '2021',
    address: '123 Seoul Street, South Korea',
    contactNumber: '+82 10 1234 5678'
  },
  {
    id: 'TUPM-21-2232',
    college: 'COE',
    department: 'CE',
    course: 'BSCE',
    email: 'example@gmail.com',
    firstName: 'Jane',
    lastName: 'Doe',
    graduationYear: '2021',
    address: '456 Example Avenue, City',
    contactNumber: '+1 123 456 7890'
  }
];

const selectedStudentDetails = {
  profileImage: 'https://via.placeholder.com/150',
  college: 'College of Engineering',
  course: 'Bachelor of Science in Civil Engineering',
  graduationYear: '2015',
  lastName: 'Choi',
  firstName: 'Seung-cheol',
  middleName: null,
  suffix: null,
  address: 'Daegu, South Korea',
  birthday: 'August 8, 1995',
  email: 'seungcheolpogi@gmail.com',
  contactNumber: '09123456789',
  employmentHistory: [
    { company: 'Elephant', years: 2 },
    { company: 'Horse', years: 1 },
    { company: 'Tiger', years: 4 },
    { company: 'Lion', years: 3 },
    { company: 'Jaguar', years: 5 },
  ],
  surveys: [
    { title: 'Tracer Survey Form (2020)', dateReceived: 'July 29, 2020', dateSubmitted: 'July 31, 2020' },
    { title: 'Material: Subject Alignment', dateReceived: 'July 29, 2020', dateSubmitted: 'July 31, 2020' },
    { title: 'Masters or Comfortability?', dateReceived: 'July 29, 2018', dateSubmitted: 'July 31, 2018' },
  ],
};

export function AlumniTable() {
  const [alumniData, setAlumniData] = useState(initialAlumniData);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState(''); 
  const [StudentDetails, setSelectedStudentDetails] = useState(null); // Add this line

  useEffect(() => {
    // Get the token from localStorage
      const token = localStorage.getItem('token'); // or wherever you store your JWT token
      
      // Configure axios headers
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

    // Fetch alumni data from the backend API
    axios.get('https://alumnitracersystem.onrender.com/api/alumni') // Replace with your API endpoint
      .then(response => {
      console.log(response.data); // Debugging
      setAlumniData(response.data.data); // Use the correct data field
    })
      .catch(error => console.error('Error fetching alumni data:', error));
  }, []);

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

  const handleDelete = () => {
    const newData = alumniData.filter(alumni => !selectedAlumni.has(alumni.id));
    setAlumniData(newData);
    setSelectedAlumni(new Set());
  };

  const openStudentDetails = (student) => {
    const token = localStorage.getItem('token');
    
    // First set basic student info
    setSelectedStudentDetails(student);
    
    // Then fetch detailed info including surveys
    axios.get(`https://alumnitracersystem.onrender.com/api/alumni/${student.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const detailedData = response.data.data;
        setSelectedStudentDetails(prevDetails => ({
          ...prevDetails,
          ...detailedData,
          surveys: detailedData.surveys || []
        }));
      })
      .catch(error => {
        console.error('Error fetching student details:', error);
      });
  };

  const closeStudentDetails = () => {
    setSelectedStudentDetails(null);
  };

  const filteredAlumni = alumniData.filter(alumni =>
    `${alumni.firstName} ${alumni.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

 

  return (

    <section className={styles.tableSection} aria-label="Alumni data">
      <div className={styles.tableControls}>
        <button 
          onClick={handleDelete}
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
                key={alumni.id}
                className={selectedAlumni.has(alumni.id) ? styles.selectedRow : ''}
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
                <td>{`${alumni.firstName} ${alumni.lastName}`}</td>
                <td>{alumni.college}</td>
                <td>{alumni.department}</td>
                <td>{alumni.course}</td>
                <td>{alumni.email}</td>
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
                      <strong>College:</strong> {StudentDetails.college}
                    </div>
                    <div>
                      <strong>Course:</strong> {StudentDetails.course}
                    </div>
                    <div>
                      <strong>Graduation Year:</strong> {StudentDetails.graduationYear}
                    </div>
                    <div>
                      <strong>Last Name:</strong> {StudentDetails.lastName}
                    </div>
                    <div>
                      <strong>First Name:</strong> {StudentDetails.firstName}
                    </div>
                    <div>
                      <strong>Middle Name:</strong> {StudentDetails.middleName || 'N/A'}
                    </div>
                    <div>
                      <strong>Suffix:</strong> {StudentDetails.suffix || 'N/A'}
                    </div>
                    <div>
                      <strong>Address:</strong> {StudentDetails.address}
                    </div>
                    <div>
                      <strong>Birthday:</strong> {StudentDetails.birthday}
                    </div>
                    <div>
                      <strong>Email:</strong> {StudentDetails.email}
                    </div>
                    <div>
                      <strong>Contact No:</strong> {StudentDetails.contactNumber}
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
                      {StudentDetails.employmentHistory?.map((job, index) => (
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
                      {StudentDetails.surveys?.map((survey, index) => (
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