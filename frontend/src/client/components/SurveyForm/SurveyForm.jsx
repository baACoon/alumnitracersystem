import React, { useState, useEffect } from "react";
import './surveyform.css';
import Header from "../Header/header";
import Sidebar from "../Sidebar/sidebar";

function SurveyForm() {
  return (
    <div>
      <Header />
      <Sidebar />
      <SurveyFormPage />
    </div>
  );
}

function SurveyFormPage() {
  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format

  return (
    <div className="survey-container">
      <div className="logo-background"></div>
      <h1>Tracer Survey Form (2024)</h1>
      <form action="process_survey.php" method="post">
        {/* Date Field */}
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" value={currentDate} readOnly />
        </div>

        {/* Occupation Field */}
        <div className="form-group">
          <label htmlFor="occupation">Occupation:</label>
          <input type="text" id="occupation" name="occupation" required />
        </div>

        {/* Company Name Field */}
        <div className="form-group">
          <label htmlFor="company_name">Company Name:</label>
          <input type="text" id="company_name" name="company_name" required />
        </div>

        {/* Year Started Field */}
        <div className="form-group">
          <label htmlFor="year_started">Year Started in the Company (Date of Employment):</label>
          <input type="text" id="year_started" name="year_started" required />
        </div>

        {/* Position Field */}
        <div className="form-group">
          <label htmlFor="position">Position / Designation:</label>
          <input type="text" id="position" name="position" required />
        </div>

        {/* Job Status Select Dropdown */}
        <div className="form-group">
          <label htmlFor="job_status">Job Status:</label>
          <div className="select-box">
            <select id="job_status" name="job_status" required>
              <option value="Permanent">Permanent</option>
              <option value="Contractual">Contractual / Project Based</option>
              <option value="Temporary">Temporary</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>
        </div>

        {/* Type of Organization Select Dropdown */}
        <div className="form-group">
          <label htmlFor="type_of_organization">Type of Organization:</label>
          <div className="select-box">
            <select id="type_of_organization" name="type_of_organization" required>
              <option value="Private">Private</option>
              <option value="Non-Government">Non-Government Organization</option>
              <option value="Self-Employed">Self-Employed</option>
            </select>
          </div>
        </div>

        {/* Work Alignment Select Dropdown */}
        <div className="form-group">
          <label htmlFor="work_alignment">Is your current work aligned with your academic specialization?</label>
          <div className="select-box">
            <select id="work_alignment" name="work_alignment" required>
              <option value="Very much aligned">Very much aligned</option>
              <option value="Aligned">Aligned</option>
              <option value="Averagely Aligned">Averagely Aligned</option>
              <option value="Somehow Aligned">Somehow Aligned</option>
              <option value="Unaligned">Unaligned</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="survey-form-button-container">
          <button className="surveyform-btn" type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default SurveyForm;
