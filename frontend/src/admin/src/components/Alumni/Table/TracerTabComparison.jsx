import React, { useEffect, useState, useRef } from 'react';
import styles from './AlumniTable.module.css';
import Chart from 'chart.js/auto';

export function TracerComparisonTab({ studentData, tracerStatus }) {
  const [comparisonData, setComparisonData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tracers, setTracers] = useState({
    tracer1: { completed: false, data: null, year: null },
    tracer2: { completed: false, data: null, year: null }
  });
  const [chartType, setChartType] = useState('line');
  
  // Chart reference
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Extract survey information from studentData
    if (studentData?.surveys) {
      const tracer1Survey = studentData.surveys.find(s => s.title?.toLowerCase().replace(/\s/g, '') === 'tracer1');
      const tracer2Survey = studentData.surveys.find(s => s.title?.toLowerCase().replace(/\s/g, '') === 'tracer2');
      const tracer1CreatedAt = tracer1Survey?.createdAt || null;
      const tracer2CreatedAt = tracer2Survey?.createdAt || null;
      // Determine completion status and years
      const graduationYear = studentData.personalInfo?.gradyear || 'N/A';
      const tracer2Year = !isNaN(parseInt(graduationYear)) ? 
        (parseInt(graduationYear) + 3).toString() : 'N/A';
      
        setTracers({
          tracer1: {
            completed: !!tracer1Survey,
            data: tracer1Survey?.employmentInfo || {},
            year: graduationYear,
            createdAt: tracer1CreatedAt
          },
          tracer2: {
            completed: !!tracer2Survey,
            data: tracer2Survey?.employmentInfo || {},
            year: tracer2Year,
            createdAt: tracer2CreatedAt
          }
        });            
      console.log("Surveys inside TracerComparisonTab:", studentData?.surveys);

      // Generate comparison data
      generateComparisonData(tracer1Survey, tracer2Survey);
    }
  }, [studentData]);

  // Function to generate comparison data
  const generateComparisonData = (tracer1Survey, tracer2Survey) => {
    const tracer1Data = tracer1Survey?.employmentInfo || {};
    const tracer2Data = tracer2Survey
      ? {
          job_status: tracer2Survey.job_status,
          position: tracer2Survey.jobDetails?.position || tracer2Survey.jobDetails?.occupation,
          type_of_organization: tracer2Survey.jobDetails?.type_of_organization,
          work_alignment: tracer2Survey.jobDetails?.work_alignment,
        }
      : {};
  
    const categoriesToCompare = [
      {
        label: "Employment Status",
        tracer1Field: "job_status",
        tracer2Field: "job_status"
      },
      {
        label: "Course Alignment",
        tracer1Field: "work_alignment",
        tracer2Field: "work_alignment"
      },
      {
        label: "Organization Type",
        tracer1Field: "type_of_organization",
        tracer2Field: "type_of_organization"
      },
      {
        label: "Position",
        tracer1Field: "position",
        tracer2Field: "position"
      }
    ];
  
    const newComparisonData = categoriesToCompare.map(category => ({
      category: category.label,
      tracer1: tracer1Data[category.tracer1Field] || "N/A",
      tracer2: tracer2Survey ? (tracer2Data[category.tracer2Field] || "N/A") : "-"
    }));
  
    setComparisonData(newComparisonData);

    // Generate chart data (for visualization - values could be derived from actual data)
    const chartMetrics = [
      { label: "Employment Rate", tracer1Value: 85, tracer2Value: 92 },
      { label: "Course Alignment", tracer1Value: 80, tracer2Value: 90 },
      { label: "Career Satisfaction", tracer1Value: 75, tracer2Value: 85 },
      { label: "Salary Growth", tracer1Value: 65, tracer2Value: 88 },
      { label: "Industry Relevance", tracer1Value: 82, tracer2Value: 89 }
    ];
    
    setChartData(chartMetrics.map(metric => ({
      category: metric.label,
      tracer1: tracer1Survey ? metric.tracer1Value : 0,
      tracer2: tracer2Survey ? metric.tracer2Value : 0
    })));
  };

  // Initialize and update chart
  useEffect(() => {
    if (chartData.length > 0 && chartRef.current) {
      // Clean up previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Prepare data for Chart.js
      const labels = chartData.map(item => item.category);
      const tracer1Values = chartData.map(item => item.tracer1);
      const tracer2Values = chartData.map(item => item.tracer2);
      
      // Initialize chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels,
          datasets: [
            { 
              label: 'Tracer 1',
              data: tracer1Values, 
              borderColor: '#4a6da7',
              backgroundColor: 'rgba(74, 109, 167, 0.2)',
              fill: chartType === 'line',
              tension: 0.3
            },
            { 
              label: 'Tracer 2',
              data: tracer2Values, 
              borderColor: '#8bc34a',
              backgroundColor: 'rgba(139, 195, 74, 0.2)',
              fill: chartType === 'line',
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => `${value}%`
              }
            }
          },
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartType]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };  
  
  // Function to change chart type
  const changeChartType = (type) => {
    setChartType(type);
  };

  // Helper function to extract company name and position for career progression
  const getCareerInfo = (tracerData) => {
    if (!tracerData || !tracerData.data) return { 
      company: "N/A", 
      position: "N/A",
      year_started: "N/A"
    };
    
    return {
      company: tracerData.data.company_name || "N/A",
      position: tracerData.data.position || tracerData.data.occupation || "N/A",
      year_started: tracerData.data.year_started || "N/A"
    };
  };

  const tracer1Career = getCareerInfo(tracers.tracer1);
  const tracer2Career = getCareerInfo(tracers.tracer2);

  return (
    <div className={styles.tracerComparisonContent}>
      {/* Tracer Status Card */}
      <div className={styles.tracerStatusCard}>
        <h4 className={styles.cardTitle}>Tracer Status</h4>
        <div className={styles.tracerStatusItem}>
          <div className={styles.tracerStatusHeader}>
            <span>Tracer 1</span>
            <span style={{ color: tracerStatus?.tracer1Completed ? 'green' : 'orange' }}>
              {tracerStatus?.tracer1Completed
                ? 'Completed'
                : tracerStatus?.currentlyTaking === 'Tracer1'
                ? 'In Progress'
                : 'Pending'}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFilled} 
              style={{ width: tracers.tracer1.completed ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
        <div className={styles.tracerStatusItem}>
          <div className={styles.tracerStatusHeader}>
            <span>Tracer 2</span>
            <span style={{ color: tracerStatus?.tracer2Completed ? 'green' : 'orange' }}>
              {tracerStatus?.tracer2Completed ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={tracers.tracer2.completed ? styles.progressFilled : styles.progressPending} 
              style={{ width: tracers.tracer2.completed ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tracer Comparison Table */}
      <div className={styles.comparisonTableCard}>
        <h4 className={styles.cardTitle}>Tracer Comparison</h4>
        {!tracers.tracer2.completed && (
          <div className={styles.tracerNotice}>
            <i className="fas fa-clock"></i>
            <span>Tracer 2 data will be available once completed</span>
          </div>
        )}
        <table className={styles.comparisonTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Category</th>
                <th>
                  <div className={styles.tracerHeader}>
                    <span className={styles.tracerBadge}>Tracer 1</span>
                    <span className={styles.tracerYear}>
                      {tracers.tracer1.completed ? formatDate(tracers.tracer1.createdAt) : 'Pending'}
                    </span>
                  </div>
                </th>
                <th>
                  <div className={styles.tracerHeader}>
                    <span className={tracers.tracer2.completed ? styles.tracerBadge : styles.tracerBadgeInactive}>
                      Tracer 2
                    </span>
                    <span className={styles.tracerYear}>
                      {tracers.tracer2.completed ? formatDate(tracers.tracer2.createdAt) : 'Pending'}
                    </span>
                  </div>
                </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, index) => (
              <tr key={index}>
                <td className={styles.categoryColumn}>{item.category}</td>
                <td>
                  <div className={styles.tracerValue}>
                    {tracers.tracer1.completed && <i className="fas fa-check-circle"></i>}
                    <span>{item.tracer1}</span>
                  </div>
                </td>
                <td>
                  {tracers.tracer2.completed ? (
                    <div className={styles.tracerValue}>
                      <i className="fas fa-check-circle"></i>
                      <span>{item.tracer2}</span>
                    </div>
                  ) : (
                    <span className={styles.notAvailable}>Not available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Chart Representation with Chart.js */}
      <div className={styles.chartCard}>
        <h4 className={styles.cardTitle}>Tracer Comparison - Metrics</h4>
        <div className={styles.chartControls}>
          <div className={styles.chartTypeToggle}>
            <button 
              className={`${styles.chartTypeBtn} ${chartType === 'line' ? styles.active : ''}`}
              onClick={() => changeChartType('line')}
            >
              <i className="fas fa-chart-line"></i> Line
            </button>
            <button 
              className={`${styles.chartTypeBtn} ${chartType === 'bar' ? styles.active : ''}`}
              onClick={() => changeChartType('bar')}
            >
              <i className="fas fa-chart-bar"></i> Bar
            </button>
          </div>
        </div>
        
        <div className={styles.chartContainer} style={{ height: '300px', position: 'relative' }}>
          <canvas ref={chartRef}></canvas>
        </div>
        
        {!tracers.tracer2.completed && (
          <div className={styles.chartOverlay}>
            <div className={styles.chartNotice}>
              <i className="fas fa-clock"></i>
              <p>Tracer 2 data will be displayed here once the alumni completes the second tracer survey.</p>
            </div>
          </div>
        )}
        
        
      </div>

      {/* Career Progression (if both tracers are completed) */}
      {tracers.tracer1.completed && (
        <div className={styles.careerProgressionCard}>
          <h4 className={styles.cardTitle}>Career Progression</h4>
          <div className={styles.progressionTimeline}>
            <div className={styles.timelinePoint}>
              <div className={styles.timelineYear}>Tracer 1 </div>
              <div className={styles.timelinePosition}>{tracer1Career.position}</div>
              <div className={styles.timelineCompany}>{tracer1Career.company}</div>
                {tracer1Career.year_started && (
                  <div className={styles.timelineDuration}>
                    Started:{tracer1Career.year_started}
                  </div>
                )}
              </div>
              {tracers.tracer2.completed && (
                  <>
                    <div className={styles.timelineArrow}>→</div>
                    <div className={styles.timelinePoint}>
                      <div className={styles.timelineYear}>Tracer 2</div>
                      <div className={styles.timelinePosition}>
                        {tracers.tracer2.data?.position ||
                        tracers.tracer2.data?.occupation ||
                        tracers.tracer2.data?.jobDetails?.position ||
                        tracers.tracer2.data?.jobDetails?.occupation ||
                        "N/A"}
                      </div>
                      <div className={styles.timelineCompany}>
                        {tracers.tracer2.data?.company_name ||
                        tracers.tracer2.data?.jobDetails?.company_name ||
                        "N/A"}
                      </div>
                      {(
                        tracers.tracer2.data?.year_started ||
                        tracers.tracer2.data?.jobDetails?.year_started
                      ) && (
                        <div className={styles.timelineDuration}>
                          Started: {tracers.tracer2.data?.year_started || tracers.tracer2.data?.jobDetails?.year_started}
                        </div>
                      )}
                    </div>
                  </>
                )}
          </div>
          
          {!tracers.tracer2.completed && (
            <div className={styles.progressionNotice}>
              <p>Complete Tracer 2 to see full career progression</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}