import React, { useState, useEffect } from "react";
import styles from "./Opportunity-List.module.css";
import './opplistmodal.css';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function OpportunityList() {
    const [publishedOpportunities, setPublishedOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch published opportunities from the backend
    useEffect(() => {
        const fetchPublishedOpportunities = async () => {
            const token = localStorage.getItem("token"); // Ensure token is included
            if (!token) {
                toast.warning("You need to log in first.");
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
                    toast.error(errorData.message || "Failed to fetch published opportunities.");
                    return;
                }

                const data = await response.json();
                setPublishedOpportunities(data); // Set the fetched opportunities
            } catch (error) {
                console.error("Error fetching published opportunities:", error);
                toast.error("An error occurred while fetching published opportunities.");
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
                            <p><strong>Job Title:</strong> {opportunity.title || "N/A"}</p>
                            <p><strong>Company:</strong> {opportunity.company || "N/A"}</p>
                            <p><strong>College:</strong> {opportunity.college || "N/A"}</p>
                            <p><strong>Course:</strong> {opportunity.course || "N/A"}</p>
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
                            {selectedOpportunity.company || "N/A"} <span className="job-type">{selectedOpportunity.type || "N/A"}</span>
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
                                            selectedOpportunity.responsibilities.map((resp, idx) => <li key={idx}>{resp}</li>)
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

                        <button
                            className="trashButton"
                            onClick={async () => {
                                try {
                                    const token = localStorage.getItem("token");
                                    const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${selectedOpportunity._id}/deny`, {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({ feedback: "Moved to trash from OpportunityList modal." }),
                                    });

                                    if (response.ok) {
                                        toast.success("Moved to trash successfully.");
                                        setPublishedOpportunities((prev) =>
                                            prev.filter((op) => op._id !== selectedOpportunity._id)
                                        );
                                        setSelectedOpportunity(null);
                                    } else {
                                        const data = await response.json();
                                        toast.error(data.message || "Failed to move to trash.");
                                    }
                                } catch (err) {
                                    console.error("Error moving to trash:", err);
                                    toast.error("Server error occurred.");
                                }
                            }}
                        >
                            🗑 Move to Trash
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
