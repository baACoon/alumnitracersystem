import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styles from "./AlumniFilters.module.css";
import { AlumniTable } from "../Table/AlumniTable";
import { GraduatesList } from "../BatchList/GraduatesList";
import SidebarLayout from "../../SideBar/SideBarLayout";

export function AlumniFilters() {
  const [activeTab, setActiveTab] = useState("registered");
  const [batch, setBatch] = useState("");
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
    "Bachelor of Technical Vocational Teachers Education Major in Animation",
    "Bachelor of Technical Vocational Teachers Education Major in Automotive",
    "Bachelor of Technical Vocational Teachers Education Major in Beauty Care and Wellness",
    "Bachelor of Technical Vocational Teachers Education Major in Computer Programming",
    "Bachelor of Technical Vocational Teachers Education Major in Electrical",
    "Bachelor of Technical Vocational Teachers Education Major in Electronics",
    "Bachelor of Technical Vocational Teachers Education Major in Food Service Management",
    "Bachelor of Technical Vocational Teachers Education Major in Fashion and Garment",
    "Bachelor of Technical Vocational Teachers Education Major in Heat Ventillation & Air Conditioning",
  ],
  "College of Liberal Arts": [
    "Bachelor of Science in Business Management Major in Industrial Management",
    "Bachelor of Science in Entreprenuership",
    "Bachelor of Science Hospitality Management",
  ],
  "College of Architecture and Fine Arts": [
    "Bachelor of Science in Architecture",
    "Bachelor of Fine Arts",
    "Bachelor of Graphic Technology Major in Architecture Technology",
    "Bachelor of Graphic Technology Major in Industrial Design",
    "Bachelor of Graphic Technology Major in Mechanical Drafting Technology",
  ],
  "College of Industrial Technology": [
    "Bachelor of Science in Food Technology",
    "Bachelor of Engineering Technology Major in Civil Technology",
    "Bachelor of Engineering Technology Major in Electrical Technology",
    "Bachelor of Engineering Technology Major in Electronics Technology",
    "Bachelor of Engineering Technology Major in Computer Engineering Technology",
    "Bachelor of Engineering Technology Major in Instrumentation and Control Technology",
    "Bachelor of Engineering Technology Major in Mechanical Technology",
    "Bachelor of Engineering Technology Major in Mechatronics Technology",
    "Bachelor of Engineering Technology Major in Railway Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Automative Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Heating Ventilation & Airconditioning/Refrigiration Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Power Plant Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Welding Technology",
    "Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Dies and Moulds Technology",
    "Bachelor of Technology in Apparel and Fashion",
    "Bachelor of Technology in Culinary Technology",
    "Bachelor of Technology in Print Media Technology",
  ],
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
    <SidebarLayout>
    <section className={styles.filterSection} aria-label="Alumni filters">
      <h2 className={styles.databaseTitle}>ALUMNI DATABASE</h2>

      {/* Filter Controls */}
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
          <label htmlFor="college" className={styles.filterLabel}>College:</label>
          <select
            id="college"
            className={`${styles.filterButton} ${activeFilter === "college" ? styles.filterButtonActive : ""}`}
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
          <label htmlFor="course" className={styles.filterLabel}>Course:</label>
          <select
            id="course"
            className={`${styles.filterButton} ${activeFilter === "course" ? styles.filterButtonActive : ""}`}
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

      {/* Tabs for Registered Alumni and List of Graduates */}
      <div className={styles.viewToggle} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "registered"}
          className={`${styles.tab} ${activeTab === "registered" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("registered")}
        >
          REGISTERED ALUMNI
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "graduates"}
          className={`${styles.tab} ${activeTab === "graduates" ? styles.activeTab : ""}`}
          onClick={() => handleTabChange("graduates")}
        >
          LIST OF GRADUATES
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "registered" && <AlumniTable />}
      {activeTab === "graduates" && <GraduatesList />}
    </section>

    
    </SidebarLayout>
  );
}

export default AlumniFilters;
