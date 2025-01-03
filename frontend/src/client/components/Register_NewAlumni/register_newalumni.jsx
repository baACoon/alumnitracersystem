import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './register_newalumni.css'

const Register_NewAlumni = ({ closeModal }) => {
    const [gradyear, setYear] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [generatedID, setGeneratedID] = useState(null); // To display the generated unique ID

    const navigate = useNavigate(); // Initialize the navigate function

    const handleCrossCheckSurveyFormClick = () => {
        if (generatedID) {
          navigate('/RegisterSurveyForm'); // Navigate to the survey form
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password match
        if (password !== confirmPassword) {
           alert("Passwords don't match");
            return;
        }

        // Additional frontend validation (e.g., check for missing fields)
        if (!gradyear|| !email || !firstName || !lastName || !middleName || !birthday || !password || !confirmPassword) {
           alert("All fields are required");
            return;
        }
        

        const formData = {
            gradyear,
            email,
            firstName,
            middleName,
            lastName,
            birthday,
            password,
            confirmPassword
        };

        try {
            const response = await fetch('https://alumnitracersystem.onrender.com/record/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            console.log("Full backend response during registration:", data); // Debug log

            if (response.ok) {
                /// Convert ObjectId to string if needed
                 const userIdString = data.user?.id || '';
                    localStorage.setItem('userId', userIdString); // Store the userId in localStorage
                    localStorage.setItem('token', data.token); // Store the token
                    localStorage.setItem('generatedID', data.user.generatedID); // Store the generatedID
                    setGeneratedID(data.user.generatedID); 
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

                {
                    !generatedID
                        ? (
                            <form onSubmit={handleSubmit} className="register-form-new-alumni">
                                <input
                                    type="text"
                                    placeholder="GRADUATION YEAR"
                                    value={gradyear}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                    className="input-field-new-alumni"/>
                                <input
                                    type="text"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field-new-alumni"/>
                                <input
                                    type="text"
                                    placeholder="FIRST NAME"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <input
                                    type="text"
                                    placeholder="MIDDLE NAME"
                                    value={middleName}
                                    onChange={(e) => setMiddleName(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <input
                                    type="text"
                                    placeholder="LAST NAME"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <input
                                    type="date"
                                    placeholder="Birthday"
                                    value={birthday}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required="required"
                                    className="input-field-new-alumni"/>
                                <button type="submit" className="submit-btn-new-alumni">Register</button>
                            </form>
                        )
                        : (
                            <div className="unique-id-modal">
                                <h3>Registration Successful!</h3>
                                <p>Your User ID:</p>
                                <p className="generated-id"><strong>{generatedID}</strong></p>
                                <p>Please save this ID. This serves as your username to login.</p>
                                <button onClick={handleCrossCheckSurveyFormClick} className="submit-btn-new-alumni">
                                    Go to Survey
                                </button>
                            </div>
                        )
                }
            </div>
        </div>
    );
};

export default Register_NewAlumni;