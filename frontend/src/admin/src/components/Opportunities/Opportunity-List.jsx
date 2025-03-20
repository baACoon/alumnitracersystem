import React, { useState, useEffect } from "react";
import styles from "./Opportunity-List.module.css";

export default function OpportunityList() {
    const [publishedOpportunities, setPublishedOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch published opportunities from the backend
    useEffect(() => {
        const fetchPublishedOpportunities = async () => {
            const token = localStorage.getItem("token"); // Ensure token is included
            if (!token) {
                alert("You need to log in first.");
                return;
            }

            try {
                const response = await fetch("https://alumnitracersystem.onrender.com/jobs/jobpost?status=Published", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Failed to fetch published opportunities:", errorData);
                    alert(errorData.message || "Failed to fetch published opportunities.");
                    return;
                }

                const data = await response.json();
                setPublishedOpportunities(data); // Set the fetched opportunities
            } catch (error) {
                console.error("Error fetching published opportunities:", error);
                alert("An error occurred while fetching published opportunities.");
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedOpportunities();
    }, []); // Run only once on component mount

    const handleOpportunityClick = (opportunity) => {
        setSelectedOpportunity(opportunity);
    };

    const closeModal = () => {
        setSelectedOpportunity(null);
    };

    if (loading) {
        return <p>Loading published opportunities...</p>;
    }

    return (
        <div>
            <h2>Published Opportunities</h2>
            <div className={styles.gridContainer}>
                {publishedOpportunities.length > 0 ? (
                    publishedOpportunities.map((opportunity, index) => (
                        <div
                            key={index}
                            className={styles.opportunityBox}
                            onClick={() => handleOpportunityClick(opportunity)}
                        >
                            <p><strong>Company:</strong> {opportunity.company || "N/A"}</p>
                            <p><strong>College:</strong> {opportunity.college || "N/A"}</p>
                            <p><strong>Course:</strong> {opportunity.course || "N/A"}</p>
                            <p><strong>Job Title:</strong> {opportunity.title || "N/A"}</p>
                            <p><strong>Location:</strong> {opportunity.location || "N/A"}</p>
                            <p><strong>Job Type:</strong> {opportunity.type || "N/A"}</p>
                            <p><strong>Source:</strong> {opportunity.source || "N/A"}</p>
                            <p><strong>Job Status:</strong> {opportunity.status || "N/A"}</p>
                            <p><strong>Date Published:</strong> {opportunity.createdAt ? new Date(opportunity.createdAt).toLocaleDateString() : "N/A"}</p>
                        </div>
                    ))
                ) : (
                    <p>No published opportunities found.</p>
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
                        <h2>{selectedOpportunity.title || "N/A"}</h2>
                        <p><strong>Company:</strong> {selectedOpportunity.company || "N/A"}</p>
                        <p><strong>College:</strong> {selectedOpportunity.college || "N/A"}</p>
                        <p><strong>Course:</strong> {selectedOpportunity.course || "N/A"}</p>
                        <p><strong>Location:</strong> {selectedOpportunity.location || "N/A"}</p>
                        <p><strong>Job Type:</strong> {selectedOpportunity.type || "N/A"}</p>
                        <p><strong>Source:</strong> {selectedOpportunity.source || "N/A"}</p>
                        <p><strong>Job Status:</strong> {selectedOpportunity.status || "N/A"}</p>
                        <p>
                            <strong>Date Published:</strong>{" "}
                            {selectedOpportunity.createdAt ? new Date(selectedOpportunity.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                        <p><strong>Job Description:</strong> {selectedOpportunity.description || "N/A"}</p>
                        <p><strong>Key Responsibilities:</strong></p>
                        <ul>
                            {selectedOpportunity.responsibilities && selectedOpportunity.responsibilities.length > 0 ? (
                                selectedOpportunity.responsibilities.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))
                            ) : (
                                <li>N/A</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
