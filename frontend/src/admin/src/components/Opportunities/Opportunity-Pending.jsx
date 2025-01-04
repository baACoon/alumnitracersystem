import React, { useState, useEffect } from "react";
import styles from "./Opportunity-Pending.module.css";

export default function OpportunityPending() {
  const [pendingOpportunities, setPendingOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch pending opportunities from the backend
  useEffect(() => {
      const fetchPendingOpportunities = async () => {
          const token = localStorage.getItem("token");
          if (!token) {
              alert("You need to log in first.");
              return;
          }

          try {
              const response = await fetch("https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending", {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  },
              });

              if (!response.ok) {
                  const errorData = await response.json();
                  console.error("Failed to fetch pending opportunities:", errorData);
                  alert(errorData.message || "Failed to fetch pending opportunities.");
                  return;
              }

              const data = await response.json();
              setPendingOpportunities(data);
          } catch (error) {
              console.error("Error fetching pending opportunities:", error);
              alert("An error occurred while fetching pending opportunities.");
          } finally {
              setLoading(false);
          }
      };

      fetchPendingOpportunities();
  }, []);

  const handlePublishClick = async () => {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // Debugging

    try {
        const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${selectedOpportunity._id}/approve`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to publish opportunity:", errorData);
            alert(errorData.message || "Failed to publish opportunity.");
            return;
        }

        alert("Opportunity published successfully!");
    } catch (error) {
        console.error("Error publishing opportunity:", error);
        alert("An error occurred while publishing the opportunity.");
    }
};

  const handleOpportunityClick = (opportunity) => {
      setSelectedOpportunity(opportunity);
  };

  const closeModal = () => {
      setSelectedOpportunity(null);
  };

  if (loading) {
      return <p>Loading pending opportunities...</p>;
  }

  return (
      <div>
          <h2>Pending Opportunities </h2>
          <div className={styles.gridContainer}>
              {pendingOpportunities.length > 0 ? (
                  pendingOpportunities.map((opportunity) => (
                      <div
                          key={opportunity._id}
                          className={styles.opportunityBox}
                          onClick={() => handleOpportunityClick(opportunity)}
                      >
                          <p><strong>Job Title:</strong> {opportunity.title}</p>
                          <p><strong>Status:</strong> {opportunity.status}</p>
                      </div>
                  ))
              ) : (
                  <p>No pending opportunities found.</p>
              )}
          </div>


      {/* Modal */}
      {selectedOpportunity && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <button className={styles.closeButton} onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedOpportunity.title}</h2>
            <p><strong>College:</strong> {selectedOpportunity.college}</p>
            <p><strong>Location:</strong> {selectedOpportunity.location}</p>
            <p><strong>Job Status:</strong> {selectedOpportunity.status}</p>
            <p><strong>Date Requested:</strong> {new Date(selectedOpportunity.createdAt).toLocaleDateString()}</p>
            <p><strong>Job Description:</strong> {selectedOpportunity.description}</p>
            <p><strong>Key Responsibilities:</strong></p>
            <ul>
              {selectedOpportunity.responsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
            <div className={styles.buttonContainer}>
              <button className={styles.rejectButton} onClick={handleRejectClick}>
                Reject
              </button>
              <button className={styles.publishButton} onClick={handlePublishClick}>
                Publish
              </button>
            </div>
            {showRejectionForm && (
              <div className={styles.rejectionForm}>
                <textarea
                  className={styles.rejectionTextarea}
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                ></textarea>
                <button
                  className={styles.submitRejectionButton}
                  onClick={handleRejectionSubmit}
                >
                  Submit Rejection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
