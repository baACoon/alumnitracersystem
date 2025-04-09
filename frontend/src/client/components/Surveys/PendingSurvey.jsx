import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './PendingSurvey.module.css';

export const PendingSurvey = () => {
  const navigate = useNavigate();
  const [activeSurveys, setActiveSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("https://alumnitracersystem.onrender.com/api/newSurveys", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          const active = response.data.filter((s) => s.status === "active");
          setActiveSurveys(active);
        } else if (Array.isArray(response.data.surveys)) {
          const active = response.data.surveys.filter((s) => s.status === "active");
          setActiveSurveys(active);
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

  const openSurveyModal = async (survey) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://alumnitracersystem.onrender.com/api/newSurveys/${survey._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedSurvey(response.data.survey);
      setSurveyQuestions(response.data.questions);
      setResponses({});
    } catch (error) {
      console.error("Error loading survey details:", error);
      alert("Failed to load survey questions.");
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleSubmitSurvey = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      // Convert answers to array if needed
      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
  
      const payload = {
        surveyId: selectedSurvey._id,
        userId: userId,
        answers: formattedResponses.map(({ questionId, answer }) => ({
          questionId,
          response: answer,
        })),
      };
      
  
      console.log("Submitting:", payload);
  
      await axios.post(
        `https://alumnitracersystem.onrender.com/api/newSurveys/${selectedSurvey._id}/response`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      alert("Survey submitted successfully!");
      setSelectedSurvey(null);
      setActiveSurveys((prev) => prev.filter((s) => s._id !== selectedSurvey._id));
      navigate("/CompletedSurvey");
  
    } catch (error) {
      console.error("Submission error:", error.response || error.message);
      alert("Failed to submit survey.");
    }
  };
  

  const closeModal = () => {
    setSelectedSurvey(null);
  };

  return (
    <div className={styles.surveyContainer}>
      <h2>AVAILABLE SURVEYS</h2>
      <div className={styles.surveyList}>
        {loading ? (
          <p>Loading surveys...</p>
        ) : activeSurveys.length > 0 ? (
          activeSurveys.map((survey) => (
            <div
              key={survey._id}
              className={styles.surveyCard}
              onClick={() => openSurveyModal(survey)}
            >
              <h3 className={styles.surveyTitle}>{survey.title}</h3>
              <p className={styles.surveyDescription}>{survey.description}</p>
            </div>
          ))
        ) : (
          <p>No available surveys.</p>
        )}
      </div>

      {selectedSurvey && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeModal} onClick={closeModal}>✖</button>
            <h2>{selectedSurvey.title}</h2>
            <p>{selectedSurvey.description}</p>
            <form>
              {surveyQuestions.map((question, index) => (
                <div key={question._id} className={styles.questionBox}>
                  <p>{index + 1}. {question.questionText}</p>

                  {question.questionType === "text" && (
                    <input
                      type="text"
                      value={responses[question._id] || ""}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                    />
                  )}

                  {question.questionType === "multiple-choice" && (
                    <ul>
                      {question.options.map((option, idx) => (
                        <li key={idx}>
                          <label>
                            <input
                              type="radio"
                              name={`q-${question._id}`}
                              value={option}
                              checked={responses[question._id] === option}
                              onChange={() => handleAnswerChange(question._id, option)}
                            />
                            {option}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleSubmitSurvey} className={styles.submitBtn}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingSurvey;
