import { useState } from "react";
import styles from "./TableReports.module.css";
import SurveyDetailsModal from "../Report/SurveyDetailsModal"; // We'll create this next!

export default function ReportsTable({ data, selectedTracerType }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  const showVersionColumn = selectedTracerType === "Tracer 2";

  const openSurveyDetails = (survey) => {
    setSelectedSurvey(survey);
    setIsModalOpen(true);
  };

  const closeSurveyDetails = () => {
    setSelectedSurvey(null);
    setIsModalOpen(false);
  };

  if (data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No data available for the selected filters.</p>
        <p>Try adjusting your filter criteria.</p>
      </div>
    );
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const surveyType = item.tracer1 || item.tracer2 || item.customSurvey || "Unknown";
            const version = item.tracer2 ? (item.version || "-") : "-";
            return (
              <tr key={item.id}>
                <td>{item.batch}</td>
                <td>{surveyType}</td>
                {showVersionColumn && <td>{version}</td>}
                <td>{version}</td>
                <td className={styles.responsesCell}>{item.responses}</td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => openSurveyDetails({
                      ...item,
                      type: item.tracer1 ? "Tracer1" : item.tracer2 ? "Tracer2" : "Custom",
                      title: surveyType,
                    })}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Survey Modal */}
      {isModalOpen && (
        <SurveyDetailsModal
          isOpen={isModalOpen}
          onClose={closeSurveyDetails}
          selectedSurvey={selectedSurvey}
        />
      )}
    </div>
  );
}