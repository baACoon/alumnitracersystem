import React, { useState } from 'react';
import './testLoginForm.css'

const TestLoginForm = ({ closeModal }) => {
  const [alumniID, setAlumniID] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Implement login logic
    console.log('Alumni ID:', alumniID, 'Password:', password);
    closeModal();
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
