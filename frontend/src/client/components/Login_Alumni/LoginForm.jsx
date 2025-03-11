import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';

const TestLoginForm = ({ closeModal }) => {
  const [alumniID, setAlumniID] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetAlumniID, setResetAlumniID] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = { alumniID, password };

    console.log('Login attempt with:', formData); // Debug log

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/record/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Server response:', response.status, data); // Debug log

      if (response.ok) {
        console.log("Storing userId in localStorage:", data.user.id);
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
      console.log('Forgot Password Response:', data);

      if (response.ok) {
        alert("A password reset link has been sent to your email.");
        setShowForgotPassword(false);
      } else {
        alert(`Error: ${data.error || 'Password reset failed'}`);
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      alert('There was an error with the password reset request.');
    }
  };

  return (
    <div className={styles.modalOverlayLogin}>
      <div className={styles.modalContentLogin}>
        <button className={styles.closeButtonLogin} onClick={closeModal}>&times;</button>
        <h2 className={styles.modalTitleLogin}>LOGIN</h2>

        {!showForgotPassword ? (
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

            <button className={styles.forgotPasswordButton} onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </button>
          </>
        ) : (
          <div className={styles.forgotPasswordContainer}>
            <h4>Reset Password</h4>
            <input
              type="text"
              placeholder="Enter your Alumni ID"
              value={resetAlumniID}
              onChange={(e) => setResetAlumniID(e.target.value)}
              required
              className={styles.inputFieldLogin}
            />
            <button onClick={handleForgotPassword} className={styles.submitButtonLogin}>Submit</button>
            <button onClick={() => setShowForgotPassword(false)} className={styles.cancelButtonLogin}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestLoginForm;
