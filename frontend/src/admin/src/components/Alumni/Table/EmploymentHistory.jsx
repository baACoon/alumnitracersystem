
//import { Chart } from 'chart.js';
import styles from './AlumniTable.module.css'; // Adjust the path if needed

const EmploymentHistory = ({ employmentInfo }) => {
  console.log('Received employment info:', employmentInfo);
  
  return (
    <div className={styles.employmentHistory}>
      <h3 style={{ color: '#900c3f' }}>Alumni's Employment History</h3>
      {employmentInfo && Object.keys(employmentInfo).length > 0 ? (
        <table className={styles.employmentTable}>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Position</th>
              <th>Year Started</th>
              <th>Job Status</th>
              <th>Work Alignment</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{employmentInfo.company_name || 'N/A'}</td>
              <td>{employmentInfo.position || 'N/A'}</td>
              <td>{employmentInfo.year_started || 'N/A'}</td>
              <td>{employmentInfo.job_status || 'N/A'}</td>
              <td>{employmentInfo.work_alignment || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No employment history available.</p>
      )}
    </div>
  );
};
export default EmploymentHistory;