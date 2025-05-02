import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './register_newalumni.module.css'; // Import module styles
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register_NewAlumni = ({ closeModal }) => {
    const [gradyear, setYear] = useState('');
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [generatedID, setGeneratedID] = useState(null); 
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate(); // Initialize the navigate function
    const [recoveryStep, setRecoveryStep] = useState('initial'); // 'initial' | 'code_sent' | 'verified'
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newRecoveredPassword, setNewRecoveredPassword] = useState('');
    const [confirmRecoveredPassword, setConfirmRecoveredPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRecoveredPassword, setShowRecoveredPassword] = useState(false);
    const [showConfirmRecoveredPassword, setShowConfirmRecoveredPassword] = useState(false);



     // Three possible states: null (initial), 'verified', 'not_found', 'existing_account'
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [existingAccount, setExistingAccount] = useState(null);
 
    const verifyGraduate = async () => {
        if (!gradyear || !lastName || !firstName) {
            toast.warning("Please fill in all fields for verification");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch(`https://alumnitracersystem.onrender.com/record/check-account`, {
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
            toast.error('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAccountRecovery = async () => {
        try {
          setLoading(true);
          
          // Try multiple possible paths to find the email
          const email = existingAccount?.email || 
                        existingAccount?.personalInfo?.email_address || 
                        null;
          
          console.log("Found email:", email); // For debugging
          
          if (!email) {
            // If no email is found, try to fetch it from the backend
            try {
              const fetchedEmail = await fetchGraduateEmail(firstName, lastName, gradyear);
              if (fetchedEmail) {
                setRecoveryEmail(fetchedEmail);
                // Continue with the recovery process using fetchedEmail
                const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/request-code', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: fetchedEmail })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                  setRecoveryStep('code_sent');
                  toast.success('A recovery code has been sent to your email.');
                } else {
                  toast.error(data.message || 'Failed to send recovery code.');
                }
                return;
              }
            } catch (fetchError) {
              console.error("Error fetching email:", fetchError);
            }
            
            // If we still don't have an email after trying to fetch it
            toast.info("This account has no registered email. Contact admin.");
            return;
          }
          
          setRecoveryEmail(email);
          
          const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/request-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          const data = await response.json();
          
          if (response.ok) {
            setRecoveryStep('code_sent');
            toast.success('A recovery code has been sent to your email.');
          } else {
            toast.error(data.message || 'Failed to send recovery code.');
          }
        } catch (error) {
          console.error('Error sending recovery code:', error);
          toast.error('Recovery failed. Try again.');
        } finally {
          setLoading(false);
        }
      };
      
      const fetchGraduateEmail = async (firstName, lastName, gradYear) => {
        try {
          console.log("🔍 Fetching email for:", { firstName, lastName, gradYear });
      
          const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/get-graduate-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              firstName: firstName.trim(), 
              lastName: lastName.trim(), 
              gradYear: Number(gradYear) 
            })
          });
      
          const result = await response.json();
          console.log("📬 Email response:", result);
      
          if (!response.ok || !result.email) {
            throw new Error(result.message || 'No email found');
          }
      
          return result.email;
        } catch (error) {
          console.error('❌ fetchGraduateEmail error:', error.message);
          return null;
        }
      };

    const verifyRecoveryCode = async () => {
        try {
            const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/verify-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: recoveryEmail, code: recoveryCode })
            });
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem('recoveryToken', data.token);
                setRecoveryStep('verified');
                console.log("🆗 Saving token:", data.token);

            } else {
                toast.error(data.message || 'Invalid code.');
            }
        } catch (error) {
            toast.error('Verification failed.');
        }
    };
    
    const resetRecoveredPassword = async () => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        const token = localStorage.getItem('recoveryToken');
        console.log(" Token used for reset:", token);
      
        if (!token) {
          toast.error("Token missing. Please verify the code again.");
          return;
        }
      
        if (newRecoveredPassword !== confirmRecoveredPassword) {
          toast.error("Passwords do not match.");
          return;
        }
      
        if (!strongPasswordRegex.test(newRecoveredPassword)) {
          toast.warning("Password must include uppercase, lowercase, number, special character and be 8+ characters.");
          return;
        }
      
        try {
          const response = await fetch('https://alumnitracersystem.onrender.com/api/recover/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, newPassword: newRecoveredPassword })
          });
      
          const data = await response.json();
          if (response.ok) {
            toast.success('Password reset successful! Please login.');
            closeModal();
            navigate('/');
          } else {
            toast.error(data.message || 'Reset failed.');
          }
        } catch (error) {
          toast.error('Error resetting password.');
        }
      };
      
    
    

    const handleCrossCheckSurveyFormClick = () => {
        const storedID = localStorage.getItem('generatedID');
        if (storedID) {
            navigate('/RegisterSurveyForm');
        } else {
            toast.warning("You must be a verified graduate to take the survey.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only proceed if verification was successful
        if (verificationStatus !== 'verified') {
            toast.warning("Please verify your graduate status first");
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        // Additional frontend validation
        if (!password || !confirmPassword) {
            toast.warning("All fields are required");
            return;
        }
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          toast.warning("Password must include uppercase, lowercase, number, special character and be 8+ characters.");
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
            const response = await fetch('https://alumnitracersystem.onrender.com/record/register', {
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
                toast.success("Registration successful!");
            } else {
                toast.error(`Registration failed: ${data.error || 'Unknown error'}`);
                setVerificationStatus(null); // Reset to initial state
            }
        } catch (error) {
            console.error('Error submitting registration:', error);
            toast.error('There was an error with the registration request.');
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
                        <p><strong>Name:</strong> {firstName} {lastName}</p>
                        <p><strong>Graduation Year:</strong> {gradyear}</p>
                        <p><strong>Your Alumni ID:</strong> {existingAccount.generatedID}</p>
                        <p><strong>Registered on:</strong> {new Date(existingAccount.registrationDate).toLocaleDateString()}</p>

                        {recoveryStep === 'initial' && (
                            <div className={styles.buttonGroup}>
                                <button onClick={handleAccountRecovery} className={styles.primaryButton}>
                                    Recover Account
                                </button>
                                <button onClick={() => {
                                    setVerificationStatus(null);
                                    setFirstName('');
                                    setLastName('');
                                    setYear('');
                                }} className={styles.primaryButton}>
                                    Try Different Info
                                </button>
                            </div>
                        )}

                        {recoveryStep === 'code_sent' && (
                            <div>
                                <p>A code was sent to your email. Enter it below:</p>
                                <input 
                                    type="text" 
                                    placeholder="Enter 6-digit Code" 
                                    value={recoveryCode} 
                                    onChange={(e) => setRecoveryCode(e.target.value)} 
                                    className={styles.inputFieldNewAlumni}
                                />
                                <button onClick={verifyRecoveryCode} className={styles.primaryButton}>
                                    Verify Code
                                </button>
                            </div>
                        )}

                                {/* Recovery password section */}
                                {recoveryStep === 'verified' && (
                            <div>
                                <p>Enter your new password:</p>

                                <div className={styles.passwordWrapper}>
                                    <input
                                        type={showRecoveredPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        value={newRecoveredPassword}
                                        onChange={(e) => setNewRecoveredPassword(e.target.value)}
                                        className={styles.inputFieldNewAlumni}
                                    />
                                    <FontAwesomeIcon 
                                        icon={showRecoveredPassword ? faEyeSlash : faEye} 
                                        onClick={() => setShowRecoveredPassword(!showRecoveredPassword)} 
                                        className={styles.eyeToggle}
                                    />
                                </div>

                                <div className={styles.passwordWrapper}>
                                    <input
                                        type={showConfirmRecoveredPassword ? "text" : "password"}
                                        placeholder="Confirm New Password"
                                        value={confirmRecoveredPassword}
                                        onChange={(e) => setConfirmRecoveredPassword(e.target.value)}
                                        className={styles.inputFieldNewAlumni}
                                    />
                                    <FontAwesomeIcon 
                                        icon={showConfirmRecoveredPassword ? faEyeSlash : faEye} 
                                        onClick={() => setShowConfirmRecoveredPassword(!showConfirmRecoveredPassword)} 
                                        className={styles.eyeToggle}
                                    />
                                </div>

                                <button onClick={resetRecoveredPassword} className={styles.primaryButton}>
                                    Reset Password
                                </button>
                            </div>
                        )}
                    </div>
                )}


                {/* Step 2c: Verified, show registration form */}
                {verificationStatus === 'verified' && !generatedID && (
                    <form onSubmit={handleSubmit} className={styles.verificationResult}>
                        <h3>Complete Registration</h3>
                        <p className={styles.verifyName}><strong>Verified: {firstName} {lastName} ({gradyear})</strong></p>
                        
                        {/* Password input with eye toggle */}
                        <div className={styles.passwordWrapper}>
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                className={styles.inputFieldNewAlumni} 
                            />
                            <FontAwesomeIcon 
                                icon={showPassword ? faEyeSlash : faEye} 
                                onClick={() => setShowPassword(!showPassword)} 
                                className={styles.eyeToggle} 
                            />
                        </div>

                        <div className={styles.passwordWrapper}>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                                className={styles.inputFieldNewAlumni} 
                            />
                            <FontAwesomeIcon 
                                icon={showConfirmPassword ? faEyeSlash : faEye} 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                className={styles.eyeToggle} 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.primaryButton}
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'REGISTER'}
                        </button>
                    </form>
                )}

                {/* Step 3: Registration success */}
                {generatedID && (
                    <div className={styles.uniqueIdModal}>
                        <h3>Registration Successful!</h3>
                        <p>Your User ID:</p>
                        <h4 className={styles.generatedId}><strong>{generatedID}</strong></h4> 
                        <p>Please save this ID. This serves as your username to login.</p>
                        <button 
                            onClick={handleCrossCheckSurveyFormClick} 
                            className={styles.primaryButton}
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
