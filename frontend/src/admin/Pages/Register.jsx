import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tuplogo from '/xampp/htdocs/alumnitracersystem/frontend/src/client/components/image/Tuplogo.png';
import Alumnilogo from '/xampp/htdocs/alumnitracersystem/frontend/src/client/components/image/alumniassoc_logo.png';
import styles from './Register.module.css';

export default function Register() {
  const [data, setData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
import React, { useState } from "react";
import axios from "axios";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    console.log("Data being sent:", data); // Log the data before sending it

    try {
      const response = await fetch("http://localhost:5050/adminlog_reg/adminregister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage(data.message); // Success message
        setFormData({ username: "", password: "", confirmPassword: "" }); // Clear form
      } else {
        setMessage(data.error || "Registration failed."); // Show error message
      }
    } catch (error) {
      setMessage("Error registering user.");
      console.error("Error during registration:", error); // Log error to console
    }
  };

  return (
    <div className={styles.registerBg}>
      <div className={styles.adminLoginLogo}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
      </div>
      
      {/* Title Section */}
      <div className={styles.adminLoginTitle}>
        <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
        <h4 className={styles.adminSystemTitle2}>The Technological University of the Philippines Alumni Tracer System</h4>
        <h5 className={styles.adminSystemTitle3}>REGISTRATION</h5>
      </div>

      <div className={styles.registerContainer}>
        <form onSubmit={registerUser} className={styles.registerForm}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={data.confirmPassword}
            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
          />
          <button type="submit">Register</button>
        </form>
        <p>{message}</p>
        <button
          className={styles.loginButton}
          onClick={() => navigate('/login')}
        >
        LOGIN
        </button>
      </div>
    </div>
  );
};

export default AdminRegister;
