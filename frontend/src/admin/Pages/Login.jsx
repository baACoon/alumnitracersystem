import { useState } from 'react';

import "./Login.css";

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const loginAdmin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5050/record/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Login successful!");
        console.log("Token:", result.token); // Store token for authenticated requests
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage("Error logging in.");
      console.error(error);
    }
  };

  return (
    <div className='admin-bg'>
      <div className="admin-login-logo">
        <img src={Tuplogo} alt="TUP logo" className="logo-1" />
        <img src={Alumnilogo} alt="Alumni logo" className="logo-2" />
      </div>

      {/* Title Section */}
      <div className="admin-login-title">
        <h3 className='admin-system-title-1'>TUPATS</h3>
        <h4 className='admin-system-title-2'>The Technological University of the Philippines Alumni Tracer System</h4>
        <h5 className="admin-system-title-3">ADMIN ACCESS</h5>
      </div>

      <div className='admin-login-container'>
        <form className='admin-login-form'onSubmit={loginAdmin}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="submit">LOGIN</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
  );
}
