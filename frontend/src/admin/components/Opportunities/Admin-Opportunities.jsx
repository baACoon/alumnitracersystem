import React, { useState } from 'react';

import styles from "./Admin-Opportunities.module.css";
import SidebarLayout from "../SideBar/SideBarLayout";

const colleges = {
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

const Opportunities = () => {
  const [selectedCollege, setSelectedCollege] = useState("All Colleges");
  const [selectedCourse, setSelectedCourse] = useState("Select Course");

  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
    setSelectedCourse("Select Course"); // Reset course when college changes
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  return (
    <SidebarLayout>
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <h1>Opportunities</h1>
          <select
            className={styles.select}
            value={selectedCollege}
            onChange={handleCollegeChange}
          >
            <option value="All Colleges">All Colleges</option>
            {Object.keys(colleges).map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
          <select
            className={styles.select}
            value={selectedCourse}
            onChange={handleCourseChange}
            disabled={selectedCollege === "All Colleges"}
          >
            <option value="Select Course">Select Course</option>
            {selectedCollege !== "All Colleges" &&
              colleges[selectedCollege].map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
          </select>
        </div>
        <button className={styles.createButton}>Create</button>
      </div>
      <div className={styles.opportunitiesList}>
        {/* Add logic here to filter and display job opportunities based on the selected filters */}
        <p>Filter results will appear here based on the selected college and course.</p>
      </div>
    </div>
    </SidebarLayout>
  );
};

export default Opportunities;
