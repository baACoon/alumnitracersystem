import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './register_newalumni.css';

const Register_NewAlumni = ({ closeModal }) => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const navigate = useNavigate();  // Initialize the navigate function
    const handleCrossCheckSurveyFormClick = () => navigate('/RegisterSurveyForm'); 

    // Make sure that all required fields are populated before submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        // Additional frontend validation (e.g., check for missing fields)
        if (!firstName || !lastName || !middleName || !birthday || !password || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        // Prepare data and send to backend
        const formData = {
            firstName,
            middleName,
            lastName,
            birthday,
            password,
            confirmPassword,
        };

        // Send data to backend using fetch
        try {
            const response = await fetch('http://localhost:5050/record/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful!');
                closeModal();
            } else {
                alert(`Error: ${data.error || 'Registration failed'}`);
            }
        } catch (error) {
            console.error('Error submitting registration:', error);
            alert('There was an error with the registration request.');
        }
    };

    return (
        <div className="modal-overlay-new-alumni">
            <div className="modal-content-new-alumni">
                <button className="close-btn-new-alumni" onClick={closeModal}>&times;</button>
                <h2 className="modal-title-new-alumni">REGISTRATION</h2>
                <form onSubmit={handleSubmit} className="register-form-new-alumni">
                    
                    {/* Name Fields */}
                    <input
                        type="text"
                        placeholder="FIRST NAME"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />
                    <input
                        type="text"
                        placeholder="MIDDLE NAME"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />
                    <input
                        type="text"
                        placeholder="LAST NAME"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />

                    {/* Birthday Field */}
                    <input
                        type="date"
                        placeholder="Birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />

                    {/* Password and Confirm Password Fields */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="input-field-new-alumni"
                    />

                    <button type="submit" className="submit-btn-new-alumni" onClick={handleCrossCheckSurveyFormClick}>Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register_NewAlumni;