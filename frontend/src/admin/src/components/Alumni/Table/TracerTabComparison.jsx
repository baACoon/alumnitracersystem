import React from 'react';
import styles from './AlumniTable.module.css';

export function TracerComparisonTab({ studentData }) {
  // Determine if student has completed both tracers
  const hasCompletedBothTracers = studentData.tracerStatus?.includes('2');

  // Generate comparison data based on student data
  const employmentStatusData = [
    {
      category: "Employment Status",
      tracer1: studentData.employmentInfo?.employmentStatus || "Not Available",
      tracer2: hasCompletedBothTracers ? "Employed" : "-",
    },
    {
      category: "Course Alignment",
      tracer1: studentData.employmentInfo?.courseAlignment || "N/A",
      tracer2: hasCompletedBothTracers ? "92%" : "-",
    },
    {
      category: "Organization Type",
      tracer1: studentData.employmentInfo?.organizationType || "N/A",
      tracer2: hasCompletedBothTracers ? "Government" : "-",
    },
    {
      category: "Salary Range",
      tracer1: studentData.employmentInfo?.salaryRange || "₱25,000 - ₱30,000",
      tracer2: hasCompletedBothTracers ? "₱35,000 - ₱40,000" : "-",
    },
  ];

  // Chart data would need a visualization library, but we can prepare the data
  const chartComparisonData = [
    { category: "Employment Rate", tracer1: 85, tracer2: hasCompletedBothTracers ? 92 : 0 },
    { category: "Course Alignment", tracer1: 80, tracer2: hasCompletedBothTracers ? 92 : 0 },
    { category: "Salary Satisfaction", tracer1: 65, tracer2: hasCompletedBothTracers ? 75 : 0 },
    { category: "Career Growth", tracer1: 70, tracer2: hasCompletedBothTracers ? 85 : 0 },
  ];

  // Calculate graduation year + 3 for Tracer 2
  const gradYear = studentData.personalInfo?.gradyear || "N/A";
  const tracer2Year = isNaN(parseInt(gradYear)) ? "N/A" : (parseInt(gradYear) + 3).toString();

  return (
    <div className={styles.tracerComparisonContent}>
      {/* Tracer Status Card */}
      <div className={styles.tracerStatusCard}>
        <h4 className={styles.cardTitle}>Tracer Status</h4>
        <div className={styles.tracerStatusItem}>
          <div className={styles.tracerStatusHeader}>
            <span>Tracer 1</span>
            <span className={styles.statusBadgeComplete}>Completed</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFilled} style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className={styles.tracerStatusItem}>
          <div className={styles.tracerStatusHeader}>
            <span>Tracer 2</span>
            <span className={hasCompletedBothTracers ? styles.statusBadgeComplete : styles.statusBadgePending}>
              {hasCompletedBothTracers ? 'Completed' : 'Pending'}
            </span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={hasCompletedBothTracers ? styles.progressFilled : styles.progressPending} 
              style={{ width: hasCompletedBothTracers ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tracer Comparison Table */}
      <div className={styles.comparisonTableCard}>
        <h4 className={styles.cardTitle}>Tracer Comparison</h4>
        {!hasCompletedBothTracers && (
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
                  <span className={styles.tracerYear}>{gradYear}</span>
                </div>
              </th>
              <th>
                <div className={styles.tracerHeader}>
                  <span className={hasCompletedBothTracers ? styles.tracerBadge : styles.tracerBadgeInactive}>
                    Tracer 2
                  </span>
                  <span className={styles.tracerYear}>
                    {hasCompletedBothTracers ? tracer2Year : "Pending"}
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {employmentStatusData.map((item, index) => (
              <tr key={index}>
                <td className={styles.categoryColumn}>{item.category}</td>
                <td>
                  <div className={styles.tracerValue}>
                    <i className="fas fa-check-circle"></i>
                    <span>{item.tracer1}</span>
                  </div>
                </td>
                <td>
                  {hasCompletedBothTracers ? (
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

      {/* Chart Representation - This would need to be integrated with a chart library */}
      <div className={styles.chartCard}>
        <h4 className={styles.cardTitle}>Tracer Comparison - Metrics</h4>
        <div className={styles.chartPlaceholder}>
          {/* Placeholder for chart - you would integrate a chart library here */}
          <div className={styles.barChartVisual}>
            {chartComparisonData.map((item, index) => (
              <div key={index} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.category}</div>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.barTracer1} 
                    style={{ width: `${item.tracer1}%` }}
                  ></div>
                  {hasCompletedBothTracers && (
                    <div 
                      className={styles.barTracer2} 
                      style={{ width: `${item.tracer2}%` }}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {!hasCompletedBothTracers && (
          <div className={styles.chartNotice}>
            <i className="fas fa-clock"></i>
            <p>Tracer 2 data will be displayed here once the alumni completes the second tracer survey.</p>
          </div>
        )}
      </div>

      {/* Career Progression (if both tracers are completed) */}
      {hasCompletedBothTracers && (
        <div className={styles.careerProgressionCard}>
          <h4 className={styles.cardTitle}>Career Progression</h4>
          <div className={styles.progressionTimeline}>
            <div className={styles.timelinePoint}>
              <div className={styles.timelineYear}>Tracer 1 ({gradYear})</div>
              <div className={styles.timelinePosition}>Junior Developer</div>
              <div className={styles.timelineSalary}>₱25,000 - ₱30,000</div>
            </div>
            <div className={styles.timelineArrow}>→</div>
            <div className={styles.timelinePoint}>
              <div className={styles.timelineYear}>Tracer 2 ({tracer2Year})</div>
              <div className={styles.timelinePosition}>Senior Developer</div>
              <div className={styles.timelineSalary}>₱35,000 - ₱40,000</div>
            </div>
            <div className={styles.timelineArrow}>→</div>
            <div className={styles.timelinePoint}>
              <div className={styles.timelineYear}>Current ({new Date().getFullYear()})</div>
              <div className={styles.timelinePosition}>Team Lead</div>
              <div className={styles.timelineSalary}>₱45,000 - ₱50,000</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}