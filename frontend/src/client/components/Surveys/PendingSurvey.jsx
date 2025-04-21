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
  const [tracer2Submitted, setTracer2Submitted] = useState(false);
  const [isTracerSurveyOpen, setIsTracerSurveyOpen] = useState(false);
  const [nextTracerVersion, setNextTracerVersion] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null);
  const [tracer2ReleaseDate, setTracer2ReleaseDate] = useState(null);

  const today = new Date();
  const userId = localStorage.getItem("userId");
  const isTracer2Open = tracer2ReleaseDate && today >= new Date(tracer2ReleaseDate);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:5050/api/newSurveys`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let active = [];
        if (Array.isArray(response.data)) {
          active = response.data.filter((s) => s.status === "active");
        } else if (Array.isArray(response.data.surveys)) {
          active = response.data.surveys.filter((s) => s.status === "active");
        }

        setActiveSurveys(active);
      } catch (error) {
        console.error("Error fetching active surveys:", error.response?.data || error.message);
        alert("Failed to load surveys.");
      } finally {
        setLoading(false);
      }
    };

    const fetchLatestTracer = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/tracerSurvey2/api/tracer2/latest/${userId}`)

        const { nextVersion, releaseDate, eligible } = res.data;

        setNextTracerVersion(nextVersion);
        setReleaseDate(new Date(releaseDate));
        setIsTracerSurveyOpen(eligible);
      } catch (err) {
        console.error("Error fetching latest tracer info:", err);
      }
    };

    // // ✅ FORCED OVERRIDE FOR TESTING
    // setTimeout(() => {
    //   setIsTracerSurveyOpen(true);
    //   setReleaseDate(new Date()); // just for UI display
    // }, 1000);

    const checkTracer2Status = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/surveys/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTracer2Submitted(res.data.status.tracer2Completed);
      } catch (err) {
        console.error("Failed to check Tracer 2 status:", err);
      }
    };

    const fetchTracer1Date = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/surveys/completed/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const tracer1Survey = res.data?.surveys?.find(s => s.surveyType === "Tracer1");
        if (tracer1Survey?.dateCompleted) {
          const completedDate = new Date();
          completedDate.setDate(completedDate.getDate() - 1); // simulate release = yesterday
          setTracer2ReleaseDate(completedDate)
          // const completedDate = new Date(tracer1Survey.dateCompleted);
          // completedDate.setFullYear(completedDate.getFullYear() + 2);
          // setTracer2ReleaseDate(completedDate);
        }
      } catch (err) {
        console.error("Failed to get Tracer 1 survey date:", err);
      }
    };


    fetchSurveys();
    fetchLatestTracer();
    checkTracer2Status();
    fetchTracer1Date();
  }, [userId]);

  const openSurveyModal = async (survey) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5050/api/newSurveys/${survey._id}`,
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

      const formattedResponses = Object.entries(responses).map(([questionId, answer]) => ({
        questionId,
        response: answer,
      }));

      const payload = { userId, answers: formattedResponses };

      await axios.post(
        `http://localhost:5050/api/newSurveys/${selectedSurvey._id}/response`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Survey submitted successfully!");
      setSelectedSurvey(null);
      setActiveSurveys((prev) => prev.filter((s) => s._id !== selectedSurvey._id));
      window.location.reload();
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
          <div className="loadingOverlay">
            <div className="loaderContainer">
              <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
                <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
                <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
                <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
                <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
              </svg>
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {!tracer2Submitted && (
              isTracerSurveyOpen ? (
                <div className={styles.surveyCard} onClick={() => navigate(`/TracerSurvey2?v=${nextTracerVersion}`)} style={{ order: -1 }}>
                  <h3>Tracer Survey {nextTracerVersion}</h3>
                  <p>Now available – thank you for staying connected!</p>
                </div>
              ) : (
                <div className={`${styles.surveyCard} ${styles.disabledCard}`} style={{ order: -1 }}>
                  <h3 className={styles.grayText}>Tracer Survey {nextTracerVersion}</h3>
                  <p className={styles.grayText}>Available on {releaseDate?.toLocaleDateString()}</p>
                </div>
              )
            )}

            {activeSurveys.length > 0 ? (
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
          </>
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