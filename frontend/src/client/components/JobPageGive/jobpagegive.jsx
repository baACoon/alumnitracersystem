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
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs with both "Pending" and "Published" statuses
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
        setJobs(data); // Store all jobs in a single list
      } catch (error) {
        console.error('Error fetching jobs:', error);
        alert('An error occurred while fetching jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
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

      {/* Display All Jobs */}
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job._id}
            className={`giveoption ${job.status === 'Published' ? 'published-highlight' : ''}`}
          >
            <h4 className={`give-status ${job.status === 'Published' ? 'published' : 'pending'}`}>
              {job.status.toUpperCase()}
            </h4>
            <div className="give-details">
              <h3>{job.title}</h3>
              <h5>{job.location}</h5>
              <h5>{job.type}</h5>
            </div>
            <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />
          </div>
        ))
      ) : (
        <p>No opportunities found.</p>
      )}
    </div>
  );
}

export default JobPageGive;
