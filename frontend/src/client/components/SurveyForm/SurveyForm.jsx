import React, {useState, useEffect} from "react";
import './surveyform.css'
import Header from "../Header/header";
import Sidebar from "../Sidebar/sidebar";


function SurveyForm () {
    return(
        <div>
            <Header/>
            <Sidebar/>
            <SurveyFormPage/>
        </div>
    )
}


function SurveyFormPage () {

    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
  
    return (
      <div className="survey-container">
        <div className="logo-background"></div>
        <h1>Tracer Survey Form (2024)</h1>
        <form action="process_survey.php" method="post">
          <div className="form-group">
            <label htmlFor="date">Date:</label>
            <input type="date" id="date" name="date" value={currentDate} readOnly />
          </div>
  
          <div className="form-group">
            <label htmlFor="occupation">Occupation:</label>
            <input type="text" id="occupation" name="occupation" required />
          </div>
  
          <div className="form-group">
            <label htmlFor="company_name">Company Name:</label>
            <input type="text" id="company_name" name="company_name" required />
          </div>
  
          <div className="form-group">
            <label htmlFor="year_started">Year Started in the Company (Date of Employment):</label>
            <input type="text" id="year_started" name="year_started" required />
          </div>
  
          <div className="form-group">
            <label htmlFor="position">Position / Designation:</label>
            <input type="text" id="position" name="position" required />
          </div>
  
          <div className="form-group">
            <label>Job Status:</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="job_status" value="Permanent" required /> Permanent
              </label>
              <label>
                <input type="radio" name="job_status" value="Contractual" required /> Contractual / Project Based
              </label>
              <label>
                <input type="radio" name="job_status" value="Temporary" required /> Temporary
              </label>
              <label>
                <input type="radio" name="job_status" value="Unemployed" required /> Unemployed
              </label>
            </div>
          </div>
  
          <div className="form-group">
            <label>Type of Organization:</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="type_of_organization" value="Private" required /> Private
              </label>
              <label>
                <input type="radio" name="type_of_organization" value="Non-Government" required /> Non-Government Organization
              </label>
              <label>
                <input type="radio" name="type_of_organization" value="Temporary" required /> Temporary
              </label>
              <label>
                <input type="radio" name="type_of_organization" value="Self-Employed" required /> Self-Employed
              </label>
            </div>
          </div>
  
          <div className="form-group">
            <label htmlFor="supervisor_name">Name of Immediate Supervisor:</label>
            <input type="text" id="supervisor_name" name="supervisor_name" required />
          </div>
  
          <div className="form-group">
            <label htmlFor="supervisor_contact">Contact No. / Email of Immediate Supervisor:</label>
            <input type="text" id="supervisor_contact" name="supervisor_contact" required />
          </div>
  
          <div className="form-group">
            <label>Is your current work aligned with your academic specialization?</label>
            <div className="radio-group">
              <label>
                <input type="radio" name="work_alignment" value="Very much aligned" required /> Very much aligned
              </label>
              <label>
                <input type="radio" name="work_alignment" value="Aligned" required /> Aligned
              </label>
              <label>
                <input type="radio" name="work_alignment" value="Averagely Aligned" required /> Averagely Aligned
              </label>
              <label>
                <input type="radio" name="work_alignment" value="Somehow Aligned" required /> Somehow Aligned
              </label>
              <label>
                <input type="radio" name="work_alignment" value="Unaligned" required /> Unaligned
              </label>
            </div>
          </div>
  
          <div className="survey-form-button-container">
            <button className="surveyform-btn"type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  };

export default SurveyForm