import React, { useState, useEffect } from "react";
import styles from "./Opportunity-List.module.css";
import './opplistmodal.css';
import './trashbtn.css';
import './editbtn.css';
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function OpportunityList() {
    const [publishedOpportunities, setPublishedOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // State to track edit modal
    const [updatedOpportunity, setUpdatedOpportunity] = useState({}); // To store the updated values


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

    const handleEditButtonClick = () => {
        setUpdatedOpportunity({
            title: selectedOpportunity.title,
            company: selectedOpportunity.company,
            location: selectedOpportunity.location,
            type: selectedOpportunity.type,
            description: selectedOpportunity.description,
            responsibilities: selectedOpportunity.responsibilities,
            qualifications: selectedOpportunity.qualifications,
            source: selectedOpportunity.source,
            college: selectedOpportunity.college,
            course: selectedOpportunity.course,
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedOpportunity({
            ...updatedOpportunity,
            [name]: value,
        });
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("You need to log in first.");
            return;
        }

        try {
            const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${selectedOpportunity._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedOpportunity),
            });

            if (!response.ok) {
                throw new Error('Failed to update job post');
            }

            const updatedJob = await response.json();
            toast.success("Job updated successfully.");
            setPublishedOpportunities((prev) => 
                prev.map((job) => job._id === updatedJob._id ? updatedJob : job)
            );
            setIsEditModalOpen(false);
            setSelectedOpportunity(updatedJob);
        } catch (error) {
            toast.error(error.message || 'Error updating job post.');
        }
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
            {selectedOpportunity && !isEditModalOpen && (
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
                        
                        <button onClick={handleEditButtonClick}>Edit</button>
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
                                        body: JSON.stringify({ feedback: "Moved to trash from Published" }),
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

                {isEditModalOpen && (
                <div className="editModalOverlay" onClick={closeModal}>
                    <div className="editModalContent" onClick={(e) => e.stopPropagation()}>
                        <span className="closeEditButton" onClick={() => setIsEditModalOpen(false)}>
                            &times;
                        </span>

                        <h2>Edit Job Post</h2>
                        <input
                            type="text"
                            name="title"
                            value={updatedOpportunity.title || ''}
                            onChange={handleInputChange}
                            placeholder="Job Title"
                            className="editInput"
                        />
                        <input
                            type="text"
                            name="company"
                            value={updatedOpportunity.company || ''}
                            onChange={handleInputChange}
                            placeholder="Company"
                            className="editInput"
                        />
                        <textarea
                            name="description"
                            value={updatedOpportunity.description || ''}
                            onChange={handleInputChange}
                            placeholder="Job Description"
                            className="editTextarea"
                        />
                        {/* Add more fields here like responsibilities, qualifications, etc. */}
                        <button onClick={handleSaveEdit} className="saveEditButton">Save Changes</button>
                    </div>
                </div>
            )}

        </div>
    );
}
