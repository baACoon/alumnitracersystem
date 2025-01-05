import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './jobpagegive.css';

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
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs with "Pending" status from the backend
  useEffect(() => {
    const fetchPendingJobs = async () => {
      const token = localStorage.getItem('token'); // Include the token in the request

      if (!token) {
        alert('You need to log in first.');
        return;
      }

      try {
        const response = await fetch('https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch pending jobs:', errorData);
          alert(errorData.message || 'Failed to fetch pending jobs.');
          return;
        }

        const data = await response.json();
        setPendingJobs(data); // Store the pending jobs in state
      } catch (error) {
        console.error('Error fetching pending jobs:', error);
        alert('An error occurred while fetching pending jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingJobs();
  }, []);

  const goToAddJob = () => {
    navigate('/JobPageGive/addjobForm');
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

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

      {pendingJobs.length > 0 ? (
        pendingJobs.map((job) => (
          <div key={job._id} className="giveoption-pending">
            <h4 className="give-status-pending">PENDING</h4>
            <div className="give-details">
              <h3>{job.title}</h3>
              <h5>{job.location}</h5>
              <h5>{job.type}</h5>
            </div>
            <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />
          </div>
        ))
      ) : (
        <p>No pending opportunities found.</p>
      )}
    </div>
  );
}

export default JobPageGive;
