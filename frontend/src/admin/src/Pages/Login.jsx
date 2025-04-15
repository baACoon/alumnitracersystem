import { useState } from 'react';
import Tuplogo from '../components/images/Tuplogo.png';
import Alumnilogo from '../components/images/alumniassoc_logo.png'
import styles from './Login.module.css'; 
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
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
      console.log("Login Response:", data); // Debugging: Check API response

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        localStorage.setItem("username", formData.username); // Store admin's username

        setMessage("Login successful!");
        navigate("/alumni-page"); // Redirect on success
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
      <div className={styles.adminBg}>
        {/* Logos */}
        <div className={styles.adminLoginLogo}>
          <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
          <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
        </div>

        {/* Title */}
        <div className={styles.adminLoginTitle}>
          <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
          <h4 className={styles.adminSystemTitle2}>
            The Technological University of the Philippines Alumni Tracer System
          </h4>
          <h5 className={styles.adminSystemTitle3}>ADMIN ACCESS</h5>
        </div>

        {/* Login Form */}
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
                Forgot Password? <span className={styles.forgotLink}>Click Here</span>
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
      </div>

  );
}
