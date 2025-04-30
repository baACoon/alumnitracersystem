import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestLoginForm = ({ closeModal }) => {
  const [alumniID, setAlumniID] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetAlumniID, setResetAlumniID] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = { alumniID, password };

    try {
      const response = await fetch('http://localhost:5050/record/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("token", data.token);
        closeModal();
        navigate("/home");
      } else {
        toast.error(`Error: ${data.error || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('There was an error with the login request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetCode = async () => {
    if (!resetAlumniID) return toast.warning("Enter Alumni ID");
  
    try {
      const response = await fetch('http://localhost:5050/api/recover/send-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniID: resetAlumniID })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setResetEmail(data.email);
        setShowForgotPassword(false);
        setShowCodeInput(true);
      } else {
        toast.error(data.message || 'Failed to send recovery code.');
      }
    } catch (error) {
      console.error('Error sending recovery code:', error);
      er('Recovery failed. Try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleVerifyResetCode = async () => {
    if (!resetCode || !resetEmail) return toast.warning("Code and email required");

    try {
      const response = await fetch('http://localhost:5050/api/recover/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, code: resetCode })
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.token);
        setShowCodeInput(false);
        setShowResetPassword(true);
      } else {
        toast.error(data.message || "Code verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      toast.error("Server error while verifying code.");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.warning("Enter a new password");

    try {
      const response = await fetch('http://localhost:5050/api/recover/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successful! You can now log in.");
        setShowResetPassword(false);
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("Error during password reset");
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    const start = user.slice(0, 2);
    const end = user.slice(-2);
    const masked = `${start}${'*'.repeat(user.length - 4)}${end}`;
    return `${masked}@${domain}`;
  };
  

  return (
    <div className={styles.modalOverlayLogin}>
      <div className={styles.modalContentLogin}>
        <button className={styles.closeButtonLogin} onClick={closeModal}>&times;</button>
        <h2 className={styles.modalTitleLogin}>LOGIN</h2>

        {!showForgotPassword && !showCodeInput && !showResetPassword && (
          <>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <h5>Alumni ID</h5>
              <input
                type="text"
                placeholder="Alumni ID"
                value={alumniID}
                onChange={(e) => setAlumniID(e.target.value)}
                required
                className={styles.inputFieldLogin}
                disabled={loading}
              />
              <h5>Enter Password</h5>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputFieldLogin}
                disabled={loading}
              />
              <button type="submit" className={styles.submitButtonLogin} disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loaderContainer}>
                  <svg viewBox="0 0 240 240" height="80" width="80" className={styles.loader}>
                    <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringA}`} />
                    <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringB}`} />
                    <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className={`${styles.pl__ring} ${styles.pl__ringC}`} />
                    <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className={`${styles.pl__ring} ${styles.pl__ringD}`} />
                  </svg>
                </div>
              </div>
            )}

            <a href="#" className={styles.forgotPasswordLink} onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}>Forgot Password?</a>
          </>
        )}

        {showForgotPassword && (
          <div>
            <h4>Reset Password</h4>
            <input
              type="text"
              placeholder="Enter Alumni ID"
              value={resetAlumniID}
              onChange={(e) => setResetAlumniID(e.target.value)}
            />
            <button className={styles.nextbutton} onClick={handleSendResetCode}>
              Send Code
            </button>
          </div>
        )}

        {showCodeInput && (
          <div>
            <h4>Code sent to:</h4>
            <p></p>
            <p style={{ fontWeight: 'bold', color: 'white' }}>Email: {maskEmail(resetEmail)}</p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
            />
            <button className={styles.resetbutton} onClick={handleVerifyResetCode}>
              Verify Code
            </button>
          </div>
        )}

        {showResetPassword && (
          <div>
            <h4>Enter New Password</h4>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button className={styles.resetbutton} onClick={handleResetPassword}>
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLoginForm;
