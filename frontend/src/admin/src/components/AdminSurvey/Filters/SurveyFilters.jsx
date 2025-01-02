import React, { useState } from 'react';
import styles from './SurveyFilters.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { SurveyTable } from '../Table/SurveyTable'; // Existing tab content
import { PendingSurvey } from '../Table/PendingSurvey'; // Pending tab content

export const SurveyFilters = () => {
  const [activeTab, setActiveTab] = useState('existing'); // Manage active tab state
  const [activeFilter, setActiveFilter] = useState(null);
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
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

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setActiveFilter('year');
  };
  const handleCollegeChange = (e) => {
    setCollege(e.target.value);
    setActiveFilter('college');
  };

  return (
    <section className={styles.filterSection} role="search" aria-label="Survey filters">
      {/* Filter Buttons */}

      <div className={styles.filterButtons} role = "group" aria-label="Filter Controls" >
        <div className={styles.filterButtonContainer}>
          <select
              className={`${styles.filterButton} ${activeFilter === 'year' ? styles.filterButtonActive : ''}`}
              value={year}
              onChange={handleYearChange}
              aria-label='All year'>

                {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
                  <option key={year} value={year}>
                    Year {year}
                    <FontAwesomeIcon icon={faCaretDown} className={styles.filterIcon} aria-hidden="true" />
                  </option>
                ))

                }
          </select>
        </div>

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
        
      </div>

      {/* Tabs Section */}
      <div className={styles.tabSection}>
        <div className={styles.tabs} role="tablist">
          {/* Existing Tab */}
          <button
            role="tab"
            aria-selected={activeTab === 'existing'}
            className={`${styles.tab} ${activeTab === 'existing' ? styles.active : ''}`}
            onClick={() => setActiveTab('existing')}
            id="existing-tab"
            aria-controls="existing-panel"
          >
            EXISTING
          </button>

          {/* Pending Tab */}
          <button
            role="tab"
            aria-selected={activeTab === 'pending'}
            className={`${styles.tab} ${activeTab === 'pending' ? styles.active : ''}`}
            onClick={() => setActiveTab('pending')}
            id="pending-tab"
            aria-controls="pending-panel"
          >
            PENDING
          </button>
        </div>

        <button className={styles.addButton} aria-label="Add new survey">
          +
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'existing' && <SurveyTable />}
        {activeTab === 'pending' && <PendingSurvey />}
      </div>
    </section>
  );
};
