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

    const formatDate = (dateString) => {
        if (!dateString) return 'Invalid Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const handleSurveyClick = async (survey) => {
        if (!survey || !survey._id) {
            alert("This survey cannot be viewed because it has -ID.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `https://alumnitracersystem.onrender.com/surveys/${survey._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const fullSurvey = response.data.survey;

            if (!fullSurvey || !fullSurvey.personalInfo) {
                alert("This survey is missing information.");
                return;
            }

            setSelectedSurvey(fullSurvey);
            setShowModal(true);
        } catch (error) {
            console.error("Failed to fetch full survey data:", error);
            alert("Failed to load survey details.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSurvey(null);
    };

    const filteredSurveys = completedSurveys.filter(survey =>
        survey.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.surveyContainer}>
            <h2>COMPLETED SURVEYS</h2>

            <input
                type="text"
                className={styles.searchInput}
                placeholder="Search surveys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.surveyList}>
                {filteredSurveys.length > 0 ? (
                    filteredSurveys.map((survey) => (
                        <div
                            key={survey._id}
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

            {showModal && selectedSurvey && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={closeModal}>
                            &times;
                        </button>
                        <h3>{selectedSurvey.title}</h3>
                        <p><strong>Date Completed:</strong> {formatDate(selectedSurvey.date)}</p>

                        <div className={styles.modalSection}>
                            <h4>Personal Information</h4>
                            <p><strong>Name:</strong> {`${selectedSurvey.personalInfo.first_name} ${selectedSurvey.personalInfo.middle_name} ${selectedSurvey.personalInfo.last_name}`}</p>
                            <p><strong>Email:</strong> {selectedSurvey.personalInfo.email_address}</p>
                            <p><strong>Contact No:</strong> {selectedSurvey.personalInfo.contact_no}</p>
                            <p><strong>Birthdate:</strong> {formatDate(selectedSurvey.personalInfo.birthdate)}</p>
                            <p><strong>Birthplace:</strong> {selectedSurvey.personalInfo.birthplace}</p>
                            <p><strong>Sex:</strong> {selectedSurvey.personalInfo.sex}</p>
                            <p><strong>Nationality:</strong> {selectedSurvey.personalInfo.nationality}</p>
                            <p><strong>Address:</strong> {selectedSurvey.personalInfo.address}</p>
                            <p><strong>Degree:</strong> {selectedSurvey.personalInfo.degree}</p>
                            <p><strong>College:</strong> {selectedSurvey.personalInfo.college}</p>
                            <p><strong>Course:</strong> {selectedSurvey.personalInfo.course}</p>
                        </div>

                        <div className={styles.modalSection}>
                            <h4>Employment Information</h4>
                            <p><strong>Occupation:</strong> {selectedSurvey.employmentInfo.occupation}</p>
                            <p><strong>Company:</strong> {selectedSurvey.employmentInfo.company_name}</p>
                            <p><strong>Position:</strong> {selectedSurvey.employmentInfo.position}</p>
                            <p><strong>Year Started:</strong> {selectedSurvey.employmentInfo.year_started}</p>
                            <p><strong>Job Status:</strong> {selectedSurvey.employmentInfo.job_status}</p>
                            <p><strong>Type of Organization:</strong> {selectedSurvey.employmentInfo.type_of_organization}</p>
                            <p><strong>Work Alignment:</strong> {selectedSurvey.employmentInfo.work_alignment}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedSurvey;
