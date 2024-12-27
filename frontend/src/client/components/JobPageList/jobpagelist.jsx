import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './jobpagelist.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import axios from 'axios';

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
  const [selectedJob, setSelectedJob] = useState(null);

  const goToJobPage = () => {
    navigate('/JobPage');
  };

  const jobs = [
    {
      title: "Front End Developer",
      datePosted: "September 8, 2024",
      company: "Tech Solutions Inc.",
      location: "Makati City",
      type: "Full Time",
      jobDescription: `We are looking for a Front-End Developer with expertise in React, HTML, CSS, and JavaScript. You'll be responsible for creating user-friendly interfaces and ensuring an exceptional user experience.`,
      keyResponsibilities: [
        "Develop responsive web interfaces.",
        "Collaborate with designers and back-end developers.",
        "Optimize performance across different browsers and devices.",
      ],
      qualifications: [
        "Bachelor's degree in Computer Science or related field.",
        "Experience with modern JavaScript libraries (React, Angular).",
        "Strong understanding of responsive design principles.",
      ],
      source: "https://www.example.com/job/front-end-developer",
    },
    {
      title: "Back End Developer",
      datePosted: "October 15, 2024",
      company: "Innovate Tech",
      location: "Quezon City",
      type: "Part Time",
      jobDescription: `We are looking for a Back-End Developer to build and maintain scalable APIs and server-side applications.`,
      keyResponsibilities: [
        "Design and implement RESTful APIs.",
        "Manage database systems and optimize queries.",
        "Collaborate with front-end teams to integrate systems.",
      ],
      qualifications: [
        "Proficiency in Node.js or Python.",
        "Experience with SQL and NoSQL databases.",
        "Knowledge of cloud-based deployment (AWS, Azure).",
      ],
      source: "https://www.example.com/job/back-end-developer",
    },
  ];

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  return (
    <div className="listcontainer">
      <a onClick={goToJobPage} className="back-button">Back</a>
      <h1 className="list-title">OPPORTUNITIES</h1>
      {jobs.map((job, index) => (
        <div
          key={index}
          className="listoption"
          onClick={() => handleJobClick(job)}
        >
          <div className="list-details">
            <h3>{job.title}</h3>
            <h5>{job.location}</h5>
            <h5>{job.type}</h5>
          </div>
          <h4 className="list-date">{job.datePosted}</h4>
        </div>
      ))}

      {selectedJob && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeModal}>&times;</span>
            <div className='jobtitle-date'>
              <h2>{selectedJob.title}</h2>
              <p><strong>Date Posted:</strong> {selectedJob.datePosted}</p>
            </div>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Type:</strong> {selectedJob.type}</p>
            <p><strong>Job Description:</strong> {selectedJob.jobDescription}</p>
            <p><strong>Key Responsibilities:</strong></p>
            <ul>
              {selectedJob.keyResponsibilities.map((responsibility, idx) => (
                <li key={idx}>{responsibility}</li>
              ))}
            </ul>
            <p><strong>Qualifications:</strong></p>
            <ul>
              {selectedJob.qualifications.map((qualification, idx) => (
                <li key={idx}>{qualification}</li>
              ))}
            </ul>
            <p><strong>Source:</strong> <a href={selectedJob.source} target="_blank" rel="noopener noreferrer">{selectedJob.source}</a></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPageList;
