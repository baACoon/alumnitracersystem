import React from 'react';
import styles from './AlumniTable.module.css';

const alumniData = [
  {
    id: 1,
    tupId: 'TUPM-21-2231',
    college: 'COE',
    department: 'CE',
    course: 'BSCE',
    email: 'choiseungcholpogi@gmail.com',
    password: 'hannie<3scoups17'
  },
  // Repeat data for other rows
];

export function AlumniTable() {
  return (
    <section className={styles.tableSection}>
      <div className={styles.tableControls}>
        <button className={styles.deleteButton}>DELETE</button>
        <form className={styles.searchForm}>
          <label htmlFor="searchInput" className={styles.searchLabel}>SEARCH ALUMNI</label>
          <input type="search" id="searchInput" className={styles.searchInput} placeholder="SEARCH" />
        </form>
      </div>
      
      <table className={styles.alumniTable}>
        <thead>
          <tr className={styles.tableHeader}>
            <th scope="col">TUP-ID</th>
            <th scope="col">College</th>
            <th scope="col">Department</th>
            <th scope="col">Course</th>
            <th scope="col">Personal Email</th>
            <th scope="col">Password</th>
          </tr>
        </thead>
        <tbody>
          {alumniData.map((alumni) => (
            <tr key={alumni.id} className={styles.tableRow}>
              <td>
                <input type="checkbox" id={`alumni-${alumni.id}`} className={styles.checkbox} />
                <label htmlFor={`alumni-${alumni.id}`}>{alumni.tupId}</label>
              </td>
              <td>{alumni.college}</td>
              <td>{alumni.department}</td>
              <td>{alumni.course}</td>
              <td>{alumni.email}</td>
              <td>{alumni.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}