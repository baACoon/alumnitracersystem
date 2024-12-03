import React from 'react';
import { useNavigate } from 'react-router-dom';
import './addjobForm.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';

function AddJobForm() {
  return (
    <div>
      <Header />
      <AddjobFormMainPage />
    </div>
  );
}

function AddjobFormMainPage() {
    const navigate = useNavigate();

    const goToJobPageGive = () => {
      navigate('/JobPageGive');
    };


    return (
        <div className="form-container">
          <a onClick={goToJobPageGive} className="back-button">Back</a>
          <h1 className="form-title">POST A JOB OPPORTUNITY</h1>
          <form className="opportunity-form">
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input type="text" id="title" name="title" placeholder="Enter job title" />
            </div>
            <div className="form-group">
              <label htmlFor="company">Company:</label>
              <input type="text" id="company" name="company" placeholder="Enter company name" />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input type="text" id="location" name="location" placeholder="Enter job location" />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select id="type" name="type">
                <option value="full-time">Full Time</option>
                <option value="part-time">Part Time</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="job-description">Job Description:</label>
              <textarea id="job-description" name="job-description" placeholder="Enter job description"></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="responsibilities">Key Responsibilities:</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                placeholder="Enter key responsibilities"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="qualification">Qualification:</label>
              <textarea
                id="qualification"
                name="qualification"
                placeholder="Enter required qualifications"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="source">Source:</label>
              <input type="text" id="source" name="source" placeholder="Enter the source or link" />
            </div>
            <button type="submit" className="submit-button">Submit</button>
            <p className="form-note">
              NOTE: When submitted, an admin will review the request to post the offer. You will get
              notified regarding the status of your post.
            </p>
          </form>
        </div>
      );
}

export default AddJobForm;
