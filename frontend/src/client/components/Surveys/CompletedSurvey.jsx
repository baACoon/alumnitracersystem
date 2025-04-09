import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CompletedSurvey.module.css';

export const CompletedSurvey = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [completedSurveys, setCompletedSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
                setCompletedSurveys([]);
            }
        };

        fetchCompletedSurveys();
    }, []);

    const filteredSurveys = completedSurveys.filter(survey =>
        survey.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSurveyClick = (survey) => {
        setSelectedSurvey(survey);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSurvey(null);
    };

    return (
        <div className={styles.surveyContainer}>
            <h2>COMPLETED SURVEYS</h2>

            <div>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search surveys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className={styles.surveyList}>
                {filteredSurveys.length > 0 ? (
                    filteredSurveys.map((survey) => (
                        <div
                            key={survey.id}
                            className={styles.surveyCard}
                            onClick={() => handleSurveyClick(survey)}
                        >
                            <h3 className={styles.surveyTitle}>
                                {survey.title}
                                <p className={styles.surveyDate}>
                                    Completed on: {survey.dateCompleted}
                                </p>
                            </h3>
                        </div>
                    ))
                ) : (
                    <p>No completed surveys available.</p>
                )}
            </div>

            {/* Modal */}
            {showModal && selectedSurvey && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            &times;
                        </button>
                        <h3>{selectedSurvey.title}</h3>
                        <p><strong>Date Completed:</strong> {selectedSurvey.dateCompleted}</p>
                        <div className={styles.answerSection}>
                            {selectedSurvey.answers && selectedSurvey.answers.length > 0 ? (
                                selectedSurvey.answers.map((ans, index) => (
                                    <div key={index} className={styles.answerItem}>
                                        <p><strong>Q:</strong> {ans.question}</p>
                                        <p><strong>A:</strong> {ans.answer}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No answers available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedSurvey;
