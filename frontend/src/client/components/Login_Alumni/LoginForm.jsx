import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const TestLoginForm = ({ closeModal }) => {
  const [alumniID, setAlumniID] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = { alumniID, password };

    console.log('Login attempt with:', formData); // Debug log

    try {
      const response = await fetch('http://tupalumni.com/record/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Server response:', response.status, data); // Debug log

      if (response.ok) {
        alert('Login successful!');
        closeModal();
        navigate('/home');
      } else {
        alert(`Error: ${data.error || 'Login failed'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('There was an error with the login request.');
    }
  };

  return (
    <div className="modal-overlay-login">
      <div className="modal-content-login">
        <button className="close-btn-login" onClick={closeModal}>&times;</button>
        <h2 className="modal-title-login">LOGIN</h2>
        <form onSubmit={handleLogin} className="login-form">
          <h5>Alumni ID</h5>
          <input
            type="text"
            placeholder="Alumni ID"
            value={alumniID}
            onChange={(e) => setAlumniID(e.target.value)}
            required
            className="input-field-login"
          />
          <h5>Enter Password</h5>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field-login"
          />
          <button type="submit" className="submit-btn-login">Login</button>
        </form>
      </div>
    </div>
  );
};

export default TestLoginForm;