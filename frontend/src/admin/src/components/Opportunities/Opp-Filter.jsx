import React, { useState, useEffect } from "react";
import styles from "./Opp-Filter.module.css";
import SidebarLayout from "../SideBar/SideBarLayout";
import OpportunityList from "./Opportunity-List";
import OpportunityPending from "./Opportunity-Pending";
import CreateOpportunity from "./Create-Opportunity";

export function OpportunityFilters() {
  const [activeTab, setActiveTab] = useState("published");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [activeFilter, setActiveFilter] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await fetch("https://alumnitracersystem.onrender.com/jobs");
        const data = await response.json();
        console.log("Fetched Opportunities: ", data);
        setOpportunities(data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      }
    };

    fetchOpportunities();
  }, []);

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
    setCourse(""); // reset course when college changes
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
    setActiveFilter("course");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
  };

  // Adjust these field names to match your backend (department = college, program = course)
  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesCollege = college ? opportunity.department === college : true;
    const matchesCourse = course ? opportunity.program === course : true;
    const matchesStatus =
      activeTab === "published"
        ? opportunity.status === "Published"
        : opportunity.status === "Pending";

    return matchesCollege && matchesCourse && matchesStatus;
  });

  return (
    <SidebarLayout>
      <section className={styles.filterSection} aria-label="Opportunity filters">
        <div className={styles.header}>
          <h2 className={styles.databaseTitle}>OPPORTUNITY DATABASE</h2>
          <button className={styles.createButton} onClick={handleCreateClick}>
            + Create Opportunity
          </button>
        </div>

        {/* Filter Controls */}
        <div className={styles.filterControls} role="group" aria-label="Filter controls">
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

        {/* Tabs */}
        <div className={styles.viewToggle} role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "published"}
            className={`${styles.tab} ${activeTab === "published" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("published")}
          >
            PUBLISHED
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "pending"}
            className={`${styles.tab} ${activeTab === "pending" ? styles.activeTab : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            PENDING
          </button>
        </div>

        {/* Conditional Views */}
        {activeTab === "published" && <OpportunityList opportunities={filteredOpportunities} />}
        {activeTab === "pending" && <OpportunityPending opportunities={filteredOpportunities} />}

        {/* Modal */}
        {showCreateModal && <CreateOpportunity onClose={closeCreateModal} />}
      </section>
    </SidebarLayout>
  );
}

export default OpportunityFilters;
