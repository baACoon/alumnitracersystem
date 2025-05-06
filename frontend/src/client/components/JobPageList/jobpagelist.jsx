import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./jobpagelist.css";
import Header from "../Header/header";
import Footer from "../FooterClient/Footer";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function JobPageList() {
  return (
    <div>
      <Header />
      <JobListMainPage />
      <Footer />
    </div>
  );
}

function JobListMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [college, setCollege] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const coursesByCollege = {
    "College of Engineering": [],
    "College of Science": [],
    "College of Industrial Education": [],
    "College of Liberal Arts": [],
    "College of Architecture and Fine Arts": [],
  };

  const goToJobPage = () => {
    navigate("/JobPage");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "https://alumnitracersystem.onrender.com/jobs/jobpost?status=Published",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let updated = [...jobs];
  
    if (college) {
      updated = updated.filter((job) => job.college === college);
    }
  
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      updated = updated.filter((job) =>
        job.title.toLowerCase().includes(lowerSearch)
      );
    }
  
    setFilteredJobs(updated);
  }, [college, searchTerm, jobs]);
  

  return (
    <div className="listcontainer">
      <a onClick={goToJobPage} className="back-button">Back</a>
      <h1 className="list-title">JOB OPPORTUNITIES FEED</h1>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="college">College:</label>
          <select
            id="college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
          >
            <option value="">All Colleges</option>
            {Object.keys(coursesByCollege).map((collegeName) => (
              <option key={collegeName} value={collegeName}>{collegeName}</option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <label htmlFor="search">Search:</label>
          <input
            id="search"
            type="text"
            placeholder="Search job titles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {loading ? (
        <div className="loadingOverlay">
          <div className="loaderContainer">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <p className="no-jobs-message">No job opportunities found for the selected college.</p>
      ) : (
        filteredJobs.map((job) => (
          <div key={job._id} className="job-card" onClick={() => setSelectedJob(job)}>
            <div className="job-card-header">
              <h3>{job.title}</h3>
              <p>{job.datePosted}</p>
            </div>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <p>{job.jobDescription}</p>
          </div>
        ))
      )}

      {/* Modal remains unchanged */}
      {selectedJob && (
        <div className="eventModal">
          <div className="eventModalContent">
            <span className="closeButton" onClick={() => setSelectedJob(null)}>&times;</span>
            <p className="job-date">
              {selectedJob.createdAt
                ? new Date(selectedJob.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
            <h2 className="job-title">{selectedJob.title}</h2>
            <h4 className="job-subheader">
              {selectedJob.company} <span className="job-type">{selectedJob.type}</span>
            </h4>
            <h4 className="job-description">Job Description</h4>
            <div className="job-section">
              <p>{selectedJob.description || "No description provided."}</p>
            </div>

            <div className="job-image-container">
              <img
                src={selectedJob.image}
                alt="Job Posting"
                className="job-image"
              />
            </div>

            <div className="job-2col-wrapper">
              <div className="job-col-wrapper">
                <h4 className="job-label">Key Responsibilities</h4>
                <div className="job-col">
                  <ul>
                    {selectedJob.responsibilities?.length > 0 ? (
                      selectedJob.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)
                    ) : (
                      <li>N/A</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="job-col-wrapper">
                <h4 className="job-label">Qualifications</h4>
                <div className="job-col">
                  <p>{selectedJob.qualifications || "N/A"}</p>
                </div>
              </div>
            </div>
            <h4 className="job-label">More Information</h4>
            <div className="job-section">
              <a href={selectedJob.source} className="job-link" target="_blank" rel="noreferrer">
                {selectedJob.source}
              </a>
            </div>
            <div className="job-status">
              <p><strong>Status:</strong> {selectedJob.status}</p>
              <p><strong>College:</strong> {selectedJob.college || "N/A"}</p>
              <p><strong>Course:</strong> {selectedJob.course || "N/A"}</p>
              <p><strong>Location:</strong> {selectedJob.location || "N/A"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPageList;
