"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styles from "./CompletedSurvey.module.css"

export const CompletedSurvey = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [completedSurveys, setCompletedSurveys] = useState([])
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCompletedSurveys = async () => {
      try {
        const token = localStorage.getItem("token")
        const userId = localStorage.getItem("userId")

        const [tracerRes, dynamicRes, tracer2Res] = await Promise.all([
          axios.get(`http://localhost:5050/surveys/completed/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5050/pending/completed/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5050/surveys/tracer2/all/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const tracerSurveys = tracerRes.data.surveys.map((s) => ({
          ...s,
          type: "tracer",
        }))

        const dynamicSurveys = dynamicRes.data.surveys.map((s) => ({
          ...s,
          type: "dynamic",
        }))

        const tracer2Surveys = tracer2Res.data.surveys.map((s) => ({
          id: s._id,
          title: `Tracer Survey ${s.version || 1}`,
          type: "tracer2",
          dateCompleted: s.createdAt,
        }))

        setCompletedSurveys([...tracerSurveys, ...dynamicSurveys, ...tracer2Surveys])
      } catch (error) {
        console.error("Error fetching completed surveys:", error)
        setCompletedSurveys([])
      } finally {
        setLoading(false)
      }
    }

    fetchCompletedSurveys()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const handleSurveyClick = async (survey) => {
    if (!survey || !survey.id) {
      alert("This survey cannot be viewed because it has no ID.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      let response

      if (survey.type === "tracer") {
        response = await axios.get(`http://localhost:5050/surveys/view/${survey.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else if (survey.type === "tracer2") {
        response = await axios.get(`http://localhost:5050/surveys/tracer2/details/${survey.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else if (survey.type === "dynamic") {
        response = await axios.get(`http://localhost:5050/pending/response/${survey.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        alert("Unsupported survey type.")
        return
      }

      setSelectedSurvey({
        ...response.data,
        type: survey.type,
      })
      setShowModal(true)
    } catch (error) {
      console.error("Failed to fetch full survey data:", error)
      alert("Failed to load survey details.")
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSurvey(null)
  }

  const filteredSurveys = completedSurveys.filter((survey) =>
    survey.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const renderTracer1Details = (survey) => {
    return (
      <div className={styles.modalSection}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Name</div>
            <div
              className={styles.infoValue}
            >{`${survey.personalInfo?.first_name || ""} ${survey.personalInfo?.last_name || ""}`}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Email</div>
            <div className={styles.infoValue}>{survey.personalInfo?.email_address || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Degree</div>
            <div className={styles.infoValue}>{survey.personalInfo?.degree || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>College</div>
            <div className={styles.infoValue}>{survey.personalInfo?.college || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Course</div>
            <div className={styles.infoValue}>{survey.personalInfo?.course || "N/A"}</div>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>Employment Information</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Occupation</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.occupation || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Company</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.company_name || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Position</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.position || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Year Started</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.year_started || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Job Status</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.job_status || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Type of Organization</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.type_of_organization || "N/A"}</div>
          </div>
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Work Alignment</div>
            <div className={styles.infoValue}>{survey.employmentInfo?.work_alignment ? "Yes" : "No"}</div>
          </div>
        </div>
      </div>
    )
  }

  const renderTracer2Details = (survey) => {
    return (
      <div>
        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Education Information</h3>
          {survey.education?.map((edu, index) => (
            <div key={index} className={styles.infoCard}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Degree Type</div>
                  <div className={styles.infoValue}>{edu.degreeType?.join(", ") || "N/A"}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>College</div>
                  <div className={styles.infoValue}>{edu.college?.join(", ") || "N/A"}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Course</div>
                  <div className={styles.infoValue}>{edu.course?.join(", ") || "N/A"}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Year Graduated</div>
                  <div className={styles.infoValue}>{edu.yearGraduated || "N/A"}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>Institution</div>
                  <div className={styles.infoValue}>{edu.institution || "N/A"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Examinations</h3>
          {survey.noExams ? (
            <p className={styles.noResults}>No examinations taken</p>
          ) : (
            survey.examinations?.map((exam, index) => (
              <div key={index} className={styles.infoCard}>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Exam Name</div>
                    <div className={styles.infoValue}>{exam.examName || "N/A"}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Date Taken</div>
                    <div className={styles.infoValue}>{exam.dateTaken || "N/A"}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>Rating</div>
                    <div className={styles.infoValue}>{exam.rating || "N/A"}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.modalSection}>
          <h3 className={styles.sectionTitle}>Job Details</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Job Status</div>
              <div className={styles.infoValue}>{survey.job_status || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Occupation</div>
              <div className={styles.infoValue}>{survey.jobDetails?.occupation || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Company</div>
              <div className={styles.infoValue}>{survey.jobDetails?.company_name || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Year Started</div>
              <div className={styles.infoValue}>{survey.jobDetails?.year_started || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Position</div>
              <div className={styles.infoValue}>{survey.jobDetails?.position || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Salary Range</div>
              <div className={styles.infoValue}>{survey.jobDetails?.salaryRange || "N/A"}</div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoLabel}>Work Alignment</div>
              <div className={styles.infoValue}>{survey.jobDetails?.work_alignment ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderDynamicSurveyDetails = (survey) => {
    return (
      <div className={styles.modalSection}>
        {survey.questions && survey.answers ? (
          survey.questions.map((question, index) => (
            <div key={question._id} className={styles.questionItem}>
              <div className={styles.questionText}>
                <span className={styles.questionNumber}>{index + 1}</span>
                {question.questionText}
              </div>
              <div className={styles.answerContainer}>
                <div className={styles.answerLabel}>Answer:</div>
                <div className={styles.answerText}>
                  {survey.answers.find((a) => a.questionId === question._id)?.response || "No answer provided"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No questions or answers available</p>
        )}
      </div>
    )
  }

  return (
    <div className={styles.surveyContainer}>
      <h2 className={styles.containerTitle}>COMPLETED SURVEYS</h2>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search surveys..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p>Loading surveys...</p>
          </div>
        </div>
      ) : filteredSurveys.length > 0 ? (
        <div className={styles.surveyList}>
          {filteredSurveys.map((survey) => (
            <div key={survey.id} className={styles.surveyCard} onClick={() => handleSurveyClick(survey)}>
              <div className={styles.surveyInfo}>
                <h3 className={styles.surveyTitle}>
                  {survey.title}
                </h3>
                <p className={styles.surveyDate}>
                  <span className={styles.calendarIcon}></span>
                  Completed on: {formatDate(survey.dateCompleted)}
                </p>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          <p>No completed surveys available.</p>
        </div>
      )}

      {showModal && selectedSurvey && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            

            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedSurvey.surveyTitle || selectedSurvey.title}
              </h2>
              <span className={styles.modalDate}>
                Completed on:{" "}
                {formatDate(selectedSurvey.submittedAt || selectedSurvey.date || selectedSurvey.createdAt)}
              </span>
              <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            </div>        

            {selectedSurvey.type === "dynamic"
              ? renderDynamicSurveyDetails(selectedSurvey)
              : selectedSurvey.type === "tracer"
                ? renderTracer1Details(selectedSurvey)
                : selectedSurvey.type === "tracer2"
                  ? renderTracer2Details(selectedSurvey)
                  : null}

            <div style={{ textAlign: "right", marginTop: "20px" }}>
              <button className={`${styles.button} ${styles.outlineButton}`} onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompletedSurvey
