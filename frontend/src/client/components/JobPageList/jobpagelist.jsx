import React, { useState, useEffect } from 'react';
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
  const [jobs, setJobs] = useState([]);

  const goToJobPage = () => {
    navigate('/JobPage');
  };

  useEffect(() => {
    const fetchJobs = async () => {
        try {
            const response = await axios.get('/api/jobs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };
    fetchJobs();
}, []);

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
