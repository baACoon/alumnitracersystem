import React, { useState } from "react";
import styles from "./Reports-Content.module.css";

export default function ReportsContent()  {
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

  const [detailedAlumniRecords, setDetailedAlumniRecords] = useState([
    { id: 1, name: "John Doe", batch: 2020, course: "CIT", status: "Employed", position: "Software Engineer", company: "TechCorp", location: "New York" },
    { id: 2, name: "Jane Smith", batch: 2019, course: "COE", status: "Unemployed", position: "", company: "", location: "Los Angeles" },
    { id: 3, name: "Emily Davis", batch: 2020, course: "COE", status: "Employed", position: "Teacher", company: "High School", location: "Chicago" },
    // Add more sample data here...
  ]);

  const generateWrittenSummary = () => {
    const totalAlumni = detailedAlumniRecords.length;
    const employed = detailedAlumniRecords.filter((record) => record.status === "Employed").length;
    const unemployed = totalAlumni - employed;

    const employmentRate = ((employed / totalAlumni) * 100).toFixed(2);


    const summary = `
      As of now, a total of ${totalAlumni} alumni records have been documented. Among them, ${employed} (${employmentRate}%) are currently employed, while ${unemployed} are unemployed. 
      The data highlights the employment distribution and survey participation rates, helping the institution track alumni progress effectively.
    `;

    return summary.trim();
  };

  const exportWrittenSummary = () => {
    const summary = generateWrittenSummary();
    const blob = new Blob([summary], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Alumni_Report_Summary.txt";
    link.click();
  };

  return (
    <div className={styles.reports}>
      <div className={styles.filters}>
        <input type="text" placeholder="SEARCH ALUMNI" />
            {/* Filter Controls */}
            <div
                className={styles.filterControls}
                role="group"
                aria-label="Filter controls"
            >
            <div className={styles.filterButtonContainer}>
                <label htmlFor="college" className={styles.filterLabel}>
                    Batch:
                </label>
                <select>
                    <option value="">All Batch</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                </select>
            {/* College Filter */}
            
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
                    {college && coursesByCollege[college].map((courseName) => (
                        <option key={courseName} value={courseName}>
                        {courseName}
                    </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
    <div className={styles.actions}>
        <button onClick={() => handleExport("CSV")}>Export as CSV</button>
        <button onClick={() => handleExport("PDF")}>Export as PDF</button>
        <button onClick={exportWrittenSummary}>Export Written Summary</button>
    </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Batch</th>
            <th>Course</th>
            <th>Employment Status</th>
            <th>Job Position</th>
            <th>Company</th>
            <th>Location</th>
          
          </tr>
        </thead>
        <tbody>
          {detailedAlumniRecords.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.name}</td>
              <td>{record.batch}</td>
              <td>{record.course}</td>
              <td>{record.status}</td>
              <td>{record.position}</td>
              <td>{record.company}</td>
              <td>{record.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
