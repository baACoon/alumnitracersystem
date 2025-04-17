import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./jobpagelist.css";
import Header from "../Header/header";
import Footer from "../FooterClient/Footer";
import axios from "axios";

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
  const [course, setCourse] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

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
    if (course) {
      updated = updated.filter((job) => job.course === course);
    }
    setFilteredJobs(updated);
  }, [college, course, jobs]);

  return (
    <div className="listcontainer">
      <a onClick={goToJobPage} className="back-button">
        Back
      </a>
      <h1 className="list-title">JOB OPPORTUNITIES FEED</h1>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="college">College:</label>
          <select
            id="college"
            value={college}
            onChange={(e) => {
              setCollege(e.target.value);
              setCourse("");
            }}
          >
            <option value="">All Colleges</option>
            {Object.keys(coursesByCollege).map((collegeName) => (
              <option key={collegeName} value={collegeName}>{collegeName}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="course">Course:</label>
          <select
            id="course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            disabled={!college}
          >
            <option value="">All Courses</option>
            {college &&
              coursesByCollege[college].map((courseName) => (
                <option key={courseName} value={courseName}>{courseName}</option>
              ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loadingOverlay">
          <div className="loaderContainer">
            <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
              <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
              <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
            </svg>
            <p>Loading...</p>
          </div>
        </div>
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

      {/* Modal */}
      {selectedJob && (
        <div className="eventModal">
          <div className="eventModalContent">
            <span className="closeButton" onClick={() => setSelectedJob(null)}>
              &times;
            </span>

            {/* Date and Title */}
            <p className="job-date">
              {selectedJob.createdAt
                ? new Date(selectedJob.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })
                : "N/A"}
            </p>
            <h2 className="job-title">{selectedJob.title}</h2>
            <h4 className="job-subheader">
              {selectedJob.company} &nbsp;&nbsp;
              <span className="job-type">{selectedJob.type}</span>
            </h4>

            {/* Job Description */}
            <h4 className="job-label">Job Description</h4>
            <div className="job-section">
              <p>{selectedJob.jobDescription || "No description provided."}</p>
            </div>

            {/* Responsibilities and Qualifications (Side-by-Side) */}
            <div className="job-2col-wrapper">
              <div className="job-col-wrapper">
                <h4 className="job-label">Key Responsibilities</h4>
                <div className="job-col">
                  <ul>
                    {selectedJob.responsibilities?.length > 0 ? (
                      selectedJob.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))
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

            {/* More Info */}
            <h4 className="job-label">More Information</h4>
            <div className="job-section">
              <a
                href={selectedJob.source}
                className="job-link"
                target="_blank"
                rel="noreferrer"
              >
                {selectedJob.source}
              </a>
            </div>

            {/* Footer */}
            <div className="job-section">
              <p><strong>Status:</strong> {selectedJob.status}</p>
              <p><strong>College:</strong> {selectedJob.college || "N/A"}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default JobPageList;
