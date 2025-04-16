import React, { useState, useEffect } from "react";
import styles from "./AlumniFilters.module.css";
import { AlumniTable } from "../Table/AlumniTable";
import { GraduatesList } from "../BatchList/GraduatesList";
import SidebarLayout from "../../SideBar/SideBarLayout";
import { Search, ChevronDown } from "lucide-react"; // Import icons if available

const batchYears = Array.from({ length: 10 }, (_, i) => 2016 + i);

const colleges = [
  "College of Engineering",
  "College of Science",
  "College of Industrial Technology",
  "College of Liberal Arts",
  "College of Architecture and Fine Arts"
];

const courses = {
  "College of Engineering": [
    "Bachelor of Science in Civil Engineering",
    "Bachelor of Science in Electrical Engineering",
    "Bachelor of Science in Electronics Engineering",
    "Bachelor of Science in Mechanical Engineering"
  ],
  "College of Science": [
    "Bachelor of Applied Science in Laboratory Technology",
    "Bachelor of Science in Computer Science"
  ],
  "College of Industrial Technology": [
    "Bachelor of Engineering Technology",
    "Bachelor of Technical Teacher Education"
  ],
  "College of Liberal Arts": [
    "Bachelor of Arts in Communication",
    "Bachelor of Arts in Political Science"
  ],
  "College of Architecture and Fine Arts": [
    "Bachelor of Science in Architecture",
    "Bachelor of Fine Arts"
  ]
};


export function AlumniFilters() {
  const [activeTab, setActiveTab] = useState("registered");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    batchYear: "",
    college: "",
    course: ""
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const queryParams = new URLSearchParams();
      if (filters.batchYear) queryParams.append('batch', filters.batchYear);
      if (filters.college) queryParams.append('college', filters.college);
      if (filters.course) queryParams.append('course', filters.course);


  // Handle filter changes
  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [type]: value };
      if (type === "college") {
        // Reset course when college changes
        newFilters.course = "";
      }
      return newFilters;
    });
  };

  // Apply filters
  const applyFilters = () => {
    const newActiveFilters = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newActiveFilters.push({ type: key, value });
      }
    });
    setActiveFilters(newActiveFilters);
    setShowFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      batchYear: "",
      college: "",
      course: ""
    });
    setActiveFilters([]);
  };

  // Remove specific filter
  const removeFilter = (type) => {
    setFilters(prev => ({ ...prev, [type]: "" }));
    setActiveFilters(prev => prev.filter(filter => filter.type !== type));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <SidebarLayout>
      <section className={styles.filterSection} aria-label="Alumni filters">
        <h2 className={styles.databaseTitle}>ALUMNI MANAGEMENT</h2>
  
        <div className={styles.mainContent}>
          <div className={styles.tabAndSearchContainer}>
            <div className={styles.viewToggle} role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === "registered"}
                className={`${styles.tab} ${activeTab === "registered" ? styles.activeTab : ""}`}
                onClick={() => handleTabChange("registered")}
              >
                REGISTERED ALUMNI
                {activeFilters.length > 0 && (
                  <span className={styles.filterBadge}>{activeFilters.length}</span>
                )}
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
              <div className={styles.searchAndFilterContainer}>
                <div className={styles.searchContainer}>
                  <span className={styles.searchIcon}>
                    <Search size={16} />
                  </span>
                  <input
                    type="search"
                    placeholder="Search alumni..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
  
                <div className={styles.filterButtonWrapper}>
                  <button
                    className={styles.filterButton}
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <span>Filters</span>
                    <span className={styles.filterIcon}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
  
                  {showFilters && (
                    <div className={styles.filterPopover}>
                      <h4 className={styles.filterTitle}>Filter Alumni</h4>
                      <div className={styles.filterDivider}></div>
  
                      <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Batch Year</label>
                        <select
                          className={styles.filterSelect}
                          value={filters.batchYear}
                          onChange={(e) => handleFilterChange("batchYear", e.target.value)}
                        >
                          <option value="">Select batch year</option>
                          {batchYears.map((year) => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                      </div>
  
                      <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>College</label>
                        <select
                          className={styles.filterSelect}
                          value={filters.college}
                          onChange={(e) => handleFilterChange("college", e.target.value)}
                        >
                          <option value="">Select college</option>
                          {colleges.map((college) => (
                            <option key={college} value={college}>{college}</option>
                          ))}
                        </select>
                      </div>
  
                      <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Course</label>
                        <select
                          className={styles.filterSelect}
                          value={filters.course}
                          onChange={(e) => handleFilterChange("course", e.target.value)}
                          disabled={!filters.college}
                        >
                          <option value="">Select course</option>
                          {filters.college && courses[filters.college] &&
                            courses[filters.college].map((course) => (
                              <option key={course} value={course}>{course}</option>
                            ))}
                        </select>
                      </div>
  
                      <div className={styles.filterActions}>
                        <button className={styles.resetButton} onClick={resetFilters}>
                          Reset Filters
                        </button>
                        <button className={styles.applyButton} onClick={applyFilters}>
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
  
          {activeTab === "registered" && (
            <>
              {activeFilters.length > 0 && (
                <div className={styles.activeFiltersBar}>
                  <div className={styles.activeFiltersList}>
                    {activeFilters.map((filter) => (
                      <div key={filter.type} className={styles.filterBadgeOutline}>
                        {filter.type === "batchYear" && `Year: ${filter.value}`}
                        {filter.type === "college" && `College: ${filter.value}`}
                        {filter.type === "course" && `Course: ${filter.value}`}
                        <button
                          className={styles.removeFilterButton}
                          onClick={() => removeFilter(filter.type)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {activeFilters.length > 0 && (
                      <button
                        className={styles.clearAllButton}
                        onClick={resetFilters}
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </div>
              )}
              <AlumniTable 
                searchQuery={searchQuery}
                batch={filters.batchYear}
                college={filters.college}
                course={filters.course}
              />
            </>
          )}
  
          {activeTab === "graduates" && <GraduatesList />}
        </div>
      </section>
    </SidebarLayout>
  );  
}

export default AlumniFilters;