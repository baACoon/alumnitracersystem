import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tuplogo from '../components/images/Tuplogo.png';
import Alumnilogo from '../components/images/alumniassoc_logo.png';
import styles from './Register.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('https://localhost:5050/adminlog_reg/adminregister', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Registration successful!");
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate("/alumni-page"), 2000); // wait a bit before redirecting
      } else {
        toast.error(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className={styles.registerBg}>
        <div className={styles.adminLoginLogo}>
          <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
          <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
        </div>

        <div className={styles.adminLoginTitle}>
          <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
          <h4 className={styles.adminSystemTitle2}>The Technological University of the Philippines Alumni Tracer System</h4>
          <h5 className={styles.adminSystemTitle3}>REGISTRATION</h5>
        </div>

        <div className={styles.registerContainer}>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
            <label>Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <label>Confirm Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit">Register</button>
          </form>

          <button
            className={styles.loginButton}
            onClick={() => navigate('/login')}
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
