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
        'College of Engineering': [
            'Bachelor of Science in Civil Engineering',
            'Bachelor of Science in Electrical Engineering',
            'Bachelor of Science in Electronics Engineering',
            'Bachelor of Science in Mechanical Engineering'
        ],
        'College of Science': [
            'Bachelor of Applied Science in Laboratory Technology',
            'Bachelor of Science in Computer Science',
            'Bachelor of Science in Environmental Science',
            'Bachelor of Science in Information System',
            'Bachelor of Science in Information Technology'
        ],
        'College of Industrial Education': [
            'Bachelor of Science Industrial Education Major in Information and Communication Technology',
            'Bachelor of Science Industrial Education Major in Home Economics',
            'Bachelor of Science Industrial Education Major in Industrial Arts',
            'Bachelor of Technical Vocational Teachers Education Major in Animation',
            'Bachelor of Technical Vocational Teachers Education Major in Automotive',
            'Bachelor of Technical Vocational Teachers Education Major in Beauty Care and Wellness',
            'Bachelor of Technical Vocational Teachers Education Major in Computer Programming',
            'Bachelor of Technical Vocational Teachers Education Major in Electrical',
            'Bachelor of Technical Vocational Teachers Education Major in Electronics',
            'Bachelor of Technical Vocational Teachers Education Major in Food Service Management',
            'Bachelor of Technical Vocational Teachers Education Major in Fashion and Garment',
            'Bachelor of Technical Vocational Teachers Education Major in Heat Ventillation & Air Conditioning'
        ],
        'College of Liberal Arts': [
            'Bachelor of Science in Business Management Major in Industrial Management',
            'Bachelor of Science in Entreprenuership',
            'Bachelor of Science Hospitality Management'
        ],
        'College of Architecture and Fine Arts': [
            'Bachelor of Science in Architecture',
            'Bachelor of Fine Arts',
            'Bachelor of Graphic Technology Major in Architecture Technology',
            'Bachelor of Graphic Technology Major in Industrial Design',
            'Bachelor of Graphic Technology Major in Mechanical Drafting Technology'
        ],
        'College of Industrial Technology': [
            'Bachelor of Science in Food Technology',
            'Bachelor of Engineering Technology Major in Civil Technology',
            'Bachelor of Engineering Technology Major in Electrical Technology',
            'Bachelor of Engineering Technology Major in Electronics Technology',
            'Bachelor of Engineering Technology Major in Computer Engineering Technology',
            'Bachelor of Engineering Technology Major in Instrumentation and Control Technology',
            'Bachelor of Engineering Technology Major in Mechanical Technology',
            'Bachelor of Engineering Technology Major in Mechatronics Technology',
            'Bachelor of Engineering Technology Major in Railway Technology',
            'Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Automative Technology',
            'Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Heating Ventilation & Airconditioning/Refrigiration Technology',
            'Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Power Plant Technology',
            'Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Welding Technology',
            'Bachelor of Engineering Technology Major in Mechanical Engineering Technology option in Dies and Moulds Technology',
            'Bachelor of Technology in Apparel and Fashion',
            'Bachelor of Technology in Culinary Technology',
            'Bachelor of Technology in Print Media Technology'
        ]
    };

    const handleCollegeChange = (e) => {
        setCollege(e.target.value);
        setCourse(''); // Reset course when college changes
    };

    const handleCourseChange = (e) => {
        setCourse(e.target.value);
    };

    // Make sure that all required fields are populated before submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        // Additional frontend validation (e.g., check for missing fields)
        if (!college || !course || !firstName || !lastName || !middleName || !birthday) {
            alert("All fields are required");
            return;
        }

        // Prepare data and send to backend
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