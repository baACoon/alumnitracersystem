import React, { useState } from 'react';
import './register_newalumni.css';

const Register_NewAlumni = ({ closeModal }) => {
    const [college, setCollege] = useState('');
    const [course, setCourse] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const coursesByCollege = {
        'College of Science': ['BS Biology', 'BS Chemistry', 'BS Physics'],
        'College of Engineering': ['BS Computer Engineering', 'BS Electrical Engineering', 'BS Civil Engineering'],
        'College of Industrial Education': ['BS Industrial Education', 'BS Technology Education'],
        'College of Industrial Technology': ['BS Industrial Technology', 'BS Mechanical Engineering'],
        'College of Architecture and Fine Arts': ['BS Architecture', 'BS Fine Arts'],
        'College of Liberal Arts': ['BA Psychology', 'BA Philosophy', 'BA English'],
    };

    const handleCollegeChange = (e) => {
        setCollege(e.target.value);
        setCourse(''); // Reset course when college changes
    };

    const handleCourseChange = (e) => {
        setCourse(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        // Prepare the data to be sent to the backend
        const formData = {
            alumniID: null, // No alumniID since this is a registration without it
            college,
            course,
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
                // Handle successful registration (you can show a success message or redirect)
                alert('Registration successful!');
                console.log('Registered user:', data);
                closeModal();  // Close modal after successful submission
            } else {
                // Handle errors from backend
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
                <h2 className="modal-title-new-alumni">Register without Alumni ID</h2>
                <form onSubmit={handleSubmit} className="register-form-new-alumni">
                    
                    {/* College Selection */}
                    <select value={college} onChange={handleCollegeChange} required className="input-field-new-alumni">
                        <option value="">-- SELECT COLLEGE --</option>
                        <option value="College of Science">College of Science</option>
                        <option value="College of Engineering">College of Engineering</option>
                        <option value="College of Industrial Education">College of Industrial Education</option>
                        <option value="College of Industrial Technology">College of Industrial Technology</option>
                        <option value="College of Architecture and Fine Arts">College of Architecture and Fine Arts</option>
                        <option value="College of Liberal Arts">College of Liberal Arts</option>
                    </select>

                    {/* Course Selection */}
                    <select value={course} onChange={handleCourseChange} required className="input-field-new-alumni">
                        <option value="">-- SELECT COURSE --</option>
                        {coursesByCollege[college]?.map((courseOption) => (
                            <option key={courseOption} value={courseOption}>
                                {courseOption}
                            </option>
                        ))}
                    </select>
                    
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

                    <button type="submit" className="submit-btn-new-alumni">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register_NewAlumni;
