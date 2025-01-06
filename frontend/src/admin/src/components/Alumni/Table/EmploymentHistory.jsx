import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import {
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
} from 'chart.js';
import styles from './AlumniTable.module.css';

// Register the required components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

const EmploymentHistory = ({ employmentInfo }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Only create chart if we have employment info
    if (employmentInfo && Object.keys(employmentInfo).length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [employmentInfo.company_name || 'N/A'],
          datasets: [{
            label: 'Year Started',
            data: [employmentInfo.year_started || 0],
            backgroundColor: '#ff385c',
            borderColor: '#ff385c',
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',  // This makes the bars horizontal
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: "Alumni's Employment History",
              color: '#900c3f',
              font: {
                size: 16,
                weight: 'bold'
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                drawBorder: false
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          },
          maintainAspectRatio: false
        }
      });
    }

    // Cleanup function to destroy chart when component unmounts
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [employmentInfo]);

  return (
    <div className={styles.employmentHistory}>
      <div style={{ height: '300px', width: '100%' }}>
        {employmentInfo && Object.keys(employmentInfo).length > 0 ? (
          <canvas ref={chartRef}></canvas>
        ) : (
          <p>No employment history available.</p>
        )}
      </div>
    </div>
  );
};

export default EmploymentHistory;