import React, { useState } from "react";
import styles from "./Opportunity-Pending.module.css";

export default function OpportunityPending() {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const examplePendingOpportunities = [
    {
      jobId: "REQ001",
      alumniId: "ALUM789",
      adminId: "ADM003",
      college: "College of Liberal Arts",
      jobTitle: "Marketing Specialist",
      location: "Davao, Philippines",
      jobStatus: "Pending Approval",
      dateRequested: "2024-12-10",
      jobDescription: "Develop marketing strategies to promote company services.",
      keyResponsibilities: [
        "Plan and execute marketing campaigns.",
        "Analyze market trends to identify opportunities.",
        "Collaborate with sales teams to drive growth."
      ],
      requirements: [
        "Bachelor's degree in Marketing or related field.",
        "1+ year of experience in marketing.",
        "Proficiency in social media management and analytics tools."
      ]
    },
    {
      jobId: "REQ002",
      alumniId: "ALUM321",
      adminId: "ADM004",
      college: "College of Architecture and Fine Arts",
      jobTitle: "Architectural Draftsman",
      location: "Quezon City, Philippines",
      jobStatus: "Pending Approval",
      dateRequested: "2024-12-05",
      jobDescription: "Create detailed architectural drawings and plans.",
      keyResponsibilities: [
        "Prepare architectural drafts using CAD software.",
        "Coordinate with architects and engineers on project details.",
        "Ensure compliance with building codes and regulations."
      ],
      requirements: [
        "Bachelor's degree in Architecture or related field.",
        "Proficiency in AutoCAD and SketchUp.",
        "Strong attention to detail and accuracy."
      ]
    }
  ];

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
  };

  const handleRejectClick = () => {
    setShowRejectionForm(true);
  };

  const handlePublishClick = () => {
    alert("Opportunity published successfully!");
    setSelectedOpportunity(null);
  };

  const handleRejectionSubmit = () => {
    alert(`Opportunity rejected for the following reason: ${rejectionReason}`);
    setRejectionReason("");
    setShowRejectionForm(false);
    setSelectedOpportunity(null);
  };

  const closeModal = () => {
    setSelectedOpportunity(null);
    setShowRejectionForm(false);
  };

  return (
    <div>
      <h2>Pending Opportunities</h2>
      <div className={styles.gridContainer}>
        {examplePendingOpportunities.map((opportunity, index) => (
          <div
            key={index}
            className={styles.opportunityBox}
            onClick={() => handleOpportunityClick(opportunity)}
          >
            <p><strong>College:</strong> {opportunity.college}</p>
            <p><strong>Job Title:</strong> {opportunity.jobTitle}</p>
            <p><strong>Location:</strong> {opportunity.location}</p>
            <p><strong>Job Status:</strong> {opportunity.jobStatus}</p>
            <p><strong>Date Requested:</strong> {opportunity.dateRequested}</p>
          </div>
        ))}
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
            <h2>{selectedOpportunity.jobTitle}</h2>
            <p><strong>College:</strong> {selectedOpportunity.college}</p>
            <p><strong>Job ID:</strong> {selectedOpportunity.jobId}</p>
            <p><strong>Alumni ID:</strong> {selectedOpportunity.alumniId}</p>
            <p><strong>Admin ID:</strong> {selectedOpportunity.adminId}</p>
            <p><strong>Location:</strong> {selectedOpportunity.location}</p>
            <p><strong>Job Status:</strong> {selectedOpportunity.jobStatus}</p>
            <p><strong>Date Requested:</strong> {selectedOpportunity.dateRequested}</p>
            <p><strong>Job Description:</strong> {selectedOpportunity.jobDescription}</p>
            <p><strong>Key Responsibilities:</strong></p>
            <ul>
              {selectedOpportunity.keyResponsibilities.map((resp, i) => (
                <li key={i}>{resp}</li>
              ))}
            </ul>
            <p><strong>Requirements:</strong></p>
            <ul>
              {selectedOpportunity.requirements.map((req, i) => (
                <li key={i}>{req}</li>
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
