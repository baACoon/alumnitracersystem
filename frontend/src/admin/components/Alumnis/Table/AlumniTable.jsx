import React, { useState } from 'react';
import styles from './AlumniTable.module.css';

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

export function AlumniTable() {
  const [alumniData, setAlumniData] = useState(initialAlumniData);
  const [selectedAlumni, setSelectedAlumni] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentDetails, setSelectedStudentDetails] = useState(null);

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
    setSelectedStudentDetails(student);
  };

  const closeStudentDetails = () => {
    setSelectedStudentDetails(null);
  };

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
            {alumniData.map((alumni) => (
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
                <td>{alumni.id}</td>
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
      {selectedStudentDetails && (
        <div className={styles.modalOverlay} onClick={closeStudentDetails}>
          <div 
            className={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className={styles.closeButton} 
              onClick={closeStudentDetails}
            >
              ×
            </button>
            <h2>Student Details</h2>
            <div className={styles.studentDetailsGrid}>
              <div>
                <strong>TUP-ID:</strong> {selectedStudentDetails.id}
              </div>
              <div>
                <strong>Name:</strong> {`${selectedStudentDetails.firstName} ${selectedStudentDetails.lastName}`}
              </div>
              <div>
                <strong>College:</strong> {selectedStudentDetails.college}
              </div>
              <div>
                <strong>Department:</strong> {selectedStudentDetails.department}
              </div>
              <div>
                <strong>Course:</strong> {selectedStudentDetails.course}
              </div>
              <div>
                <strong>Graduation Year:</strong> {selectedStudentDetails.graduationYear}
              </div>
              <div>
                <strong>Email:</strong> {selectedStudentDetails.email}
              </div>
              <div>
                <strong>Contact Number:</strong> {selectedStudentDetails.contactNumber}
              </div>
              <div>
                <strong>Address:</strong> {selectedStudentDetails.address}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AlumniTable;