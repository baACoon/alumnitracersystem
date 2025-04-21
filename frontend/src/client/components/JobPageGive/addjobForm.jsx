import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './addjobForm.css';
import Header from '../Header/header';
import Footer from '../FooterClient/Footer';
import axios from 'axios';

function AddJobForm() {
    return (
        <div>
            <Header />
            <AddjobFormMainPage />
            <Footer />
        </div>
    );
}

function AddjobFormMainPage() {
    const navigate = useNavigate();
    const [tracer2Completed, setTracer2Completed] = useState(null);
    const [loading, setLoading] = useState(true);

    const goToJobPageGive = () => {
        navigate('/JobPageGive');
    };

    const coursesByCollege = {
        "College of Engineering": [
            "Bachelor of Science in Civil Engineering",
            "Bachelor of Science in Electrical Engineering",
            "Bachelor of Science in Electronics Engineering",
            "Bachelor of Science in Mechanical Engineering",
        ],
        "College of Science": [
            "Bachelor of Applied Science in Laboratory Technology",
            "Bachelor of Science in Computer Science",
            "Bachelor of Science in Environmental Science",
            "Bachelor of Science in Information System",
            "Bachelor of Science in Information Technology",
        ],
        "College of Industrial Education": [
            "Bachelor of Science Industrial Education Major in Information and Communication Technology",
            "Bachelor of Science Industrial Education Major in Home Economics",
            "Bachelor of Science Industrial Education Major in Industrial Arts",
        ],
        "College of Liberal Arts": [
            "Bachelor of Science in Business Management Major in Industrial Management",
            "Bachelor of Science in Entrepreneurship",
            "Bachelor of Science in Hospitality Management",
        ],
        "College of Architecture and Fine Arts": [
            "Bachelor of Science in Architecture",
            "Bachelor of Fine Arts",
            "Bachelor of Graphic Technology Major in Architecture Technology",
        ],
    };

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        type: 'full-time',
        description: '',
        responsibilities: '',
        qualifications: '',
        source: '',
        college: '',
        course: '',
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        const checkTracer2Completion = async () => {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            try {
                const response = await axios.get(
                    `https://alumnitracersystem.onrender.com/tracerSurvey2/user-status/${userId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );                  
                setTracer2Completed(response.data.status.tracer2Completed);
            } catch (err) {
                console.error("Failed to check Tracer 2 status:", err);
                setTracer2Completed(false);
            } finally {
                setLoading(false);
            }
        };

        checkTracer2Completion();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "college" ? { course: "" } : {}),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to log in first');
            return;
        }

        try {
            const response = await fetch("https://alumnitracersystem.onrender.com/jobs/jobpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Failed to post the job.');
                return;
            }

            setMessage('Job posted successfully. Pending admin approval.');
            setFormData({
                title: '',
                company: '',
                location: '',
                type: 'full-time',
                description: '',
                responsibilities: '',
                qualifications: '',
                source: '',
                college: '',
                course: '',
            });
        } catch (error) {
            console.error('Error posting the job:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!tracer2Completed) {
        return (
            <div className="form-container">
                <h2>You must complete Tracer Survey 2 before posting a job.</h2>
                <a className="back-button" onClick={() => navigate('/TracerSurvey2')}>
                    Go to Tracer Survey 2
                </a>
            </div>
        );
    }

    return (
        <div className="form-container">
            <a onClick={goToJobPageGive} className="back-button">
                Back
            </a>
            <h1 className="form-title">POST A JOB OPPORTUNITY</h1>
            <form className="opportunity-form" onSubmit={handleSubmit}>
                {/* ... rest of form unchanged ... */}

                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter Job Title"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company:</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        placeholder="Enter company name"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="college">College:</label>
                    <select id="college" name="college" value={formData.college} onChange={handleChange}>
                        <option value="">Select College</option>
                        {Object.keys(coursesByCollege).map((collegeName) => (
                            <option key={collegeName} value={collegeName}>
                                {collegeName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="course">Course:</label>
                    <select id="course" name="course" value={formData.course} onChange={handleChange} disabled={!formData.college}>
                        <option value="">Select Course</option>
                        {formData.college &&
                            coursesByCollege[formData.college].map((courseName) => (
                                <option key={courseName} value={courseName}>
                                    {courseName}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        placeholder="Enter job location"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type:</label>
                    <select id="type" name="type" value={formData.type} onChange={handleChange}>
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Job Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter job description"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="responsibilities">Key Responsibilities:</label>
                    <textarea
                        id="responsibilities"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        placeholder="Enter key responsibilities"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="qualifications">Qualification:</label>
                    <textarea
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        placeholder="Enter required qualifications"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="source">Source:</label>
                    <input
                        type="text"
                        id="source"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="Enter the source or link"
                    />
                </div>
                <button type="submit" className="submit-button">
                    Submit
                </button>
                {message && <p className="form-message">{message}</p>}
                <p className="form-note">
                    NOTE: When submitted, an admin will review the request to post the offer. You will get
                    notified regarding the status of your post.
                </p>
            </form>
        </div>
    );
}

export default AddJobForm;
