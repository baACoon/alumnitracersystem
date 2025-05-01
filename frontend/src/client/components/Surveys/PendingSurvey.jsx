import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "./PendingSurvey.module.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PendingSurvey = () => {
  const navigate = useNavigate()
  const [activeSurveys, setActiveSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [surveyQuestions, setSurveyQuestions] = useState([])
  const [responses, setResponses] = useState({})
  const [tracer2ReleaseDate, setTracer2ReleaseDate] = useState(null)
  const [nextTracerVersion, setNextTracerVersion] = useState(2)
  const [latestTracer, setLatestTracer] = useState(null)
  const today = new Date()
  const userId = localStorage.getItem("userId")

  const isTracer2Open = tracer2ReleaseDate && today >= new Date(tracer2ReleaseDate)

  const calculateReleaseDate = (gradYear, latestSurvey) => {
    // If no previous survey, base on graduation year
    if (!latestSurvey) {
      const initialReleaseYear = gradYear + 2
      return new Date(`${initialReleaseYear}-04-01`) // April 1 release date convention
    }
    
    // If there's a previous survey, release next version 2 years after submission
    const submissionDate = new Date(latestSurvey.createdAt)
    const nextReleaseYear = submissionDate.getFullYear() + 2
    return new Date(`${nextReleaseYear}-04-01`)
  }

  const calculateNextVersion = (latestSurvey) => {
    if (!latestSurvey) return 2 // First version
    return latestSurvey.version + 1
  }
  
  const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`https://alumnitracersystem.onrender.com/pending/dynamic/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        let active = []
        if (Array.isArray(response.data)) {
          active = response.data.filter((s) => s.status === "active")
        } else if (Array.isArray(response.data.surveys)) {
          active = response.data.surveys.filter((s) => s.status === "active")
        }
        setActiveSurveys(active)
      } catch (error) {
        console.error("Error fetching active surveys:", error.response?.data || error.message)
        toast.error("Failed to load surveys.")
      } finally {
        setLoading(false)
      }
    }

    const fetchTracer2Eligibility = async () => {
      try {
        const token = localStorage.getItem("token")
        // Get graduation year
        const gradRes = await axios.get(`https://alumnitracersystem.onrender.com/pending/gradyear/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const gradYear = gradRes.data.gradyear

        // Get all Tracer2 surveys
        const res = await axios.get(`https://alumnitracersystem.onrender.com/surveys/tracer2/all/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const tracer2Surveys = res.data.surveys || []
        const latestTracer = tracer2Surveys[0] // Most recent survey

        if (gradYear) {
          const releaseDate = calculateReleaseDate(gradYear, latestTracer)
          const nextVersion = calculateNextVersion(latestTracer)
          
          setTracer2ReleaseDate(releaseDate)
          setNextTracerVersion(nextVersion)
        }
      } catch (err) {
        console.error("Failed to fetch tracer2 eligibility:", err)
      }
    }

  useEffect(() => {
    
    fetchSurveys()
    fetchTracer2Eligibility()
  }, [userId])

  const openSurveyModal = async (survey) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`https://alumnitracersystem.onrender.com/api/newSurveys/${survey._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedSurvey(response.data.survey)
      setSurveyQuestions(response.data.questions)
      setResponses({})
    } catch (error) {
      console.error("Error loading survey details:", error)
      toast.error("Failed to load survey questions.")
    }
  }

  const handleAnswerChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value })
  }

  const handleSubmitSurvey = async () => {
    try {
      const token = localStorage.getItem("token")
      const formattedResponses = Object.entries(responses).map(([questionId, response]) => ({ questionId, response }))
      const payload = { userId, answers: formattedResponses }
      await axios.post(`https://alumnitracersystem.onrender.com/newSurveys/${selectedSurvey._id}/response`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      // After submission, refetch surveys and tracer eligibility
      await fetchSurveys()
      await fetchTracer2Eligibility()
      
      toast.success("Survey submitted successfully!")
      setSelectedSurvey(null)
      setActiveSurveys((prev) => prev.filter((s) => s._id !== selectedSurvey._id))
    } catch (error) {
      console.error("Submission error:", error.response || error.message)
      toast.error("Failed to submit survey.")
    }
  }

  const closeModal = () => {
    setSelectedSurvey(null)
  }

  return (
    <div className={styles.surveyContainer}>
      <h2 className={styles.containerTitle}>AVAILABLE SURVEYS</h2>
      <div className={styles.surveyList}>
        {loading ? (
          <div className="loadingOverlay">
            <div className="loaderContainer">Loading...</div>
          </div>
        ) : (
          <>
            {tracer2ReleaseDate ? (
              isTracer2Open ? (
                <div
                  className={styles.surveyCard}
                  onClick={() => navigate(`/TracerSurvey2?v=${nextTracerVersion}`)}
                  style={{ order: -1 }}
                >
                  <h3>Tracer Survey {nextTracerVersion}</h3>
                  <p>Now available – thank you for staying connected!</p>
                </div>
              ) : (
                <div className={`${styles.surveyCard} ${styles.disabledCard}`} style={{ order: -1 }}>
                  <h3 className={styles.grayText}>Tracer Survey {nextTracerVersion}</h3>
                  <p className={styles.grayText}>
                    Available on {tracer2ReleaseDate.toLocaleDateString()} 
                  </p>
                </div>
              )
            ) : null}

            {activeSurveys.length > 0 ? (
              activeSurveys.map((survey) => (
                <div key={survey._id} className={styles.surveyCard} onClick={() => openSurveyModal(survey)}>
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
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <h2 className={styles.modalTitle}>{selectedSurvey.title}</h2>
                <span className={styles.modalDate}>{new Date().toLocaleDateString()}</span>
              </div>
              <button className={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.surveyDescription}>{selectedSurvey.description}</p>
              <div className={styles.questionsContainer}>
                {surveyQuestions.map((question, index) => (
                  <div key={question._id} className={styles.questionItem}>
                    <p className={styles.questionNumber}>{index + 1}.</p>
                    <div className={styles.questionContent}>
                      <p className={styles.questionText}>{question.questionText}</p>
                      {question.questionType === "text" && (
                        <input
                          type="text"
                          className={styles.textInput}
                          value={responses[question._id] || ""}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          placeholder="Your answer"
                        />
                      )}
                      {question.questionType === "multiple-choice" && (
                        <div className={styles.optionsGrid}>
                          {question.options.map((option, idx) => (
                            <label key={idx} className={styles.optionLabel}>
                              <input
                                type="radio"
                                name={`q-${question._id}`}
                                value={option}
                                checked={responses[question._id] === option}
                                onChange={() => handleAnswerChange(question._id, option)}
                                className={styles.optionInput}
                              />
                              <span className={styles.optionText}>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="button" onClick={closeModal} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmitSurvey} className={styles.submitButton}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PendingSurvey
