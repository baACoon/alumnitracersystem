import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./TracerSurvey2.module.css";
import Tuplogo from "../../image/Tuplogo.png";
import Alumnilogo from "../../image/alumniassoc_logo.png";
import Page1_Education from "./Page1_Education";
import Page2_Training from "./Page2_Training";
import Page3_Employment from "./Page3_Employment";

function TracerSurvey2({ onBack }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bachelorOnly: false,
    education: [{ degreeType: [], college: [], course: [], yearGraduated: "", institution: [] }],
    examinations: [{ examName: [], dateTaken: [], rating: [] }],
    noExams: false,
    reasons: {
      highGradesRelated: { undergraduate: false, graduate: false },
      goodHighSchoolGrades: { undergraduate: false, graduate: false },
      parentInfluence: { undergraduate: false, graduate: false },
      peerInfluence: { undergraduate: false, graduate: false },
      roleModel: { undergraduate: false, graduate: false },
      passion: { undergraduate: false, graduate: false },
      employmentProspects: { undergraduate: false, graduate: false },
      professionPrestige: { undergraduate: false, graduate: false },
      courseAvailability: { undergraduate: false, graduate: false },
      careerAdvancement: { undergraduate: false, graduate: false },
      affordability: { undergraduate: false, graduate: false },
      attractiveCompensation: { undergraduate: false, graduate: false },
      abroadEmployment: { undergraduate: false, graduate: false },
      noChoice: { undergraduate: false, graduate: false },
    },
    trainings: [{ title: [], duration: [], institution: [] }],
    noTrainings: false,
    motivation: {   
      promotion: false,
      professionalDevelopment: false,
      personalInterest: false,
      scholarship: false,
      careerShift: false,
      none: false,
    },
    job_status: "",
    unemploymentReasons: {
      furtherStudy: false,
      noJobOpportunity: false,
      familyConcern: false,
      didNotLook: false,
      healthRelated: false,
      lackExperience: false,
    },
    jobDetails: {
      occupation: "",
      company_name: "",
      year_started: "",
      type_of_organization: "",
      lineOfBusiness: "",
      placeOfWork: "",
      firstJob: "",
      stayingReasons: {},
      jobRelatedToCourse: "",
      acceptingJobReasons: {},
      changingJobReasons: {},
      firstJobDuration: "",
      firstJobSearch: {},
      jobLandingTime: "",
      position: "",
      job_level: "",
      salaryRange: "",
      work_alignment: "",
      competencies: {},
    },

  });
  console.log(formData)

  const handleBack = () => {
    if (Object.keys(formData).length > 0 && !window.confirm("You have unsaved changes. Leave anyway?")) return;
    onBack ? onBack() : navigate("/SurveyPage");
  };

  const handleUpdateForm = useCallback((section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  }, []);

  const validateForm = useCallback(() => {
    if (currentPage === 1) {
      const isEducationValid = formData.bachelorOnly || formData.education.every(
        edu =>
          edu.college?.length > 0 &&
          edu.course?.length > 0 &&
          edu.yearGraduated &&
          edu.institution
      );
  
      const isExamsValid = formData.noExams || formData.examinations.every(
        exam => exam.examName && exam.dateTaken && exam.rating
      );
  
      return isEducationValid && isExamsValid;
    }
  
    if (currentPage === 2) {
      return (
        (
          formData.noTrainings || formData.trainings.every(
            training => training.title && training.duration && training.institution
          )
        ) &&
        (
          formData.motivation.promotion ||
          formData.motivation.professionalDevelopment ||
          formData.motivation.personalInterest ||
          formData.motivation.scholarship ||
          formData.motivation.careerShift ||
          formData.motivation.none
        )
      );
    }
  
    if (currentPage === 3) {
      if (!formData.job_status) return false;
    
      if (formData.job_status === "Unemployed") {
        const hasReason = Object.values(formData.unemploymentReasons || {}).some(Boolean);
        return hasReason;
      }
      
    
      const requiredFields = [
        "occupation", "company_name", "position", "year_started",
        "type_of_organization", "lineOfBusiness", "placeOfWork",
        "firstJob", "jobRelatedToCourse", "firstJobDuration",
        "jobLandingTime", "job_level", "salaryRange", "work_alignment"
      ];
    
      const allJobDetailsFilled = requiredFields.every(field => formData.jobDetails?.[field]);
    
      return allJobDetailsFilled;
    }
  
    return false;
  }, [currentPage, formData]);
  
  const handleNextPage = () => {
    if (!validateForm()) {
      setSubmitStatus({ type: "error", message: "Please fill in all required fields" });
      return;
    }
    setSubmitStatus({ type: "", message: "" });
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    setSubmitStatus({ type: "", message: "" });
    setCurrentPage(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
  
    if (!validateForm()) {
      setSubmitStatus({ type: "error", message: "Please fill in all required fields." });
      return;
    }
  
    setIsSubmitting(true);
  
    const payload = {
      userId: localStorage.getItem("userId"),
      education: formData.bachelorOnly ? [] : formData.education.map(edu => ({
        degreeType: Array.isArray(edu.degreeType) ? edu.degreeType : [edu.degreeType || ""],
        college: Array.isArray(edu.college) ? edu.college : [edu.college || ""],
        course: Array.isArray(edu.course) ? edu.course : [edu.course || ""],
        yearGraduated: Array.isArray(edu.yearGraduated) ? edu.yearGraduated[0] : edu.yearGraduated || "",
        institution: Array.isArray(edu.institution) ? edu.institution[0] : edu.institution || ""
      })),
      examinations: formData.noExams ? [] : formData.examinations.map(exam => ({
        examName: exam.examName || "",
        dateTaken: exam.dateTaken || "",
        rating: exam.rating || ""
      })),
      reasons: formData.reasons,
      trainings: formData.noTrainings ? [] : formData.trainings.map(training => ({
        title: training.title || "",
        duration: training.duration || "",
        institution: training.institution || ""
      })),
      motivation: formData.motivation,
      job_status: formData.job_status || "unemployed",
      unemploymentReasons: formData.unemploymentReasons,
      jobDetails: formData.jobDetails,
    };
  
    try {
      const response = await axios.post(
        'https://alumnitracersystem.onrender.com/tracerSurvey2/tracerSurvey2/submit',
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        setSubmitStatus({ type: "success", message: "Survey submitted successfully!" });
        setTimeout(() => navigate("/SurveyPage"), 2000);
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error);
      setSubmitStatus({
        type: "error",
        message: error.response?.data?.message || "Failed to submit survey. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <div className={styles.tracer2Container}>
      <button className={styles.backButton} onClick={handleBack}>Back</button>
      <div className={styles.logoContainer}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo} />
      </div>
      <h2 className={styles.title}>TRACE SURVEY FORM </h2>

      {submitStatus.message && (
      <div
        className={`${submitStatus.type === "error" ? styles.errorBox : styles.successBox}`}
        style={{
          fontSize: "16px",
          fontWeight: "600",
          padding: "12px 20px",
          borderRadius: "8px",
          margin: "16px auto",
          width: "90%",
          textAlign: "center",
          backgroundColor: submitStatus.type === "error" ? "#ffcccc" : "#d4edda",
          color: submitStatus.type === "error" ? "#a94442" : "#155724",
          border: `2px solid ${submitStatus.type === "error" ? "#f5c6cb" : "#c3e6cb"}`,
        }}
      >
        {submitStatus.message}
      </div>
    )}


      {currentPage === 1 && <Page1_Education data={formData} updateForm={handleUpdateForm} />}
      {currentPage === 2 && <Page2_Training data={formData} updateForm={handleUpdateForm} />}
      {currentPage === 3 && <Page3_Employment data={formData} updateForm={handleUpdateForm} />}

      <div className={styles.buttonRow}>
        {currentPage > 1 && (
          <button className={styles.prevButton} onClick={handlePrevPage} disabled={isSubmitting}>
            Previous
          </button>
        )}
        {currentPage < 3 ? (
          <button className={styles.nextButton} onClick={handleNextPage} disabled={isSubmitting}>
            Next
          </button>
        ) : (
          <button className={styles.submitButton} onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export default TracerSurvey2;