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
    education: [{ type: [], college: [], course: [], yearGraduated: "", institution: "" }],
    examinations: [{ examName: "", dateTaken: "", rating: "" }],
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
    trainings: [{ title: "", duration: "", institution: "" }],
    motivation: { promotion: false, professionalDevelopment: false, others: "" },
    employmentStatus: "",
    unemploymentReasons: {
      furtherStudy: false,
      noJobOpportunity: false,
      familyConcern: false,
      didNotLook: false,
      healthRelated: false,
      other: "",
      lackExperience: false,
    },
    jobDetails: {
      occupation: "",
      lineOfBusiness: "",
      placeOfWork: "",
      firstJob: "",
      stayingReasons: {
        salariesBenefits: false,
        careerChallenge: false,
        specialSkill: false,
        relatedToCourse: false,
        proximity: false,
        peerInfluence: false,
        familyInfluence: false,
        other: "",
      },
      jobRelatedToCourse: "",
      acceptingJobReasons: {
        salariesBenefits: false,
        careerChallenge: false,
        specialSkill: false,
        proximity: false,
        other: "",
      },
      changingJobReasons: { 
        specialSkill: false,
        relatedToCourse: false,
        proximity: false,
        peerInfluence: false,
        familyInfluence: false,
        other: false,
      },
      firstJobDuration: "",
      firstJobSearch: {
        advertisement: false,
        walkIn: false,
        recommended: false,
        friends: false,
        schoolPlacement: false,
        familyBusiness: false,
        jobFair: false,
        other: "",
      },
      jobLandingTime: "",
      jobLevel: {
        rankClerical: { firstJob: false, currentJob: false },
        professionalSupervisory: { firstJob: false, currentJob: false },
        managerialExecutive: { firstJob: false, currentJob: false },
        selfEmployed: { firstJob: false, currentJob: false },
      },
      // salaryRange: "",
      // curriculumRelevant: "",
      // competencies: {
      //   communication: false,
      //   humanRelations: false,
      //   entrepreneurial: false,
      //   ITSkills: false,
      //   problemSolving: false,
      //   criticalThinking: false,
      //   other: "",
      // },
      // curriculumSuggestions: "",
    },
  });

  const handleBack = () => {
    if (Object.keys(formData).length > 0 && 
        !window.confirm("You have unsaved changes. Leave anyway?")) {
      return;
    }
    if (onBack) {
      onBack();
    } else {
      navigate("/SurveyPage");
    }
  };

  const handleUpdateForm = useCallback((section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (currentPage === 1) {
      return (
        formData.education[0].college.length > 0 &&
        formData.education[0].course.length > 0 &&
        formData.education[0].yearGraduated &&
        formData.examinations.every(exam => 
          exam.examName && exam.dateTaken && exam.rating
        )
      );
    }
    if (currentPage === 2) {
      return (
        formData.trainings.every(training => 
          training.title && training.duration && training.institution
        ) &&
        (formData.motivation.promotion || 
         formData.motivation.professionalDevelopment || 
         formData.motivation.others)
      );
    }
    if (currentPage === 3) {
      return (
        formData.employmentStatus &&
        formData.jobDetails.occupation &&
        formData.jobDetails.lineOfBusiness &&
        formData.jobDetails.placeOfWork
      );
    }
    return false;
  }, [currentPage, formData]);

  const handleNextPage = () => {
    if (!validateForm()) {
      setSubmitStatus({ 
        type: "error", 
        message: "Please fill in all required fields" 
      });
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
      setSubmitStatus({ 
        type: "error", 
        message: "Please fill in all required fields" 
      });
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setSubmitStatus({ type: "error", message: "User not logged in" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitStatus({ 
        type: "error", 
        message: "No token provided. Please log in again." 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:5050/tracerSurvey2/submit',
        {
          // userId,
          // education: formData.education,
          // examinations: formData.examinations,
          // reasons: formData.reasons,
          // trainings: formData.trainings,
          // motivation: formData.motivation,
          // employmentStatus: formData.employmentStatus,
          // unemploymentReasons: formData.unemploymentReasons,
          // jobDetails: formData.jobDetails
          userId,
          educationDetails: {
            education: formData.education,
            examination: formData.examinations,
            reasons: formData.reasons
          },
          trainingDetails: {
            trainings: formData.trainings,
            motivation: formData.motivation
          },
          employmentDetails: {
            employmentStatus: formData.employmentStatus,
            unemploymentReasons: formData.unemploymentReasons,
            jobDetails: formData.jobDetails
          }

        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        setSubmitStatus({ 
          type: "success", 
          message: "Survey submitted successfully!" 
        });
        setTimeout(() => navigate("/profile"), 2000);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error.response?.data?.message || 
               "Failed to submit survey. Please try again.",
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
      <h2 className={styles.title}>Tracer Survey 2</h2>

      {submitStatus.message && (
        <div className={submitStatus.type === "error" ? styles.errorMessage : styles.successMessage}>
          {submitStatus.message}
        </div>
      )}

      {currentPage === 1 && (
        <Page1_Education 
          data={formData} 
          updateForm={handleUpdateForm} 
        />
      )}
      {currentPage === 2 && (
        <Page2_Training 
          data={formData} 
          updateForm={handleUpdateForm} 
        />
      )}
      {currentPage === 3 && (
        <Page3_Employment 
          data={formData} 
          updateForm={handleUpdateForm} 
        />
      )}

      <div className={styles.buttonRow}>
        {currentPage > 1 && (
          <button 
            className={styles.prevButton} 
            onClick={handlePrevPage}
            disabled={isSubmitting}
          >
            Previous
          </button>
        )}
        {currentPage < 3 ? (
          <button 
            className={styles.nextButton} 
            onClick={handleNextPage}
            disabled={isSubmitting}
          >
            Next
          </button>
        ) : (
          <button 
            className={styles.submitButton} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TracerSurvey2;