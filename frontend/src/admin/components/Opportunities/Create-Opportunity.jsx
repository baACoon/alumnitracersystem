import React, { useState } from "react";
import styles from "./Create-Opportunity.module.css";

export default function CreateOpportunity({ onClose }) {
  const [formData, setFormData] = useState({
    jobTitle: "",
    college: "",
    course: "",
    location: "",
    jobDescription: "",
    keyResponsibilities: "",
    requirements: "",
  });

  const coursesByCollege = {
    "College of Engineering": [
      "Bachelor of Science in Civil Engineering",
      "Bachelor of Science in Electrical Engineering",
      "Bachelor of Science in Electronics Engineering",
      "Bachelor of Science in Mechanical Engineering",
    ],
    "College of Science": [
      "Bachelor of Applied Science in Laboratory Technology",
      "Bachelor of Science in Computer Science",
      "Bachelor of Science in Environmental Science",
      "Bachelor of Science in Information System",
      "Bachelor of Science in Information Technology",
    ],
    "College of Industrial Education": [
      "Bachelor of Science Industrial Education Major in Information and Communication Technology",
      "Bachelor of Science Industrial Education Major in Home Economics",
      "Bachelor of Science Industrial Education Major in Industrial Arts",
    ],
    "College of Liberal Arts": [
      "Bachelor of Science in Business Management Major in Industrial Management",
      "Bachelor of Science in Entrepreneurship",
      "Bachelor of Science in Hospitality Management",
    ],
    "College of Architecture and Fine Arts": [
      "Bachelor of Science in Architecture",
      "Bachelor of Fine Arts",
      "Bachelor of Graphic Technology Major in Architecture Technology",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "college" && { course: "" }), // Reset course if college changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Opportunity Created Successfully!");
    console.log("Form Data Submitted:", formData);
    onClose(); // Close the modal after submission
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create Opportunity</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="jobTitle">Job Title</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="college">College</label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
            >
              <option value="">All Colleges</option>
              {Object.keys(coursesByCollege).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="course">Course</label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={!formData.college}
            >
              <option value="">All Courses</option>
              {formData.college &&
                coursesByCollege[formData.college].map((courseName) => (
                  <option key={courseName} value={courseName}>
                    {courseName}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="jobDescription">Job Description</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="keyResponsibilities">Key Responsibilities</label>
            <textarea
              id="keyResponsibilities"
              name="keyResponsibilities"
              value={formData.keyResponsibilities}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>
            Create Opportunity
          </button>
        </form>
      </div>
    </div>
  );
}
