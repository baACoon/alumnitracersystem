
//import { Chart } from 'chart.js';
import styles from './AlumniTable.module.css'; // Adjust the path if needed

const EmploymentHistory = ({ employmentInfo }) => {
  return (
    <div className={styles.employmentHistory}>
      <h3 style={{ color: '#900c3f' }}>Alumni's Employment History</h3>
      {employmentInfo.length > 0 ? (
        <table className={styles.employmentTable}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Year Started</th>
            </tr>
          </thead>
          <tbody>
            {employmentInfo.map((job, index) => (
              <tr key={index}>
                <td>{job.company_name || 'N/A'}</td>
                <td>{job.year_started || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employment history available.</p>
      )}
    </div>
  );
};

export default EmploymentHistory;