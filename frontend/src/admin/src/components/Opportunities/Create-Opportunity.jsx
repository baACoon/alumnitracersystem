import React, { useState } from "react";
import styles from "./Create-Opportunity.module.css";

export default function CreateOpportunity({ onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    college: "",
    course: "",
    location: "",
    type: "full-time", // Default type
    description: "",
    responsibilities: "",
    qualifications: "",
    source: "",
  });

  const [loading, setLoading] = useState(false);

  // Course mapping
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
      ...(name === "college" ? { course: "" } : {}), // Reset course if college changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if all required fields are filled
    if (!formData.title || !formData.company || !formData.college || !formData.course || !formData.location || !formData.description) {
        alert("Title, Company, College, Course, Location, and Description are required!");
        setLoading(false);
        return;
    }

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("You need to log in first.");
            setLoading(false);
            return;
        }

        // Check if the user is admin and set status accordingly
        const role = localStorage.getItem('role'); // Assuming role is saved in localStorage
        const status = role === 'admin' ? 'Published' : 'Pending'; // Set status based on role

        // Format responsibilities and qualifications into arrays
        const formattedResponsibilities = formData.responsibilities ? formData.responsibilities.split("\n").map(item => item.trim()) : [];
        const formattedQualifications = formData.qualifications ? formData.qualifications.split("\n").map(item => item.trim()) : [];

        console.log("Sending Job Data:", JSON.stringify({
            title: formData.title,
            company: formData.company,
            college: formData.college,
            course: formData.course,
            location: formData.location,
            type: formData.type || "full-time",
            description: formData.description,
            responsibilities: formattedResponsibilities,
            qualifications: formattedQualifications,
            source: formData.source,
            status: status, // Pass status dynamically
        }));

        const response = await fetch("https://alumnitracersystem.onrender.com/jobs/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: formData.title,
                company: formData.company,
                college: formData.college,
                course: formData.course,
                location: formData.location,
                type: formData.type || "full-time",
                description: formData.description,
                responsibilities: formattedResponsibilities,
                qualifications: formattedQualifications,
                source: formData.source,
                status: status, // Dynamically set status here
            }),
        });

        const responseData = await response.json();
        console.log("Full Server Response:", responseData);

        if (!response.ok) {
            console.error("Failed to create job:", responseData);
            alert(`Error: ${responseData.error || "Failed to create job."}`);
            setLoading(false);
            return;
        }

        alert("Job opportunity posted successfully!");
        onClose(); // Close modal after submission
    } catch (error) {
        console.error("Error creating opportunity:", error);
        alert("An error occurred while creating the opportunity.");
    } finally {
        setLoading(false);
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
            <label htmlFor="title">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter Job Title"
                    />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="company">Company</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="Enter company name"
                    />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="college">College</label>
            <select id="college" name="college" value={formData.college} onChange={handleChange}>
                        <option value="">Select College</option>
                        {Object.keys(coursesByCollege).map((collegeName) => (
                            <option key={collegeName} value={collegeName}>
                                {collegeName}
                            </option>
                        ))}
              </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="course">Course</label>
            <select id="course" name="course" value={formData.course} onChange={handleChange} disabled={!formData.college}>
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
            <label htmlFor="location">Location</label>
            <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter job location"
                    />
          </div>

          <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange}>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                    </select>
                </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Job Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter job description"
                    ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="responsibilities">Key Responsibilities</label>
                    <textarea
                        id="responsibilities"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="Enter key responsibilities"
                    ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="qualifications">Qualifications</label>
                    <textarea
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        placeholder="Enter required qualifications"
                    ></textarea>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="source">Source</label>
            <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="Enter the source or link"
                    />
          </div>

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? "Creating..." : "Create Opportunity"}
          </button>
        </form>
      </div>
    </div>
  );
}
