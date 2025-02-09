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

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You need to log in first.");
      return;
    }
  
    try {
      //  Get the logged-in user ID from the token
      const userResponse = await fetch(
        "https://alumnitracersystem.onrender.com/record/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!userResponse.ok) {
        console.error("Failed to fetch user data");
        return;
      }
  
      const userData = await userResponse.json();
      const userId = userData._id; // Assume _id is the user ID
  
      // 2️⃣ Get only the jobs posted by the logged-in user
      const jobsResponse = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending,Published&userId=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (!jobsResponse.ok) {
        const errorData = await jobsResponse.json();
        console.error("Failed to fetch jobs:", errorData);
        alert(errorData.message || "Failed to fetch jobs.");
        return;
      }
  
      const jobsData = await jobsResponse.json();
      
      // Filter jobs where the owner is the logged-in user
      const userJobs = jobsData.filter((job) => job.userId === userId);
      setJobs(userJobs);
  
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("An error occurred while fetching jobs.");
    } finally {
      setLoading(false);
    }
  };
  
  

  // Delete Job Functionality
  const handleDelete = async (jobId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You need to log in first.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

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
        const errorData = await response.json();
        console.error('Failed to delete job:', errorData);
        alert(errorData.message || 'Failed to delete job.');
        return;
      }

      alert('Job deleted successfully.');

      // Update the state to remove the deleted job
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred while deleting the job.');
    }
  };

  useEffect(() => {
    fetchJobs();

    // Optional: Set up polling to auto-refresh jobs every 10 seconds
    const interval = setInterval(() => {
      fetchJobs();
    }, 10000);

    return () => clearInterval(interval); // Clear the interval on unmount
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

      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job.id}
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
              onClick={() => handleDelete(job.id)}
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