import React, { useState } from "react";
import "./alumnidatabase.css"; // Adjust the path if necessary
import AdminHeader from "../header/header";

const AlumniDatabase = () => {
  const [activeTab, setActiveTab] = useState("registeredAlumni"); // Tracks active tab
  const [selectedBatch, setSelectedBatch] = useState(null); // Tracks selected batch
  const [batch, setBatch] = useState("2024"); // Tracks selected batch for dropdown
  const [college, setCollege] = useState(""); // Tracks selected college
  const [course, setCourse] = useState(""); // Tracks selected course

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
  
  const handleBatchClick = (batch) => {
    setSelectedBatch(batch); // Set the selected batch for detailed view
  };

  // Tab switching logic
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBatch(null); // Reset selected batch when switching tabs
  };

  // File upload handler
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Imported file:", file);
      // You can process the file here (e.g., upload to server, parse data, etc.)
    }
  };

  // College selection handler
  const handleCollegeChange = (e) => {
    setCollege(e.target.value);
    setCourse(""); // Reset course when college changes
  };
  return (
    <div>
      <AdminHeader username="GARCIA, J." />

      <div className="alumni-database-container">
        <h1>ALUMNI DATABASE</h1>

         {/* Filters Section */}
        <div className="filters">
          {/* Batch Dropdown */}
          <select
            className="filter-dropdown"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => 2024 - i).map((year) => (
              <option key={year} value={year}>
                Batch {year}
              </option>
            ))}
          </select>

          {/* College Dropdown */}
          <select
            className="filter-dropdown"
            value={college}
            onChange={handleCollegeChange}
          >
            <option value="">All Colleges</option>
            {Object.keys(coursesByCollege).map((college) => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>

          {/* Course Dropdown */}
          <select
            className="filter-dropdown"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            disabled={!college} // Disable if no college is selected
          >
            <option value="">Select Course</option>
            {college &&
              coursesByCollege[college].map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
          </select>
        </div>
        
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "registeredAlumni" ? "active" : ""}`}
            onClick={() => handleTabChange("registeredAlumni")}
          >
            REGISTERED ALUMNI
          </button>
          <button
            className={`tab ${activeTab === "listOfGraduates" ? "active" : ""}`}
            onClick={() => handleTabChange("listOfGraduates")}
          >
            LIST OF GRADUATES
          </button>
        </div>

        {/* Conditional Rendering */}
        {activeTab === "registeredAlumni" && !selectedBatch && (
          <div>
            {/* Add content for Registered Alumni */}
            <p>Registered Alumni content here...</p>
          </div>
        )}

        {activeTab === "listOfGraduates" && !selectedBatch && (
          <div className="graduates-container">
            <div className="batches">
              {Array.from({ length: 9 }, (_, i) => i + 2016).map((year) => (
                <button
                  key={year}
                  className="batch-button"
                  onClick={() => handleBatchClick(year)}
                >
                  BATCH {year} LIST OF GRADUATES
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedBatch && (
          <div className="batch-details">
            <h2>BATCH {selectedBatch} LIST OF GRADUATES</h2>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" placeholder="Title" />
              </div>
              <div className="form-group">
                <label htmlFor="file">Import Excel File</label>
                <input
                  type="file"
                  id="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileChange}
                />
              </div>
              <button type="submit" className="save-button">
                SAVE
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniDatabase;