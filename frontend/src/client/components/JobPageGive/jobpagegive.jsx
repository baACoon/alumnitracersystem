import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faCheck } from '@fortawesome/free-solid-svg-icons';
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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs (Pending and Published)
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You need to log in first.');
        return;
      }

      try {
        const response = await fetch(
          'https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending,Published',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch jobs:', errorData);
          alert(errorData.message || 'Failed to fetch jobs.');
          return;
        }

        const data = await response.json();
        setJobs(data); // Store all jobs in state
      } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('An error occurred while fetching jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const approveJob = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first.');
      return;
    }

    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${jobId}/approve`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to approve job.');
        return;
      }

      const updatedJob = await response.json();

      // Update job status in the state
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, status: 'Published' } : job
        )
      );
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job.');
    }
  };

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

      {/* Display Jobs */}
      {jobs.map((job) => (
        <div
          key={job._id}
          className={job.status === 'Pending' ? 'giveoption-pending' : 'giveoption'}
        >
          <h4
            className={
              job.status === 'Pending'
                ? 'give-status-pending'
                : 'give-status'
            }
          >
            {job.status.toUpperCase()}
          </h4>
          <div className="give-details">
            <h3>{job.title}</h3>
            <h5>{job.location}</h5>
            <h5>{job.type}</h5>
          </div>
          {job.status === 'Pending' && (
            <FontAwesomeIcon
              icon={faCheck}
              className="JobPageGiveIcon"
              onClick={() => approveJob(job._id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default JobPageGive;
