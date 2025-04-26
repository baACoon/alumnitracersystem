import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './CompletedSurvey.module.css';

export const CompletedSurvey = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [completedSurveys, setCompletedSurveys] = useState([]);
    const [selectedSurvey, setSelectedSurvey] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompletedSurveys = async () => {
            try {
                const token = localStorage.getItem("token");
                const userId = localStorage.getItem("userId");

                const [tracerRes, dynamicRes] = await Promise.all([
                    axios.get(`http://localhost:5050/surveys/completed/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`http://localhost:5050/pending/completed/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const tracerSurveys = tracerRes.data.surveys.map(s => ({
                    ...s,
                    type: "tracer",
                }));

                const dynamicSurveys = dynamicRes.data.surveys.map(s => ({
                    ...s,
                    type: "dynamic",
                }));

                setCompletedSurveys([...tracerSurveys, ...dynamicSurveys]);
            } catch (error) {
                console.error("Error fetching completed surveys:", error);
                setCompletedSurveys([]);
            } finally {
                setLoading(false);
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
        if (!survey || !survey.id) {
            alert("This survey cannot be viewed because it has no ID.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            let response;
            if (survey.type === "tracer") {
                response = await axios.get(`http://localhost:5050/surveys/${survey.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (survey.type === "dynamic") {
                response = await axios.get(`http://localhost:5050/pending/response/${survey.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                alert("Unsupported survey type.");
                return;
            }

            const fullSurvey = response.data;
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
                {loading ? (
                    <div className="loadingOverlay">
                        <div className="loaderContainer">
                            <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
                                {/* loader */}
                            </svg>
                            <p>Loading...</p>
                        </div>
                    </div>
                ) : filteredSurveys.length > 0 ? (
                    filteredSurveys.map((survey) => (
                        <div
                            key={survey.id}
                            className={styles.surveyCard}
                            onClick={() => handleSurveyClick(survey)}
                        >
                            <h3 className={styles.surveyTitle}>
                                {survey.title}
                                <p className={styles.surveyDate}>
                                    Completed on: {formatDate(survey.dateCompleted)}
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

                        <h3>{selectedSurvey.surveyTitle || selectedSurvey.title}</h3>
                        <p><strong>Date Completed:</strong> {formatDate(selectedSurvey.submittedAt || selectedSurvey.date)}</p>

                        {/* Check if dynamic */}
                        {selectedSurvey.questions && selectedSurvey.answers ? (
                            <div>
                                <h4>Answered Questions:</h4>
                                {selectedSurvey.questions.map((question, index) => (
                                    <div key={question._id}>
                                        <p><strong>Q{index + 1}:</strong> {question.questionText}</p>
                                        <p><strong>Answer:</strong> {selectedSurvey.answers.find(a => a.questionId === question._id)?.response || "No answer"}</p>
                                        <hr />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <h4>Personal Information</h4>
                                <p><strong>Name:</strong> {`${selectedSurvey.personalInfo?.first_name || ""} ${selectedSurvey.personalInfo?.last_name || ""}`}</p>
                                <p><strong>Email:</strong> {selectedSurvey.personalInfo?.email_address}</p>
                                <p><strong>Degree:</strong> {selectedSurvey.personalInfo?.degree}</p>
                                <p><strong>College:</strong> {selectedSurvey.personalInfo?.college}</p>
                                <p><strong>Course:</strong> {selectedSurvey.personalInfo?.course}</p>

                                <h4>Employment Information</h4>
                                <p><strong>Occupation:</strong> {selectedSurvey.employmentInfo?.occupation}</p>
                                <p><strong>Company:</strong> {selectedSurvey.employmentInfo?.company_name}</p>
                                <p><strong>Position:</strong> {selectedSurvey.employmentInfo?.position}</p>
                                <p><strong>Year Started:</strong> {selectedSurvey.employmentInfo?.year_started}</p>
                                <p><strong>Job Status:</strong> {selectedSurvey.employmentInfo?.job_status}</p>
                                <p><strong>Type of Organization:</strong> {selectedSurvey.employmentInfo?.type_of_organization}</p>
                                <p><strong>Work Alignment:</strong> {selectedSurvey.employmentInfo?.work_alignment}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompletedSurvey;
