import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';

export const PendingSurvey = () => {
  const navigate = useNavigate();
  const [activeSurveys, setActiveSurveys] = useState([]);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get("https://alumnitracersystem.onrender.com/api/newSurveys/active");

        // Assuming your backend returns: { surveys: [...] }
        setActiveSurveys(response.data.surveys || []);
      } catch (error) {
        console.error("Error fetching active surveys:", error);
        alert("Failed to load surveys.");
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
        {activeSurveys.length > 0 ? (
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
