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
        alert(errorData.message || 'Failed to fetch jobs.');
        return;
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('An error occurred while fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!selectedJobId || !token) return;

    try {
      const res = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${selectedJobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete job');

      setJobs((prev) => prev.filter((j) => j._id !== selectedJobId));
      setShowDeleteModal(false);
      setSelectedJobId(null);
    } catch (err) {
      alert('Error deleting job.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const goToAddJob = () => navigate('/JobPageGive/addjobForm');

  return (
    <div className="givecontainer">
      <a className="back-button" onClick={() => navigate('/JobPage')}>
        Back
      </a>

      <div className="title-container">
        <h1 className="give-title">OPPORTUNITIES POSTED</h1>
        <button className="add-button" onClick={goToAddJob}>ADD</button>
      </div>

      {loading ? (
        <div className="loadingOverlay">
          <p>Loading...</p>
        </div>
      ) : jobs.length > 0 ? (
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
                setSelectedJobId(job._id);
                setSelectedJob(job);
                setShowDeleteModal(true);
              }}
            />
          </div>
        ))
      ) : (
        <p>No job posts found for your account.</p>
      )}

      {/* View Job Modal */}
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
            <p><strong>Source:</strong> {selectedJob.source}</p>
            <button className="closejobmodal" onClick={() => setShowJobModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to delete this post?</h2>
            <p>{selectedJob.title}</p>
            <div className="delmodal-btn">
              <button className="yesdel-btn" onClick={handleDelete}>Yes, Delete</button>
              <button className="canceldel-btn" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobPageGive;
