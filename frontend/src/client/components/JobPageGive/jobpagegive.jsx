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
  const [pendingJobs, setPendingJobs] = useState([]);
  const [publishedJobs, setPublishedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setPendingJobs(data.filter((job) => job.status === 'Pending'));
        setPublishedJobs(data.filter((job) => job.status === 'Published'));
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
      setPendingJobs((prev) => prev.filter((job) => job._id !== jobId));
      setPublishedJobs((prev) => [...prev, updatedJob]);
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job.');
    }
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
      </div>

      <h2 className="section-title">Pending Opportunities</h2>
      {pendingJobs.length > 0 ? (
        pendingJobs.map((job) => (
          <div key={job._id} className="giveoption-pending">
            <h4 className="give-status-pending">PENDING</h4>
            <div className="give-details">
              <h3>{job.title}</h3>
              <h5>{job.location}</h5>
              <h5>{job.type}</h5>
            </div>
            <FontAwesomeIcon
              icon={faCheck}
              className="approve-icon"
              onClick={() => approveJob(job._id)}
            />
          </div>
        ))
      ) : (
        <p>No pending opportunities found.</p>
      )}

      <h2 className="section-title">Published Opportunities</h2>
      {publishedJobs.length > 0 ? (
        publishedJobs.map((job) => (
          <div key={job._id} className="giveoption-published">
            <h4 className="give-status-published">PUBLISHED</h4>
            <div className="give-details">
              <h3>{job.title}</h3>
              <h5>{job.location}</h5>
              <h5>{job.type}</h5>
            </div>
          </div>
        ))
      ) : (
        <p>No published opportunities found.</p>
      )}
    </div>
  );
}

export default JobPageGive;
