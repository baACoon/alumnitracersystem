import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SurveyTable.module.css";
import { TracerSurvey2 } from "../TracerSurvey2/TracerSurvey2"; // Import TracerSurvey2 Component

export const SurveyTable = ({ onView }) => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewTracerSurvey, setViewTracerSurvey] = useState(false); // State to toggle TracerSurvey2 view

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get("http://localhost:5050.onrender.com/api/surveys");
      setSurveys(response.data);
    } catch (error) {
      console.error("Error fetching surveys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    try {
      await axios.delete(`http://localhost:5050.onrender.com/api/surveys/${surveyId}`);
      setSurveys(surveys.filter((survey) => survey._id !== surveyId));
    } catch (error) {
      console.error("Error deleting survey:", error);
      alert("Failed to delete survey.");
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
                  {/* Add TracerSurvey2 row as the first row */}
                  <tr className={styles.row}>
                    <td className={styles.cell}> - </td>
                    <td
                      className={`${styles.cell} ${styles.clickable}`}
                      onClick={() => setViewTracerSurvey(true)} // Click to view TracerSurvey2
                    >
                      Tracer Survey 2
                    </td>
                    <td className={styles.cell}>-</td>
                    <td className={styles.actionCell}>
                      <button
                        className={styles.viewButton}
                        onClick={() => setViewTracerSurvey(true)} // Click to view TracerSurvey2
                      >
                        View
                      </button>
                    </td>
                  </tr>

                  {/* Map through the surveys and render them below */}
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
