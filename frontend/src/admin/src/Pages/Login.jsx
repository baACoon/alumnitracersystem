import { useState } from 'react';
import Tuplogo from '../components/images/Tuplogo.png';
import Alumnilogo from '../components/images/alumniassoc_logo.png';
import styles from './Login.module.css'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://alumnitracersystem.onrender.com/adminlog_reg/adminlogin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", formData.username);

        setMessage("Login successful!");
        navigate("/alumni-page");
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleForgotClick = () => {
    setShowForgotModal(true);
    setForgotEmail("");
    setForgotMessage("");
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your email address.");
      return;
    }

    try {
      const res = await fetch("https://alumnitracersystem.onrender.com/adminlog_reg/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setForgotMessage("Reset link sent successfully! Check your email.");
      } else {
        setForgotMessage(data.error || "Failed to send reset link.");
      }
    } catch (error) {
      console.error("Reset link error:", error);
      setForgotMessage("Something went wrong. Try again later.");
    }
  };

  const handleCloseModal = () => {
    setShowForgotModal(false);
  };

  return (
    <div className={styles.adminBg}>
      <div className={styles.adminLoginLogo}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
      </div>

      <div className={styles.adminLoginTitle}>
        <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
        <h4 className={styles.adminSystemTitle2}>
          The Technological University of the Philippines Alumni Tracer System
        </h4>
        <h5 className={styles.adminSystemTitle3}>ADMIN ACCESS</h5>
      </div>

      <div className={styles.adminLoginContainer}>
        <form className={styles.adminLoginForm} onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <div className={styles.formFooter}>
            <span className={styles.forgotText}>
              Forgot Password? <span className={styles.forgotLink} onClick={handleForgotClick}>Click Here</span>
            </span>
            <button type="submit">LOGIN</button>
          </div>
        </form>

        {message && <p>{message}</p>}

        <button
          className={styles.registerButton}
          onClick={() => navigate('/register')}
        >
          REGISTER
        </button>
      </div>

      {showForgotModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Reset Your Password</h3>
            <form onSubmit={handleForgotSubmit} className={styles.modalForm}>
              <label htmlFor="forgotEmail">Email Address</label>
              <input
                type="email"
                id="forgotEmail"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="Enter your registered email"
              />
              <button type="submit" className={styles.modalButton}>
                Send Reset Link
              </button>
              {forgotMessage && <p className={styles.forgotMsg}>{forgotMessage}</p>}
            </form>
            <button className={styles.closeModal} onClick={handleCloseModal}>✖</button>
          </div>
        </div>
      )}
    </div>
  );
}
