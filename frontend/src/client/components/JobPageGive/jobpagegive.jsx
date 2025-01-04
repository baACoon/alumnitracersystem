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

  // Fetch published jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token'); // Ensure token is included

      if (!token) {
        alert('You need to log in first.');
        return;
      }

      try {
        const response = await fetch('https://alumnitracersystem.onrender.com/jobs/jobpost?status=Published', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in headers
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to fetch published jobs:', errorData);
          alert(errorData.message || 'Failed to fetch published jobs.');
          return;
        }

        const data = await response.json();
        setJobs(data); // Set the fetched jobs in the state
      } catch (error) {
        console.error('Error fetching published jobs:', error);
        alert('An error occurred while fetching published jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const goToJobPage = () => {
    navigate('/JobPage');
  };

  const goToAddJob = () => {
    navigate('/JobPageGive/addjobForm');
  };

  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to log in first.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete job:', errorData);
        alert(errorData.message || 'Failed to delete job.');
        return;
      }

      alert('Job deleted successfully.');
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job.');
    }
  };

  if (loading) {
    return <p>Loading jobs...</p>;
  }

  return (
    <div className="givecontainer">
      <a onClick={goToJobPage} className="back-button">
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
          <div key={job._id} className="giveoption">
            <h4 className="give-status">POSTED</h4>
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
        <p>No published opportunities found.</p>
      )}
    </div>
  );
}

export default JobPageGive;
