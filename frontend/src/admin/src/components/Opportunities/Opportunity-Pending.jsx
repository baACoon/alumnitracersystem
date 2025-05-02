import React, { useState, useEffect } from "react";
import styles from "./Opportunity-Pending.module.css";
import './opplistmodal.css'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OpportunityPending() {
  const [pendingOpportunities, setPendingOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);


  useEffect(() => {
    const fetchPendingOpportunities = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.warning("You need to log in first.");
        return;
      }

      try {
        const response = await fetch(
          "https://alumnitracersystem.onrender.com/jobs/jobpost?status=Pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to fetch pending opportunities:", errorData);
          toast.error(errorData.message || "Failed to fetch pending opportunities.");
          return;
        }

        const data = await response.json();
        setPendingOpportunities(data);
      } catch (error) {
        console.error("Error fetching pending opportunities:", error);
        toast.error("An error occurred while fetching pending opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOpportunities();
  }, []);

  const handlePublishClick = async () => {
    if (!selectedOpportunity) return;
  
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You need to log in first.");
      return;
    }
  
    setIsPublishing(true); // Start loading
  
    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${selectedOpportunity._id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to publish opportunity:", errorText);
        toast.error("Failed to publish opportunity.");
        return;
      }
  
      toast.success("Opportunity published successfully!");
      setPendingOpportunities((prev) =>
        prev.filter((opportunity) => opportunity._id !== selectedOpportunity._id)
      );
      setSelectedOpportunity(null);
    } catch (error) {
      console.error("Error publishing opportunity:", error);
      toast.error("An error occurred while publishing the opportunity.");
    } finally {
      setIsPublishing(false); // Stop loading
    }
  };
  

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handleRejectionSubmit = async () => {
    if (!selectedOpportunity) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You need to log in first.");
      return;
    }

    try {
      const response = await fetch(
        `https://alumnitracersystem.onrender.com/jobs/${selectedOpportunity._id}/deny`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ feedback: rejectionReason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to reject opportunity:", errorData);
        toast.error(errorData.message || "Failed to reject opportunity.");
        return;
      }

      toast.success(`Opportunity rejected for the following reason: ${rejectionReason}`);
      setPendingOpportunities((prev) =>
        prev.filter((opportunity) => opportunity._id !== selectedOpportunity._id)
      );
      setRejectionReason("");
      setShowRejectionForm(false);
      setSelectedOpportunity(null);
    } catch (error) {
      console.error("Error rejecting opportunity:", error);
      toast.error("An error occurred while rejecting the opportunity.");
    }
  };

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowRejectionForm(false);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
    setShowRejectionForm(false);
  };

  if (loading) {
    return <p>Loading pending opportunities...</p>;
  }

  return (
    <div>
      <h2>Pending Opportunities</h2>
      <div className={styles.gridContainer}>
        {pendingOpportunities.length > 0 ? (
          pendingOpportunities.map((opportunity) => (
            <div
              key={opportunity._id}
              className={styles.opportunityBox}
              onClick={() => handleOpportunityClick(opportunity)}
            >
              <p>
                <strong>Job Title:</strong> {opportunity.title}
              </p>
              <p>
                <strong>Status:</strong> {opportunity.status}
              </p>
            </div>
          ))
        ) : (
          <p>No pending opportunities found.</p>
        )}
      </div>

      {selectedOpportunity && (
          <div className="eventModal" onClick={closeModal}>
            <div className="eventModalContent" onClick={(e) => e.stopPropagation()}>
              <span className="closeButton" onClick={closeModal}>
                &times;
              </span>

              <p className="job-date">
                {selectedOpportunity.createdAt
                  ? new Date(selectedOpportunity.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>

              <h2 className="job-title">{selectedOpportunity.title || "N/A"}</h2>
              <h4 className="job-subheader">
                {selectedOpportunity.company || "N/A"}{" "}
                <span className="job-type">{selectedOpportunity.type || "N/A"}</span>
              </h4>

              <h4 className="job-description">Job Description</h4>
              <div className="job-section">
                <p>{selectedOpportunity.description || "No description provided."}</p>
              </div>

              <div className="job-2col-wrapper">
                <div className="job-col-wrapper">
                  <h4 className="job-label">Key Responsibilities</h4>
                  <div className="job-col">
                    <ul>
                      {selectedOpportunity.responsibilities?.length > 0 ? (
                        selectedOpportunity.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))
                      ) : (
                        <li>N/A</li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="job-col-wrapper">
                  <h4 className="job-label">Qualifications</h4>
                  <div className="job-col">
                    <p>{selectedOpportunity.qualifications || "N/A"}</p>
                  </div>
                </div>
              </div>

              <h4 className="job-label">More Information</h4>
              <div className="job-section">
                <a
                  href={selectedOpportunity.source || "#"}
                  className="job-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedOpportunity.source || "N/A"}
                </a>
              </div>

              <div className="job-status">
                <p><strong>Status:</strong> {selectedOpportunity.status || "N/A"}</p>
                <p><strong>College:</strong> {selectedOpportunity.college || "N/A"}</p>
                <p><strong>Course:</strong> {selectedOpportunity.course || "N/A"}</p>
                <p><strong>Location:</strong> {selectedOpportunity.location || "N/A"}</p>
              </div>

              <div className="buttonContainer">
                <button className="rejectButton" onClick={handleRejectClick}>
                  Reject
                </button>
                <button className="publishButton" onClick={handlePublishClick} disabled={isPublishing}>
                  {isPublishing ? "Publishing..." : "Publish"}
                </button>
              </div>

              {showRejectionForm && (
                <div className="rejectionForm">
                  <textarea
                    className="rejectionTextarea"
                    placeholder="Enter rejection reason..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  ></textarea>
                  <button
                    className="submitRejectionButton"
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
