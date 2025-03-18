import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
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
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);

  const goToJobPage = () => {
    navigate("/JobPage");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "https://localhost:5050/jobs/jobpost?status=Published",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        
        setJobs(response.data);
        setLoading(false); // Set loading to false after jobs are fetched
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };
    fetchJobs();
  }, []);

  const handleCommentSubmit = async (jobId) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://localhost:5050/jobs/${jobId}/comments`,
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

  const handleLike = (jobId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [jobId]: (prevLikes[jobId] || 0) + 1,
    }));
  };

  return (
    <div className="listcontainer">
    <a onClick={goToJobPage} className="back-button">
      Back
    </a>
    <h1 className="list-title">JOB OPPORTUNITIES FEED</h1>

    {/* 🔄 Show Loading Animation */}
    {loading ? (
      <div className="loadingOverlay">
        <div className="loaderContainer">
          <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
            <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
            <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
          </svg>
          <p>Loading...</p>
        </div>
      </div>
    ) : (
      jobs.map((job) => (
        <div key={job.id} className="job-card">
          <div className="job-card-header">
            <h3>{job.title}</h3>
            <p>{job.datePosted}</p>
          </div>
          <p>
            <strong>Company:</strong> {job.company}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Type:</strong> {job.type}
          </p>
          <p>{job.jobDescription}</p>
          <div className="job-card-actions">
            <div className="action-icon" onClick={() => handleLike(job.id)}>
              <FaRegThumbsUp /> <span>{likes[job.id] || 0} Likes</span>
            </div>
            <div
              className="action-icon"
              onClick={() => alert("Open comment input below.")}
            >
              <FaRegComment /> <span>Comment</span>
            </div>
          </div>
          <div className="comments-section">
            <h4>Comments</h4>
            {comments[job.id]?.map((comment, index) => (
              <div key={index} className="comment">
                <p>{comment.text}</p>
                <small>{comment.date}</small>
              </div>
            ))}
            <div className="comment-input-container">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button 
                className="post-button"
                onClick={() => handleCommentSubmit(job.id)}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>
);
}

export default JobPageList;