import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './jobpagegive.css';
import './jobpagemodal.css';

import Header from '../Header/header';
import Footer from '../FooterClient/Footer';

function JobPageGive() {
  return (
    <div>
      <Header />
      <JobGiveMainPage />
      <Footer />
    </div>
  );
}

function JobGiveMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending,Published',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch jobs:', errorData);
        alert(errorData.message || 'Failed to fetch jobs.');
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error('Unexpected API response format:', data);
        alert('Failed to fetch jobs: Invalid response format.');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('An error occurred while fetching jobs.');
    } finally {
      setShowDeleteModal(false);  
      setSelectedJobId(null);     
      setSelectedJob(null);      
      console.log("Delete modal closed and job deleted.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedJobId) return;
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('You need to log in first.');
      return;
    }
  
    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${selectedJobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete job:', errorData);
        alert(errorData.message || 'Failed to delete job.');
        return;
      }
  
      // After successful deletion from the database, update the UI
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== selectedJobId));
  
      alert('Job deleted successfully.');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job.');
    } finally {
      // Close the modal and reset the selectedJobId
      setShowDeleteModal(false);
      setSelectedJobId(null);
    }
  };
  
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(() => {
      fetchJobs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const goToAddJob = () => {
    navigate('/JobPageGive/addjobForm');
  };

  return (
    <div className="givecontainer">
      <a className="back-button" onClick={() => navigate('/JobPage')}>
        Back
      </a>
      <div className="title-container">
        <h1 className="give-title">OPPORTUNITIES POSTED</h1>
        <button className="add-button" onClick={goToAddJob}>
          ADD
        </button>
      </div>

      {/*  Show Loading Animation */}
      {loading ? (
        <div className="loadingOverlay">
          <div className="loaderContainer">
            <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
              <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
              <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
            </svg>
            <p>Loading....</p>
          </div>
        </div>
      ) : (
        <>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className={`giveoption ${job.status === 'Published' ? 'published-highlight' : ''}`}
                onClick={() => {
                  setSelectedJob(job);
                  setShowJobModal(true);
                }}
              >
                <h4 className={`give-status ${job.status === 'Published' ? 'published' : 'pending'}`}>
                  {job.status.toUpperCase()}
                </h4>
                <div className="give-details">
                  <h3>{job.title}</h3>
                  <h5>{job.location}</h5>
                  <h5>{job.type}</h5>
                </div>
                <FontAwesomeIcon
                  icon={faTrashCan}
                  className="JobPageGiveIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedJobId(job._id);  // Set selected job ID
                    setSelectedJob(job);        // Set the selected job for the modal
                    setShowDeleteModal(true); 
                  }}
                />
              </div>
            ))
          ) : (
            <p>No opportunities found.</p>
          )}
        </>
      )}

      {showJobModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedJob.title}</h2>
            <p><strong>College:</strong> {selectedJob.college || 'N/A'}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Job Status:</strong> {selectedJob.status}</p>
            <p><strong>Date Published:</strong> {selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Job Description:</strong> {selectedJob.description}</p>
            <p><strong>Key Responsibilities:</strong></p>
            <ul>
              {selectedJob.responsibilities?.map((resp, index) => (
                <li key={index}>{resp}</li>
              )) || <li>N/A</li>}
            </ul>
            <p><strong>Qualifications:</strong> {selectedJob.qualifications}</p>
            <p><strong>Souce:</strong> {selectedJob.source}</p>
            <button className= "closejobmodal" onClick={() => setShowJobModal(false)}>Close</button>
          </div>
        </div>
      )}

          {showDeleteModal && selectedJob && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Are you sure you want to delete this post?</h2>
                <p>{selectedJob.title}</p>
                <div className='delmodal-btn'>
                  <button className='yesdel-btn' onClick={handleDelete}>Yes, Delete</button>
                  <button className='canceldel-btn' onClick={() => setShowDeleteModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}


    </div>
  );
}

export default JobPageGive;
