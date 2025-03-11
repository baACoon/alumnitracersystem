import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const TestLoginForm = ({ closeModal }) => {
  const [alumniID, setAlumniID] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetAlumniID, setResetAlumniID] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = { alumniID, password };

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/record/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.clear();
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        closeModal();
        navigate("/home");
      } else {
        alert(`Error: ${data.error || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('There was an error with the login request.');
    }
  };

  const handleForgotPassword = async () => {
    if (!resetAlumniID) {
      alert("Please enter your Alumni ID.");
      return;
    }

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/record/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alumniID: resetAlumniID }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetToken(data.resetToken);
        setShowForgotPassword(false);
        setShowResetPassword(true);
      } else {
        alert(`Error: ${data.error || 'Password reset failed'}`);
      }
    } catch (error) {
      console.error('Error during password reset request:', error);
      alert('There was an error with the password reset request.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/record/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successful! You can now log in.");
        setShowResetPassword(false);
      } else {
        alert(`Error: ${data.error || 'Failed to reset password'}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('There was an error with the password reset request.');
    }
  };

  return (
    <div className={styles.modalOverlayLogin}>
      <div className={styles.modalContentLogin}>
        <button className={styles.closeButtonLogin} onClick={closeModal}>&times;</button>
        <h2 className={styles.modalTitleLogin}>LOGIN</h2>

        {!showForgotPassword && !showResetPassword ? (
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
              />
              <h5>Enter Password</h5>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.inputFieldLogin}
              />
              <button type="submit" className={styles.submitButtonLogin}>Login</button>
            </form>

            <a 
              href="#" 
              className={styles.forgotPasswordLink} 
              onClick={(e) => { e.preventDefault(); setShowForgotPassword(true); }}
            >
              Forgot Password?
            </a>
          </>
        ) : showForgotPassword ? (
          <div>
            <h4>Reset Password</h4>
            <input type="text" placeholder="Enter Alumni ID" value={resetAlumniID} onChange={(e) => setResetAlumniID(e.target.value)} />
            <button className={styles.nextbutton} onClick={handleForgotPassword}>Next</button>
          </div>
        ) : (
          <div>
            <h4>Enter New Password</h4>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button className={styles.resetbutton} onClick={handleResetPassword}>Reset Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLoginForm;
