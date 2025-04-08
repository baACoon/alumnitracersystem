import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';
import { TracerSurvey2 } from '../TracerSurvey2/TracerSurvey2';

export const PendingSurvey = () => {
  const navigate = useNavigate();
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTracer2, setShowTracer2] = useState(false);

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
        } else if (Array.isArray(response.data.surveys)) {
          const active = response.data.surveys.filter((s) => s.status === "active");
          setActiveSurveys(active);
        } else {
          console.warn("Unexpected response format:", response.data);
          setActiveSurveys([]);
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

  return (
    <div className={styles.surveyContainer}>
      <h2>AVAILABLE SURVEYS</h2>
      <div className={styles.surveyList}>
        {loading ? (
          <p>Loading surveys...</p>
        ) : showTracer2 ? (
          <TracerSurvey2 onBack={() => setShowTracer2(false)} />
        ) : (
          <>
            {/* Tracer Survey 2 card at the top */}
            <div
              className={styles.surveyCard}
              onClick={() => setShowTracer2(true)}
            >
              <h3 className={styles.surveyTitle}>Tracer Survey 2</h3>
              <p className={styles.surveyDescription}>
                Answer the detailed alumni tracer form
              </p>
            </div>
  
            {/*  Other active surveys below */}
            {activeSurveys.length > 0 ? (
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
          </>
        )}
      </div>
    </div>
  );  
};

export default PendingSurvey;
