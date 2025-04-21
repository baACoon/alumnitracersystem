import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './jobpagegive.css';

function JobPageGive() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // should be MongoDB _id

    if (!token || !userId) {
      alert('You need to log in first.');
      return;
    }

    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending,Published&createdBy=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!selectedJobId || !token) return;

    try {
      const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${selectedJobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');

      setJobs((prev) => prev.filter((job) => job._id !== selectedJobId));
      alert('Deleted successfully');
    } catch (err) {
      alert('Error deleting job');
    } finally {
      setShowDeleteModal(false);
      setSelectedJobId(null);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="givecontainer">
      <h1 className="give-title">OPPORTUNITIES POSTED</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className={`giveoption ${job.status === 'Published' ? 'published-highlight' : ''}`}
          >
            <h4>{job.status}</h4>
            <div className="give-details">
              <h3>{job.title}</h3>
              <p>{job.location}</p>
              <p>{job.type}</p>
            </div>
            <FontAwesomeIcon icon={faTrashCan} onClick={() => {
              setSelectedJobId(job._id);
              setSelectedJob(job);
              setShowDeleteModal(true);
            }} />
          </div>
        ))
      )}

      {showDeleteModal && (
        <div className="modal">
          <p>Are you sure you want to delete {selectedJob?.title}?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeleteModal(false)}>No</button>
        </div>
      )}
    </div>
  );
}

export default JobPageGive;