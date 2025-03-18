import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register_newalumni.module.css'; // Import module styles

const Register_NewAlumni = ({ closeModal }) => {
    const [gradyear, setYear] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [generatedID, setGeneratedID] = useState(null); 
    const [loading, setLoading] = useState(false)
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
        if (!gradyear||  !lastName || !password || !confirmPassword) {
           alert("All fields are required");
            return;
        }
        

        const formData = {
            gradyear,
            lastName,
            password,
            confirmPassword,
        };

        setLoading(true);

        try {
            const response = await fetch('https://localhost:5050/record/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            console.log("Full backend response during registration:", data); // Debug log

            if (response.ok) {
                localStorage.setItem('userId', data.user?.id || '');
                localStorage.setItem('token', data.token);
                localStorage.setItem('generatedID', data.user.generatedID);
                setGeneratedID(data.user.generatedID);
            } else {
                alert(`Error: ${data.error || 'Registration failed'}`);
            }
        } catch (error) {
            console.error('Error submitting registration:', error);
            alert('There was an error with the registration request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlayNewAlumni}>
            <div className={styles.modalContentNewAlumni}>
                <button className={styles.closeButtonNewAlumni} onClick={closeModal}>
                    &times;
                </button>
                <h2 className={styles.modalTitleNewAlumni}>REGISTRATION</h2>

                {!generatedID ? (
                    <form onSubmit={handleSubmit} className={styles.registerForm}>
                        <input
                            type="text"
                            placeholder="GRADUATION YEAR"
                            value={gradyear}
                            onChange={(e) => setYear(e.target.value)}
                            required
                            className={styles.inputFieldNewAlumni}
                        />
                        <input
                            type="text"
                            placeholder="LAST NAME"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className={styles.inputFieldNewAlumni}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.inputFieldNewAlumni}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={styles.inputFieldNewAlumni}
                        />
                        <button type="submit" className={styles.submitButtonNewAlumni}>
                            Register
                        </button>
                    </form>
                ) : (
                    <div className={styles.uniqueIdModal}>
                        <h3>Registration Successful!</h3>
                        <p>Your User ID:</p>
                        <p className={styles.generatedId}>
                            <strong>{generatedID}</strong>
                        </p>
                        <p>Please save this ID. This serves as your username to login.</p>
                        <button onClick={handleCrossCheckSurveyFormClick} className={styles.submitButtonNewAlumni}>
                            Go to Survey
                        </button>
                    </div>
                )}
                        {/* Overlay Loader */}
                              {loading && (
                                <div className={styles.loadingOverlay}>
                                  <div className={styles.loaderContainer}>
                                  <svg viewBox="0 0 240 240" height="80" width="80" className={styles.loader}>
                                    <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringA}`}></circle>
                                    <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringB}`}></circle>
                                    <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className={`${styles.pl__ring} ${styles.pl__ringC}`}></circle>
                                    <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className={`${styles.pl__ring} ${styles.pl__ringD}`}></circle>
                                  </svg>
                                  </div>
                                </div>
                              )}
            </div>
        </div>
    );
};

export default Register_NewAlumni;
