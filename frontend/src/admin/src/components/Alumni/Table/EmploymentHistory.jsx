import { useEffect } from 'react';
import { Chart } from 'chart.js';
import styles from './AlumniTable.module.css'; // Adjust the path if needed

const EmploymentHistory = ({ employmentInfo }) => {
  useEffect(() => {
    if (employmentInfo && employmentInfo.length > 0) {
      const labels = employmentInfo.map(job => job.year_started); // X-axis: Years started
      const companyNames = employmentInfo.map(job => job.company_name.substring(0, 5)); // Shortened company names
      const tooltips = employmentInfo.map(job => job.company_name); // Full names for tooltips

      if (window.employmentChart) {
        window.employmentChart.destroy();
      }

      const ctx = document.getElementById('employmentHistoryChart').getContext('2d');
      window.employmentChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Employment History',
            data: companyNames.map((_, index) => index + 1),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
          }]
        },
        options: {
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const index = tooltipItem.dataIndex;
                  return tooltips[index];
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Year Started',
              }
            },
            y: {
              ticks: {
                callback: function (value, index) {
                  return companyNames[index];
                }
              },
              title: {
                display: true,
                text: 'Company Name',
              }
            }
          }
        }
      });
    }
  }, [employmentInfo]);

  return (
    <div className={styles.employmentHistory}>
      <h3 style={{ color: '#900c3f' }}>Alumni's Employment History</h3>
      <canvas id="employmentHistoryChart" width="800" height="400"></canvas>
    </div>
  );
};

export default EmploymentHistory;
