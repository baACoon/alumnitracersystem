import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CompletedSurvey.module.css';

export const CompletedSurvey = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [completedSurveys, setCompletedSurveys] = useState([]);

    useEffect(() => {
        const fetchCompletedSurveys = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                const response = await axios.get(
                    `https://alumnitracersystem.onrender.com/surveys/completed/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setCompletedSurveys(response.data.surveys);
            } catch (error) {
                console.error("Error fetching completed surveys:", error);
                setCompletedSurveys([]); // fallback to empty array
            }
        };

        fetchCompletedSurveys();
    }, []);

    
    // Filter surveys based on search term
    const filteredSurveys = surveys.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.surveyContainer}>
            <h2>COMPLETED SURVEYS</h2>

            {/* Search Input */}
            <div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            
            </div>
            

            {/* Survey List */}
            <div className={styles.surveyContainer}>
                    <h2>COMPLETED SURVEYS</h2>
                    <div className={styles.surveyList}>
                        {completedSurveys.length > 0 ? (
                            completedSurveys.map((survey) => (
                                <div key={survey.id} className={styles.surveyCard}>
                                    <h3 className={styles.surveyTitle}>
                                        {survey.title}
                                        <p className={styles.surveyDate}>Completed on: {survey.dateCompleted}</p>
                                    </h3>
                                </div>
                            ))
                        ) : (
                            <p>No completed surveys available.</p>
                        )}
                    </div>
                </div>
                            
        </div>
    );
};

export default CompletedSurvey;
