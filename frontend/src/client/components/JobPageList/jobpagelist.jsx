import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./jobpagelist.css";
import Header from "../Header/header";
import Footer from "../FooterClient/Footer";
import axios from "axios";

function JobPageList() {
  return (
    <div>
      <Header />
      <JobListMainPage />
      <Footer />
    </div>
  );
}

function JobListMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});

  
  const goToJobPage = () => {
    navigate('/JobPage');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("https://alumnitracersystem.onrender.com/jobs/jobpost", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleCommentSubmit = async (jobId) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5050/jobs/${jobId}/comments`,
        { comment: newComment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setComments((prevComments) => ({
        ...prevComments,
        [jobId]: [...(prevComments[jobId] || []), response.data],
      }));
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="listcontainer">
      <a onClick={goToJobPage} className="back-button">Back</a>
      <h1 className="list-title">Job Opportunities Feed</h1>
      {jobs.map((job) => (
        <div key={job.id} className="job-card">
          <div className="job-card-header">
            <h3>{job.title}</h3>
            <p>{job.datePosted}</p>
          </div>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p>{job.jobDescription}</p>
          <div className="comments-section">
            <h4>Comments</h4>
            {comments[job.id]?.map((comment, index) => (
              <div key={index} className="comment">
                <p>{comment.text}</p>
                <small>{comment.date}</small>
              </div>
            ))}
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => handleCommentSubmit(job.id)}>Post</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobPageList;
