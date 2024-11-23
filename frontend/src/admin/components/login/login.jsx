import React, { useState } from "react";
import "./login.css"; // Adjust the import based on your file structure

const Login = () => {
  // State management for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // Add backend API call or validation logic here
    if (username && password) {
      console.log("Logging in with:", { username, password });
      
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div>
      {/* Logo Section */}
      <div className="admin-logo">
        <img src="../image/Tuplogo.png" alt="logo_1" className="logo_1" />
        <img src="../image/alumniassoc_logo.png" alt="logo_2" className="logo_2" />
      </div>

      {/* Title Section */}
      <div className="admin-title">
        <h1>TUPATS</h1>
        <h2>The Technological University of the Philippines Alumni Tracer System</h2>
        <h5>ADMIN ACCESS</h5>
      </div>

      {/* Login Form Section */}
      <div className="login_container">
        <form className="login_form" onSubmit={handleLogin}>
          <h4>Username</h4>
          <input
            type="text"
            id="admin_user"
            name="admin_user"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <h4>Password</h4>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-actions">
            <a className="forgotpassword" href="#">
              Forgot Password? <span>Click Here</span>
            </a>
            <button type="submit" className="login-button">
              LOGIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
