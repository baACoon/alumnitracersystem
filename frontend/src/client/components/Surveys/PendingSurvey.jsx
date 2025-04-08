import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';
import { TracerSurvey2 } from '../TracerSurvey2/TracerSurvey2';

export const PendingSurvey = () => {
  const navigate = useNavigate();
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTracerSurvey2, setShowTracerSurvey2] = useState(false);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://alumnitracersystem.onrender.com/api/newSurveys", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data)) {
          const active = response.data.filter((s) => s.status === "active");
          setActiveSurveys(active);
        } else {
          console.warn("Unexpected API response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching active surveys:", error.response?.data || error.message);
        alert("Failed to load surveys.");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const goToForm = (surveyId) => {
    navigate(`/SurveyForm/${surveyId}`);
  };

  // If Tracer Survey 2 is clicked, show the form and stop rendering normal list
  if (showTracerSurvey2) {
    return <TracerSurvey2 onBack={() => setShowTracerSurvey2(false)} />;
  }

  return (
    <div className={styles.surveyContainer}>
      <h2>AVAILABLE SURVEYS</h2>

      {/* Tracer Survey 2 Section */}
      <div className={styles.tracerContainer}>
        <div className={styles.surveyCard} onClick={() => setShowTracerSurvey2(true)}>
          <h3 className={styles.surveyTitle}>Tracer Survey 2</h3>
          <p className={styles.surveyDescription}>Click to answer the Tracer Survey 2</p>
        </div>
      </div>

      {/* Active Surveys */}
      <div className={styles.surveyList}>
        {loading ? (
          <p>Loading surveys...</p>
        ) : activeSurveys.length > 0 ? (
          activeSurveys.map((survey) => (
            <div
              key={survey._id}
              className={styles.surveyCard}
              onClick={() => goToForm(survey._id)}
            >
              <h3 className={styles.surveyTitle}>{survey.title}</h3>
              <p className={styles.surveyDescription}>{survey.description}</p>
            </div>
          ))
        ) : (
          <p>No available surveys.</p>
        )}
      </div>
    </div>
  );
};

export default PendingSurvey;
