import React, { useState } from "react";
import styles from "./TracerSurvey2.module.css";
import Tuplogo from "../images/Tuplogo.png";
import Alumnilogo from "../images/alumniassoc_logo.png";

import Page1_Education from "./Page1_Education";
import Page2_Training from "./Page2_Training";
import Page3_Employment from "./Page3_Employment";

export const TracerSurvey2 = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePrevPage = () => setCurrentPage((prev) => prev - 1);

  const [formData, setFormData] = useState({
    // Page 1: Educational Background
    education: [{ type: "", course: "", college: "", yearGraduated: "", honors: "" }],
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

    // Page 2: Training Programs & Motivation
    trainings: [{ title: "", duration: "", institution: "" }],
    motivation: { promotion: false, professionalDevelopment: false, others: "" },

    // Page 3: Employment Data
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
        other: false,  // Change 'other' to false (boolean), not ""
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
        other: "",  // For 'Other' option
      },
      jobLandingTime: "",
      jobLevel: {
        rankClerical: { firstJob: false, currentJob: false },
        professionalSupervisory: { firstJob: false, currentJob: false },
        managerialExecutive: { firstJob: false, currentJob: false },
        selfEmployed: { firstJob: false, currentJob: false },
      },
      salaryRange: "",
      curriculumRelevant: "",
      competencies: {
        communication: false,
        humanRelations: false,
        entrepreneurial: false,
        ITSkills: false,
        problemSolving: false,
        criticalThinking: false,
        other: "",
      },
      curriculumSuggestions: "",
    },
  });

  const handleUpdateForm = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/survey/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to submit survey");
      alert("Survey submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting survey.");
    }
  };

  return (
    <div className={styles.tracer2Container}>
      <button className={styles.backButton} onClick={onBack}>Back</button>
      <div className={styles.logoContainer}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo} />
      </div>
      <h2 className={styles.title}>Tracer Survey 2</h2>

      {currentPage === 1 && (
        <Page1_Education data={formData} updateForm={handleUpdateForm} />
      )}
      {currentPage === 2 && (
        <Page2_Training data={formData} updateForm={handleUpdateForm} />
      )}
      {currentPage === 3 && (
        <Page3_Employment data={formData} updateForm={handleUpdateForm} />
      )}

      <div className={styles.buttonRow}>
        {currentPage > 1 && (
          <button className={styles.prevButton} onClick={handlePrevPage}>
            Previous
          </button>
        )}
        {currentPage < 3 ? (
          <button className={styles.nextButton} onClick={handleNextPage}>
            Next
          </button>
        ) : (
          <button className={styles.submitButton} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
};
