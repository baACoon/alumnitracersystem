import React, { useState } from "react";
import styles from "./AlumniFilters.module.css";
import { AlumniTable } from "../Table/AlumniTable";
import { GraduatesList } from "../BatchList/GraduatesList";
import SidebarLayout from "../../SideBar/SideBarLayout";

export function AlumniFilters() {
  const [activeTab, setActiveTab] = useState("registered");
  
  // const [batch, setBatch] = useState("");
  // const [college, setCollege] = useState("");
  // const [course, setCourse] = useState("");
  // const [activeFilter, setActiveFilter] = useState(null);

  // const coursesByCollege = { ... }; // COMMENTED OUT FOR CLEANUP IF NEEDED

  // const handleBatchChange = (e) => {
  //   setBatch(e.target.value);
  //   setActiveFilter("batch");
  // };

  // const handleCollegeChange = (e) => {
  //   setCollege(e.target.value);
  //   setActiveFilter("college");
  //   setCourse("");
  // };

  // const handleCourseChange = (e) => {
  //   setCourse(e.target.value);
  //   setActiveFilter("course");
  // };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SidebarLayout>
      <section className={styles.filterSection} aria-label="Alumni filters">
        <h2 className={styles.databaseTitle}>ALUMNI MANAGEMENT</h2>

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

        {activeTab === "registered" && (
          <>
            {/* FILTER CONTROLS COMMENTED OUT */}
            {/* 
            <div className={styles.filterControls} role="group" aria-label="Filter controls">
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
                    <option key={year} value={year}>Batch {year}</option>
                  ))}
                </select>
              </div>

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
                    <option key={collegeName} value={collegeName}>{collegeName}</option>
                  ))}
                </select>
              </div>

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
                  {college && coursesByCollege[college].map((courseName) => (
                    <option key={courseName} value={courseName}>{courseName}</option>
                  ))}
                </select>
              </div>
            </div>
            */}

            {/* Call table with NO filters */}
            <AlumniTable />
          </>
        )}

        {activeTab === "graduates" && <GraduatesList />}
      </section>
    </SidebarLayout>
  );
}

export default AlumniFilters;
