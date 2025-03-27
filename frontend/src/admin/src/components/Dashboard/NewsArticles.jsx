import React, { useEffect, useState } from "react";
import styles from "./NewsArticles.module.css";


export default function NewsArticles() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);  
  const [loading, setLoading] = useState(false);  



  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch("https://alumnitracersystem.onrender.com/artcileroutes/");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Submit form to add or update article
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true); 

    try {
      const url = editId
        ? `https://alumnitracersystem.onrender.com/artcileroutes/update/${editId}`
        : "https://alumnitracersystem.onrender.com/artcileroutes/add";
      const method = editId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);  
        setIsMessageModalOpen(true);
        setTitle("");
        setContent("");
        setImage(null);
        setEditId(null);
        setShowFormModal(false);
        fetchArticles();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (error) {
      setMessage("Error: Unable to connect to server");
    }
  };

  // Delete article
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/artcileroutes/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchArticles();
      } else {
        setMessage(data.message || "Error occurred");
      }
    } catch (error) {
      setMessage("Error: Unable to connect to server");
    } finally {
      setLoading(false);  
    }
  };

  // Edit article
  const handleEdit = (article) => {
    setTitle(article.title);
    setContent(article.content);
    setEditId(article._id);
    setShowFormModal(true);
  };

  // Open modal for full article
  const openArticleModal = (article) => {
    setSelectedArticle(article);
  };

  // Close modals
  const closeFormModal = () => {
    setShowFormModal(false);
    setEditId(null);
    setTitle("");
    setContent("");
    setImage(null);
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
  };

    const closeMessageModal = () => {
      setIsMessageModalOpen(false); 
    };


  return (
    <div className={styles.container}>
      <h1>MANAGE ARTICLES</h1>

      <button onClick={() => setShowFormModal(true)} className={styles.createButton}>
        + Create Article
      </button>

      <div className={styles.articlesGrid}>
        {articles.map((article) => (
            <div key={article._id} className={styles.articleBox}>
            <h3>{article.title}</h3>
            {article.image && (
                <img
                src={article.image}
                alt={article.title}
                className={styles.articleImage}
                />
            )}
            <p>{article.content.slice(0, 100)}...</p>
            <button
                className={styles.editButton}
                onClick={(e) => {
                e.stopPropagation();
                handleEdit(article);
                }}
            >
                Edit
            </button>
            <button
                className={styles.deleteButton}
                onClick={(e) => {
                e.stopPropagation();
                handleDelete(article._id);
                }}
            >
                Delete
            </button>
            </div>
        ))}
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeFormModal}>
              &times;
            </button>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title</label>
                    <input
                    id="title"
                    type="text"
                    className={styles.formInput}
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="content">Content</label>
                    <textarea
                    id="content"
                    className={styles.formTextarea}
                    placeholder="Enter article content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="image">Image</label>
                    <input
                    id="image"
                    type="file"
                    className={styles.formFile}
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    {editId ? "Update Article" : "Add Article"}
                </button>
            </form>
          </div>
        </div>
      )}

            {/* Loading Indicator */}
            {loading && (
              <div className={styles.bg}>
                <div className={styles.loading}></div>
              </div>
            )}

            {/* Success Modal for Success Message */}
            {isMessageModalOpen && (
              <div className={styles.successModalOverlay}>
                <div className={styles.successModalContent}>
                  <div className={styles.successModalHeader}>
                    <div className={styles.successCheckmark}>✔️</div>
                  </div>
                  <div className={styles.successModalBody}>
                    <h2>Success!</h2>
                    <p>{message}</p>
                    <button className={styles.successOkButton} onClick={closeMessageModal}>OK</button>
                  </div>
                </div>
              </div>

      )}



      {/* Article Modal */}
        {selectedArticle && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={closeArticleModal}>
                &times;
            </button>
            <h2>{selectedArticle.title}</h2>
            {selectedArticle.image && (
                <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className={styles.fullArticleImage}
                />
            )}
            <p>{selectedArticle.content}</p>
            
            <div className={styles.modalActions}>
                <button
                    className={styles.editButton}
                    onClick={() => {
                    handleEdit(selectedArticle);
                    closeArticleModal();
                    }}
                >
                    Edit
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={() => {
                    handleDelete(selectedArticle._id);
                    closeArticleModal();
                    }}
                >
                    Delete
                </button>
                </div>

            </div>
        </div>
        )}
    </div>
  );
}
