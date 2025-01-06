import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import {
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import styles from './AlumniTable.module.css';

// Register the required components
Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmploymentHistory = ({ employmentInfo }) => {
  const timelineChartRef = useRef(null);
  const alignmentChartRef = useRef(null);
  const timelineInstance = useRef(null);
  const alignmentInstance = useRef(null);

  useEffect(() => {
    // Cleanup previous instances
    if (timelineInstance.current) {
      timelineInstance.current.destroy();
    }
    if (alignmentInstance.current) {
      alignmentInstance.current.destroy();
    }

    if (employmentInfo && Object.keys(employmentInfo).length > 0) {
      // Timeline Chart
      const timelineCtx = timelineChartRef.current.getContext('2d');
      
      timelineInstance.current = new Chart(timelineCtx, {
        type: 'bar',
        data: {
          labels: [employmentInfo.company_name || 'N/A'],
          datasets: [{
            label: 'Employment Timeline',
            data: [employmentInfo.year_started || 0],
            backgroundColor: getColorByOrgType(employmentInfo.type_of_organization),
            borderColor: getColorByOrgType(employmentInfo.type_of_organization),
            borderWidth: 1
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: "Employment Timeline",
              color: '#900c3f',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return [
                    `Position: ${employmentInfo.position}`,
                    `Status: ${employmentInfo.job_status}`,
                    `Organization: ${employmentInfo.type_of_organization}`,
                    `Started: ${employmentInfo.year_started}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Year Started'
              },
              ticks: {
                callback: function(value) {
                  return value; // Display the actual year
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Company'
              }
            }
          },
          maintainAspectRatio: false
        }
      });

      // Alignment Chart
      const alignmentCtx = alignmentChartRef.current.getContext('2d');
      
      alignmentInstance.current = new Chart(alignmentCtx, {
        type: 'bar',
        data: {
          labels: [employmentInfo.company_name || 'N/A'],
          datasets: [{
            label: 'Work Alignment',
            data: [getAlignmentScore(employmentInfo.work_alignment)],
            backgroundColor: getColorByAlignment(employmentInfo.work_alignment),
            borderColor: getColorByAlignment(employmentInfo.work_alignment),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            title: {
              display: true,
              text: "Course Alignment",
              color: '#900c3f',
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return [
                    `Alignment: ${employmentInfo.work_alignment}`,
                    `Position: ${employmentInfo.position}`,
                    `Occupation: ${employmentInfo.occupation}`
                  ];
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 100, // Maximum alignment score
              title: {
                display: true,
                text: 'Alignment Score (%)'
              },
              font:{
                size: 16,
                weight:'bold'
              }
            }
          },
          maintainAspectRatio: false
        }
      });
    }

    return () => {
      if (timelineInstance.current) {
        timelineInstance.current.destroy();
      }
      
      if (alignmentInstance.current) {
        alignmentInstance.current.destroy();
      }
    };
  }, [employmentInfo]);

  // Helper functions
  const getColorByOrgType = (type) => {
    const colors = {
      'Private': '#FF6384',
      'Government': '#36A2EB',
      'NGO': '#FFCE56',
      'Self-Employed': '#4BC0C0'
    };
    return colors[type] || '#cccccc';
  };

  const getColorByAlignment = (alignment) => {
    const colors = {
      'Very much aligned': '#00ff00',
      'Aligned': '#90EE90',
      'Averagely Aligned': '#FFCE56',
      'Somehow Aligned': '#FFA07A',
      'Unaligned': '#FF6384'
    };
    return colors[alignment] || '#cccccc';
  };

  const getAlignmentScore = (alignment) => {
    const scores = {
      'Very much aligned': 100,
      'Aligned': 80,
      'Averagely Aligned': 60,
      'Somehow Aligned': 40,
      'Unaligned': 20
    };
    return scores[alignment] || 0;
  };

  return (
    <div className={styles.employmentHistory}>
      {employmentInfo && Object.keys(employmentInfo).length > 0 ? (
        <div>
          <div style={{ height: '250px', width: '100%', marginBottom: '1rem' }}>
            <canvas ref={timelineChartRef}></canvas>
          </div>
          <div style={{ height: '250px', width: '100%' }}>
            <canvas ref={alignmentChartRef}></canvas>
          </div>
          <div className={styles.legendContainer}>
            <h4>Organization Types</h4>
            <div className={styles.legendItems}>
              <span className={styles.legendItem}>
                <span className={styles.colorBox} style={{backgroundColor: '#FF6384'}}></span>
                Private
              </span>
              <span className={styles.legendItem}>
                <span className={styles.colorBox} style={{backgroundColor: '#36A2EB'}}></span>
                Government
              </span>
              <span className={styles.legendItem}>
                <span className={styles.colorBox} style={{backgroundColor: '#FFCE56'}}></span>
                NGO
              </span>
              <span className={styles.legendItem}>
                <span className={styles.colorBox} style={{backgroundColor: '#4BC0C0'}}></span>
                Self-Employed
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p>No employment history available.</p>
      )}
    </div>
  );
};

export default EmploymentHistory;