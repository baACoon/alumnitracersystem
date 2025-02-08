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

  useEffect(() => {
    // Get user credentials from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    // If user is not logged in, redirect to login page
    if (!token || !userId || !userRole) {
      console.warn('User not logged in. Redirecting to login page...');
      navigate('/login');
      return;
    }

    fetchJobs(token, userId, userRole);
  }, []);

  const fetchJobs = async (token, userId, userRole) => {
    try {
      let url = `https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending,Published`;

      // If user is not an admin, only show their own jobs
      if (userRole !== 'admin') {
        url += `&createdBy=${userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch jobs:', errorData);
        return;
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${jobId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Failed to delete job');
        return;
      }

      alert('Job deleted successfully.');
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
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
            <FontAwesomeIcon
              icon={faTrashCan}
              className="JobPageGiveIcon"
              onClick={() => handleDelete(job._id)}
            />
          </div>
        ))
      ) : (
        <p>No opportunities found.</p>
      )}
    </div>
  );
}

export default JobPageGive;
