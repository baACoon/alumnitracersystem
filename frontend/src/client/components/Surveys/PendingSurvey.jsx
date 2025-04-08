import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';

export const PendingSurvey = () => {
  const navigate = useNavigate();
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("https://alumnitracersystem.onrender.com/api/newSurveys/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.surveys) {
          setActiveSurveys(response.data.surveys);
        } else {
          console.warn("No surveys key in response:", response.data);
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
        ) : activeSurveys.length > 0 ? (
          activeSurveys.map((survey) => (
            <div key={survey._id} className={styles.surveyCard} onClick={() => goToForm(survey._id)}>
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
