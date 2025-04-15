import { useState } from 'react';
import Tuplogo from '../components/images/Tuplogo.png';
import Alumnilogo from '../components/images/alumniassoc_logo.png';
import styles from './Login.module.css'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/adminlog_reg/adminlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', formData.username);
        setMessage('Login successful!');
        navigate('/alumni-page');
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleForgotClick = () => {
    setShowForgotModal(true);
    setForgotUsername('');
    setForgotMessage('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://alumnitracersystem.onrender.com/adminlog_reg/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotUsername })
      });
      const data = await res.json();
      if (res.ok) {
        setResetToken(data.resetToken);
        setShowResetPassword(true);
      } else {
        setForgotMessage(data.error || 'Failed to send reset link.');
      }
    } catch (err) {
      setForgotMessage('Something went wrong.');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return;
    try {
      const res = await fetch('https://alumnitracersystem.onrender.com/adminlog_reg/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotMessage('Password reset successful!');
        setShowResetPassword(false);
        setShowForgotModal(false);
      } else {
        setForgotMessage(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotMessage('Something went wrong.');
    }
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
    setShowResetPassword(false);
    setForgotUsername('');
    setForgotMessage('');
    setNewPassword('');
  };

  return (
    <div className={styles.adminBg}>
      <div className={styles.adminLoginLogo}>
        <img src={Tuplogo} alt='TUP logo' className={styles.logo1} />
        <img src={Alumnilogo} alt='Alumni logo' className={styles.logo2} />
      </div>

      <div className={styles.adminLoginTitle}>
        <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
        <h4 className={styles.adminSystemTitle2}>The Technological University of the Philippines Alumni Tracer System</h4>
        <h5 className={styles.adminSystemTitle3}>ADMIN ACCESS</h5>
      </div>

      <div className={styles.adminLoginContainer}>
        <form className={styles.adminLoginForm} onSubmit={handleSubmit}>
          <label>Username</label>
          <input type='text' name='username' placeholder='Username' value={formData.username} onChange={handleChange} />

          <label>Password</label>
          <input type='password' name='password' placeholder='Password' value={formData.password} onChange={handleChange} />

          <div className={styles.formFooter}>
            <span className={styles.forgotText}>Forgot Password? <span className={styles.forgotLink} onClick={handleForgotClick}>Click Here</span></span>
            <button type='submit'>LOGIN</button>
          </div>
        </form>

        {message && <p>{message}</p>}

        <button className={styles.registerButton} onClick={() => navigate('/register')}>REGISTER</button>
      </div>

      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {!showResetPassword ? (
              <form onSubmit={handleForgotSubmit} className={styles.modalForm}>
                <h3>Reset Your Password</h3>
                <label>Username</label>
                <input type='text' value={forgotUsername} onChange={(e) => setForgotUsername(e.target.value)} placeholder='Enter your username' />
                <button type='submit' className={styles.modalButton}>Send Reset Link</button>
              </form>
            ) : (
              <div>
                <h3>Set New Password</h3>
                <input type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New Password' />
                <button className={styles.modalButton} onClick={handleResetPassword}>Update Password</button>
              </div>
            )}
            {forgotMessage && <p className={styles.forgotMsg}>{forgotMessage}</p>}
            <button className={styles.closeModal} onClick={handleCloseModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}