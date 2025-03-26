import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./PendingSurvey.module.css";
import { EditSurvey } from "./EditSurvey"; // Import EditSurvey component
import { ViewSurvey } from "./ViewSurvey"; // Import ViewSurvey component

export const PendingSurvey = () => {
  const [pendingSurveys, setPendingSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null); // State to store the selected survey for editing

  useEffect(() => {
    fetchPendingSurveys();
  }, []);

  const fetchPendingSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/surveys");  // Fetch all surveys
      const pendingSurveys = response.data.filter(survey => survey.status === "draft");
      setPendingSurveys(pendingSurveys);
    } catch (error) {
      console.error("Error fetching pending surveys:", error);
    }
  };

  const handlePublish = async (surveyId) => {
    try {
      const response = await axios.put(`http://localhost:5050/api/surveys/${surveyId}/publish`);
      alert("Survey published successfully!");
      console.log(response.data);
      fetchPendingSurveys(); // Re-fetch surveys to show the updated list
    } catch (error) {
      console.error("Error publishing survey:", error);
      alert("Failed to publish survey.");
    }
  };

  const handleDelete = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    try {
      await axios.delete(`http://localhost:5050/api/surveys/${surveyId}`);
      setPendingSurveys(pendingSurveys.filter((survey) => survey._id !== surveyId)); // Remove from the list
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert("Failed to delete survey.");
    }
  };

  const handleEdit = (survey) => {
    setSelectedSurvey(survey); // Store the selected survey to be edited
  };

  const handleView = (survey) => {
    setSelectedSurvey(survey); // Store the selected survey to be viewed
  };

  return (
    <div className={styles.table}>
      {/* Conditional rendering for EditSurvey component */}
      {selectedSurvey ? (
        <EditSurvey surveyId={selectedSurvey._id} onBack={() => setSelectedSurvey(null)} /> // Pass selectedSurvey to EditSurvey
      ) : (
        <div>
          <table className={styles.table}>
            <thead>
              <tr className={styles.header}>
                <th>No.</th>
                <th>Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingSurveys.map((survey, index) => (
                <tr className={styles.row} key={survey._id}>
                  <td className={styles.cell}>{index + 1}</td>
                  <td className={`${styles.cell} ${styles.clickable}`}>{survey.title}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.publishButton}
                      onClick={() => handlePublish(survey._id)}
                    >
                      PUBLISH
                    </button>
                    <button
                      className={styles.editButton} // Style for Edit button
                      onClick={() => handleEdit(survey)} // Set selectedSurvey when Edit button is clicked
                    >
                      EDIT
                    </button>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(survey)}
                    >
                      VIEW
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(survey._id)}
                    >
                      DELETE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
