import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegComment, FaRegThumbsUp } from "react-icons/fa";
import styles from "./jobpagelist.module.css";
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
      if (!token) {
        alert('You need to log in first.');
        return;
      }

try {
      const response = await fetch(
        'https://alumnitracersystem.onrender.com/jobs/jobpost?status=Published'
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch jobs:', errorData);
        return;
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };
    fetchJobs();
  }, []);

  const handleCommentSubmit = async (jobId) => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://alumnitracersystem.onrender.com/jobs/${jobId}/comments`,
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

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className={styles.loaderText}>Loading...</div>
        <div className={styles.loaderBar}></div>
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <button onClick={goToJobPage} className={styles.backButton}>
        Back
      </button>
      <h1 className={styles.listTitle}>Job Opportunities Feed</h1>
      {jobs.map((job) => (
        <div key={job.id} className={styles.jobCard}>
          <div className={styles.jobCardHeader}>
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
          <div className={styles.jobCardActions}>
            <div
              className={styles.actionIcon}
              onClick={() => handleLike(job.id)}
            >
              <FaRegThumbsUp /> <span>{likes[job.id] || 0} Likes</span>
            </div>
            <div
              className={styles.actionIcon}
              onClick={() => alert("Open comment input below.")}
            >
              <FaRegComment /> <span>Comment</span>
            </div>
          </div>
          <div className={styles.commentsSection}>
            <h4>Comments</h4>
            {comments[job.id]?.map((comment, index) => (
              <div key={index} className={styles.comment}>
                <p>{comment.text}</p>
                <small>{comment.date}</small>
              </div>
            ))}
            <div className={styles.commentInputContainer}>
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={styles.commentInput}
              />
              <button
                onClick={() => handleCommentSubmit(job.id)}
                className={styles.postButton}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobPageList;
