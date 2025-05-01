import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SurveyTable.module.css";
import { TracerSurvey2 } from "../TracerSurvey2/TracerSurvey2"; // Import TracerSurvey2 Component
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SurveyTable = ({ onView }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTracerSurvey, setViewTracerSurvey] = useState(false); // State to toggle TracerSurvey2 view

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:5050/api/newSurveys");
      // Only fetch surveys with status "active"
      const activeSurveys = response.data.filter(survey => survey.status === "active");
      setSurveys(activeSurveys);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    try {
      await axios.delete(`http://localhost:5050/api/newSurveys/${surveyId}`);
      setSurveys(surveys.filter((survey) => survey._id !== surveyId)); // Remove from the list
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast.error("Failed to delete survey.");
    }
  };

  return (
    <div className={styles.tableWrapper}>
      {loading ? (
        <p className={styles.loading}>Loading surveys...</p>
      ) : (
        <div>
          {viewTracerSurvey ? (
            <TracerSurvey2 onBack={() => setViewTracerSurvey(false)} /> // Render TracerSurvey2 when clicked
          ) : (
            <div>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.header}>
                    <th>NO.</th>
                    <th>TITLE</th>
                    <th>DATE CREATED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>

                  {/* Map through the active surveys and render them */}
                  {surveys.map((survey, index) => (
                    <tr key={survey._id} className={styles.row}>
                      <td className={styles.cell}>{index + 1}</td>
                      <td
                        className={`${styles.cell} ${styles.clickable}`}
                        onClick={() => onView(survey._id)}
                      >
                        {survey.title}
                      </td>
                      <td className={styles.cell}>
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          className={styles.viewButton}
                          onClick={() => onView(survey._id)}
                        >
                          View
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(survey._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
