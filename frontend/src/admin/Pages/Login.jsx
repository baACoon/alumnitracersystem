import { useState } from 'react';
import Tuplogo from '../components/images/Tuplogo.png';
import Alumnilogo from '../components/images/alumniassoc_logo.png'
import styles from './Login.module.css'; // Updated to use module.css
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
    <div className={styles.adminBg}>
      <div className={styles.adminLoginLogo}>
        <img src={Tuplogo} alt="TUP logo" className={styles.logo1} />
        <img src={Alumnilogo} alt="Alumni logo" className={styles.logo2} />
      </div>

      {/* Title Section */}
      <div className={styles.adminLoginTitle}>
        <h3 className={styles.adminSystemTitle1}>TUPATS</h3>
        <h4 className={styles.adminSystemTitle2}>The Technological University of the Philippines Alumni Tracer System</h4>
        <h5 className={styles.adminSystemTitle3}>ADMIN ACCESS</h5>
      </div>

      <div className={styles.adminLoginContainer}>
        <form className={styles.adminLoginForm} onSubmit={loginAdmin}>
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
