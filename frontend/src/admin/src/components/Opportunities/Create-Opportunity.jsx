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

  const [loading, setLoading] = useState(false); // 🔄 Add loading state

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔄 Show loading state
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You need to log in first.");
        setLoading(false);
        return;
      }

      console.log("Submitting Form Data:", formData); // ✅ Log form data before sending

      const response = await fetch(
        "https://alumnitracersystem.onrender.com/jobs/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.jobTitle,
            company: "Admin-created", // Hardcoded, adjust if needed
            location: formData.location,
            type: "full-time", // Default job type
            description: formData.jobDescription,
            responsibilities: formData.keyResponsibilities.split("\n"), // Convert string to array
            qualifications: formData.requirements.split("\n"), // Convert string to array
          }),
        }
      );

      const responseData = await response.json();
      console.log("Server Response:", responseData); // ✅ Log API response

      if (!response.ok) {
        console.error("Failed to create job:", responseData);
        alert(responseData.error || "Failed to create job.");
        setLoading(false);
        return;
      }

      alert("Opportunity Created Successfully!");
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error creating opportunity:", error);
      alert("An error occurred while creating the opportunity.");
    } finally {
      setLoading(false); // 🔄 Hide loading state
    }
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
            <label className={styles.oppLabel} htmlFor="jobTitle">
              Job Title
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="college">
              College
            </label>
            <select
              id="college"
              name="college"
              value={formData.college}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select College</option>
              {Object.keys(coursesByCollege).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="course">
              Course
            </label>
            <select
              id="course"
              name="course"
              value={formData.course}
              onChange={handleChange}
              disabled={!formData.college || loading}
            >
              <option value="">Select Course</option>
              {formData.college &&
                coursesByCollege[formData.college].map((courseName) => (
                  <option key={courseName} value={courseName}>
                    {courseName}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="jobDescription">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="keyResponsibilities">
              Key Responsibilities
            </label>
            <textarea
              id="keyResponsibilities"
              name="keyResponsibilities"
              value={formData.keyResponsibilities}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.oppLabel} htmlFor="requirements">
              Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              required
              disabled={loading}
            ></textarea>
          </div>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Creating..." : "Create Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}
