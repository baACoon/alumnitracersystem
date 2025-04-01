import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';

export const PendingSurvey = () => {
    const navigate = useNavigate();
    const [pendingSurveys, setPendingSurveys]= useState([]);

    useEffect(() => {
        const fetchPendingSurveys = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            
            const response = await axios.get(`https://alumnitracersystem.onrender.com/surveys/pending/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPendingSurveys(response.data.surveys);
        };

        fetchPendingSurveys();
    }, []);

    const goToForm = (surveyId) => {
        navigate(`/SurveyForm/${surveyId}`);
    };

    return (
        <div className={styles.surveyContainer}>
            <h2>PENDING SURVEYS</h2>
            <div className={styles.surveyList}>
                {pendingSurveys.length > 0 ? (
                    pendingSurveys.map((survey) => (
                        <div key={survey.id} className={styles.surveyCard}>
                            <h3 className={styles.surveyTitle} onClick={() => goToForm(survey.id)}>
                                {survey.title}
                                <p className={styles.surveyDate}>Received: {survey.dateReceived}</p>
                            </h3>
                        </div>
                    ))
                ) : (
                    <p>No pending surveys available.</p>
                )}
            </div>
        </div>

    );
};

export default PendingSurvey;
