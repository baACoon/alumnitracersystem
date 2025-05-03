import React, { useState, useEffect } from "react";
import styles from "./Opportunity-List.module.css";
import './opplistmodal.css';
import './trashbtn.css'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function OpportunityList() {
    const [publishedOpportunities, setPublishedOpportunities] = useState([]);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedOpportunity, setEditedOpportunity] = useState({});


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


    const handleEditSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`https://alumnitracersystem.onrender.com/jobs/${editedOpportunity._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedOpportunity),
            });

            if (response.ok) {
                toast.success("Opportunity updated successfully.");
                setPublishedOpportunities(prev =>
                    prev.map(op => op._id === editedOpportunity._id ? editedOpportunity : op)
                );
                setEditMode(false);
            } else {
                toast.error("Failed to update opportunity.");
            }
        } catch (err) {
            console.error("Error updating opportunity:", err);
            toast.error("Server error occurred.");
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
            {selectedOpportunity && (
                <div className="eventModal" onClick={closeModal}>
                    <div className="eventModalContent" onClick={(e) => e.stopPropagation()}>
                        <span className="closeButton" onClick={closeModal}>&times;</span>

                        {editMode ? (
                            <>
                                <input value={editedOpportunity.title} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, title: e.target.value })} />
                                <input value={editedOpportunity.company} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, company: e.target.value })} />
                                <textarea value={editedOpportunity.description} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, description: e.target.value })}></textarea>
                                <input value={editedOpportunity.college} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, college: e.target.value })} />
                                <input value={editedOpportunity.course} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, course: e.target.value })} />
                                <input value={editedOpportunity.location} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, location: e.target.value })} />
                                <input value={editedOpportunity.type} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, type: e.target.value })} />
                                <input value={editedOpportunity.source} onChange={(e) => setEditedOpportunity({ ...editedOpportunity, source: e.target.value })} />
                                <button className="saveButton" onClick={handleEditSave}>📂 Save</button>
                            </>
                        ) : (
                            <>
                                <h2 className="job-title">{selectedOpportunity.title}</h2>
                                <p>{selectedOpportunity.description}</p>
                                <p><strong>Company:</strong> {selectedOpportunity.company}</p>
                                <p><strong>College:</strong> {selectedOpportunity.college}</p>
                                <p><strong>Course:</strong> {selectedOpportunity.course}</p>
                                <p><strong>Location:</strong> {selectedOpportunity.location}</p>
                                <p><strong>Type:</strong> {selectedOpportunity.type}</p>
                                <p><strong>Source:</strong> {selectedOpportunity.source}</p>
                                <button className="editButton" onClick={() => setEditMode(true)}>✏️ Edit</button>
                            </>
                        )}

                        <button className="trashButton" onClick={async () => {
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
                                    setPublishedOpportunities(prev =>
                                        prev.filter(op => op._id !== selectedOpportunity._id)
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
                        }}>
                            🗑 Move to Trash
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
