function JobListMainPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});

  const goToJobPage = () => {
    navigate("/JobPage");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "https://alumnitracersystem.onrender.com/jobs/jobpost?status=Published",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
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

  return (
    <div className={styles.listContainer}>
      <button onClick={goToJobPage} className={styles.backButton}>
        Back
      </button>
      <h1 className={styles.listTitle}>Job Opportunities Feed</h1>
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className={styles.jobCard}>
            <div className={styles.jobCardHeader}>
              <h3>{job.title}</h3>
              <p>{new Date(job.datePosted).toLocaleDateString()}</p>
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
                onClick={() => handleLike(job._id)}
              >
                <FaRegThumbsUp /> <span>{likes[job._id] || 0} Likes</span>
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
              {comments[job._id]?.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <p>{comment.text}</p>
                  <small>{new Date(comment.date).toLocaleDateString()}</small>
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
                  onClick={() => handleCommentSubmit(job._id)}
                  className={styles.postButton}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No published opportunities available.</p>
      )}
    </div>
  );
}
