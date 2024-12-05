import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import styles from './AlumniFilters.module.css';
import { AlumniTable } from '../Table/AlumniTable';
import { GraduatesList } from '../BatchList/GraduatesList';

export function AlumniFilters() {

  const [activeTab, setActiveTab] = useState('registered');
  const [batch, setBatch] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  // College and course mappings
  const coursesByCollege = {
    COE: ["BSCE", "BSEE", "BSME"],
    CAFA: ["BSA", "BFA", "BGT major in AT", "BGT major in ID", "BGT major in MDT"],
    CLA: ["BSBM major in IM", "BSE", "BS HM"],
    CIE: [
      "BS IE major in ICT",
      "BS IE major in HE",
      "BS IE major in IA",
      "BTVTE major in ANIMATION",
      "BTVTE major in AUTOMATIVE",
      "BTVTE major in BCW",
      "BTVTE major in CP",
      "BTVTE major in ELECTRONIC",
      "BTVTE major in FSM",
      "BTVTE major in FG",
      "BTVTE major in HVAC",
    ],
    COS: ["BASLT", "BSCS", "BSES", "BSIS", "BSIT"],
    CIT: [
      "BSFT",
      "BET major in CT",
      "BET major in ET",
      "BET major in CET",
      "BET major in ECT",
      "BET major in ICT",
      "BET major in MT",
      "BET major in RT",
      "BTAF",
      "BTCT",
      "BTPT",
    ],
  };

  const handleBatchChange = (e) => {
    setBatch(e.target.value);
    setActiveFilter('batch');
  };

  const handleCollegeChange = (e) => {
    setCollege(e.target.value);
    setActiveFilter('college');
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    setActiveFilter('course');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section className={styles.filterSection} aria-label="Alumni filters">
      <h2 className={styles.databaseTitle}>ALUMNI DATABASE</h2>
  
      {/* Filter Controls - Keep existing code */}
      <div className={styles.filterControls} role="group" aria-label="Filter controls">
        {/* Batch Filter */}
        <div className={styles.filterButtonContainer}>
          <select
            className={`${styles.filterButton} ${activeFilter === 'batch' ? styles.filterButtonActive : ''}`}
            value={batch}
            onChange={handleBatchChange}
            aria-label="Select Batch"
          >
            {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                Batch {year}
                <FontAwesomeIcon icon={faCaretDown} className={styles.filterIcon} aria-hidden="true" />
              </option>
            ))}
          </select>
        </div>
  
        {/* College Filter */}
        <div className={styles.filterButtonContainer}>
          <select
            className={`${styles.filterButton} ${activeFilter === 'college' ? styles.filterButtonActive : ''}`}
            value={college}
            onChange={handleCollegeChange}
            aria-label="Select College"
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
          <select
            className={`${styles.filterButton} ${activeFilter === 'course' ? styles.filterButtonActive : ''}`}
            value={course}
            onChange={handleCourseChange}
            aria-label="Select Course"
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
  );
}

export default AlumniFilters;