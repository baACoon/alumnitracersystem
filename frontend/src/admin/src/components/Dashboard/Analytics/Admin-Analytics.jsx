import React, { useState } from "react";
import AnalyticsCards from "./Analytics-Cards";
import { TracerSurveyGraph, EmploymentAlumniGraph, CourseAlignmentGraph } from "./AnalyticsCards/General/Analytics-Graphs";
import styles from "./Admin-Analytics.module.css";
import GeneralTracer from "./AnalyticsCards/General/GeneralTracer";
import Tracer1Analytics from "./AnalyticsCards/Tracer1/Tracer1Analytics";
import Tracer2Analytics from "./AnalyticsCards/Tracer2/Tracer2Analytics";

export default function Analytics() {
  const [batch, setBatch] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [activeTab, setActiveTab] = useState("general");  

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
    ]
  };


  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    setActiveFilter("batch");
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
      <div className={styles.filterControls} role="group" aria-label="Filter controls">
        {/* Batch Filter */}
        <div className={styles.filterButtonContainer}>
          <label htmlFor="batch" className={styles.filterLabel}>Batch:</label>
          <select
            id="batch"
            className={`${styles.filterButton} ${activeFilter === "batch" ? styles.filterButtonActive : ""}`}
            value={batch}
            onChange={handleBatchChange}
          >
            <option value="">All Batches</option>
            {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                Batch {year}
              </option>
            ))}
          </select>
        </div>
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

      <div className={styles.analyticsContainer}>
        <AnalyticsCards />
      </div>

      {/* Tabs for Registered Alumni and List of Graduates */}
      <div className={styles.viewToggle} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "general"}
          className={`${styles.tab} ${activeTab === "general" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("general")}
        >
          GENERAL
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "tracer1"}
          className={`${styles.tab} ${activeTab === "tracer1" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("tracer1")}
        >
          TRACER 1
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "tracer2"}
          className={`${styles.tab} ${activeTab === "tracer2" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("tracer2")}
        >
          TRACER 2
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "general" && <GeneralTracer />}
      {activeTab === "tracer1" && <Tracer1Analytics />}
      {activeTab === "tracer2" && <Tracer2Analytics />}  
    </section>
  );
}
