import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register_newalumni.module.css'; // Import module styles

const Register_NewAlumni = ({ closeModal }) => {
    const [gradyear, setYear] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [generatedID, setGeneratedID] = useState(null); 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // Initialize the navigate function

     // Three possible states: null (initial), 'verified', 'not_found', 'existing_account'
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [existingAccount, setExistingAccount] = useState(null);
 
    const verifyGraduate = async () => {
        if (!gradyear || !lastName || !firstName) {
            alert("Please fill in all fields for verification");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5050/record/check-account`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, gradyear })
            });
            
            // First check the response status
            if (response.status === 404) {
                // Handle "Graduate not found" specifically
                setVerificationStatus('not_found');
                return;
            }
            
            if (!response.ok) {
                throw new Error(await response.text());
            }
            
            const data = await response.json();
            
            if (data.exists) {
                // Show existing account info and prevent registration
                setExistingAccount(data.user);
                setVerificationStatus('existing_account');
                // Clear password fields just in case
                setPassword('');
                setConfirmPassword('');
            } else {
                setVerificationStatus('verified');
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
        
        const handleAccountRecovery = () => {
            closeModal();
            navigate('/login', { 
              state: { 
                alumniID: existingAccount.generatedID,
                message: "An account already exists. Please use your Alumni ID to login." 
              } 
            });
          };

    const handleCrossCheckSurveyFormClick = () => {
        const storedID = localStorage.getItem('generatedID');
        if (storedID) {
            navigate('/RegisterSurveyForm');
        } else {
            alert("You must be a verified graduate to take the survey.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only proceed if verification was successful
        if (verificationStatus !== 'verified') {
            alert("Please verify your graduate status first");
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        // Additional frontend validation
        if (!password || !confirmPassword) {
            alert("All fields are required");
            return;
        }

        const formData = {
            gradyear,
            firstName,
            lastName,
            password,
            confirmPassword,
        };

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5050/record/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.token && data.user) {
                localStorage.setItem('userId', data.user?.id || '');
                localStorage.setItem('token', data.token);
                localStorage.setItem('generatedID', data.user.generatedID);
                setGeneratedID(data.user.generatedID);
                alert("Registration successful!");
            } else {
                alert(`Registration failed: ${data.error || 'Unknown error'}`);
                setVerificationStatus(null); // Reset to initial state
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
                <button className={styles.closeButtonNewAlumni} onClick={closeModal}>&times;</button>
                <h2 className={styles.modalTitleNewAlumni}>REGISTRATION</h2>

                {/* Step 1: Initial verification form */}
                {verificationStatus === null && !generatedID && (
                    <div className={styles.verificationForm}>
                        <input 
                            type="text" 
                            placeholder="GRADUATION YEAR" 
                            value={gradyear} 
                            onChange={(e) => setYear(e.target.value)} 
                            className={styles.inputFieldNewAlumni} 
                        />
                        <input 
                            type="text" 
                            placeholder="FIRST NAME" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            className={styles.inputFieldNewAlumni} 
                        />
                        <input 
                            type="text" 
                            placeholder="LAST NAME" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            className={styles.inputFieldNewAlumni} 
                        />
                        <button 
                            onClick={verifyGraduate} 
                            className={styles.submitButtonNewAlumni}
                            disabled={loading}
                            >
                            {loading ? (
                                <span className={styles.spinner}></span>
                            ) : 'Verify'}
                        </button>
                    </div>
                )}

                {/* Step 2a: Not found message */}
                {verificationStatus === 'not_found' && (
                    <div className={styles.verificationResult}>
                        <p>You are not on the graduates list.</p>
                        <p>Please wait for the admin to upload the updated list.</p>
                        <button 
                            onClick={() => setVerificationStatus(null)} 
                            className={styles.submitButtonNewAlumni}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Step 2b: Existing account recovery */}
                {verificationStatus === 'existing_account' && (
                <div className={styles.verificationResult}>
                    <h3>Account Already Exists</h3>
                    <p>We found an existing account for:</p>
                    <div className={styles.accountInfo}>
                    <p><strong>Name:</strong> {firstName} {lastName}</p>
                    <p><strong>Graduation Year:</strong> {gradyear}</p>
                    <p><strong>Your Alumni ID:</strong> {existingAccount.generatedID}</p>
                    <p><strong>Registered on:</strong> {new Date(existingAccount.registrationDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.buttonGroup}>
                    <button 
                        onClick={handleAccountRecovery} 
                        className={styles.primaryButton}
                    >
                        Recover Account
                    </button>
                    <button 
                        onClick={() => {
                        setVerificationStatus(null);
                        setFirstName('');
                        setLastName('');
                        setYear('');
                        }} 
                        className={styles.secondaryButton}
                    >
                        Try Different Info
                    </button>
                    </div>
                </div>
                )}

                {/* Step 2c: Verified, show registration form */}
                {verificationStatus === 'verified' && !generatedID && (
                    <form onSubmit={handleSubmit} className={styles.registerForm}>
                        <h3>Complete Registration</h3>
                        <p>Verified: {firstName} {lastName} ({gradyear})</p>
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
                        <button 
                            type="submit" 
                            className={styles.submitButtonNewAlumni}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                )}

                {/* Step 3: Registration success */}
                {generatedID && (
                    <div className={styles.uniqueIdModal}>
                        <h3>Registration Successful!</h3>
                        <p>Your User ID:</p>
                        <p className={styles.generatedId}><strong>{generatedID}</strong></p>
                        <p>Please save this ID. This serves as your username to login.</p>
                        <button 
                            onClick={handleCrossCheckSurveyFormClick} 
                            className={styles.submitButtonNewAlumni}
                        >
                            Go to Survey
                        </button>
                    </div>
                )}

                {/* Loading overlay */}
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

