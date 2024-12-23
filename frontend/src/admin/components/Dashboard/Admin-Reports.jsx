import React, { useState } from "react";
import styles from "./Admin-Reports.module.css";



export default function Analytics() {
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);

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

  const handleCollegeChange = (e) => {
    setCollege(e.target.value);
    setActiveFilter("college");
    setCourse(""); // Reset course when college changes
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    setActiveFilter("course");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (

      <section className={styles.filterSection} aria-label="Dashboard filters">

        {/* Filter Controls */}
        <div
          className={styles.filterControls}
          role="group"
          aria-label="Filter controls"
        >
          {/* College Filter */}
          <div className={styles.filterButtonContainer}>
            <label htmlFor="college" className={styles.filterLabel}>
              College:
            </label>
            <select
              id="college"
              className={`${styles.filterButton} ${
                activeFilter === "college" ? styles.filterButtonActive : ""
              }`}
              value={college}
              onChange={handleCollegeChange}
            >
              <option value="">All Colleges</option>
              {Object.keys(coursesByCollege).map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div className={styles.filterButtonContainer}>
            <label htmlFor="course" className={styles.filterLabel}>
              Course:
            </label>
            <select
              id="course"
              className={`${styles.filterButton} ${
                activeFilter === "course" ? styles.filterButtonActive : ""
              }`}
              value={course}
              onChange={handleCourseChange}
              disabled={!college}
            >
              <option value="">Select Course</option>
              {college &&
                coursesByCollege[college].map((courseName) => (
                  <option key={courseName} value={courseName}>
                    {courseName}
                  </option>
                ))}
            </select>
          </div>
        </div>

       
      </section>

  );
}

