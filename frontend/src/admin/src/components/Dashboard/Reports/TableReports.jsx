import styles from "./TableReports.module.css";

export default function ReportsTable({ data, selectedTracerType }) {
    const showVersionColumn = selectedTracerType === "Tracer 2";

  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available for the selected filters.</p>
        <p>Try adjusting your filter criteria.</p>
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Batch</th>
            <th>Survey Type</th>
            <th>Version</th>
            <th>Responses</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className={styles.noData}>No survey data available.</td>
            </tr>
          ) : (
            data.map((item) => {
              const surveyType = item.tracer1 || item.tracer2 || item.customSurvey || "Unknown";
              const version = item.tracer2 ? (item.version || "-") : "-";
              return (
                <tr key={item.id}>
                  <td>{item.batch}</td>
                  <td>{surveyType}</td>
                  <td>{version}</td>
                  <td className={styles.responsesCell}>{item.responses}</td>
                  <td>{item.date}</td>
                  <td>
                    <button className={styles.viewButton}>View Details</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
