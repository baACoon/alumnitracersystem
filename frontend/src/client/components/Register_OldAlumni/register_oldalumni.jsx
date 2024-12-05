import React, { useState } from 'react';
import './register_oldalumni.css'

const Register_OldAlumni = ({ closeModal }) => {
    const [alumniID, setAlumniID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleInitial, setMiddleInitial] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
      }
      console.log({
        alumniID,
        firstName,
        lastName,
        middleInitial,
        password,
      });
      closeModal();  // Close modal after submission
    };

    return (
      <div className="modal-overlay-old-alumni">
        <div className="modal-content-old-alumni">
          <button className="close-btn-old-alumni" onClick={closeModal}>&times;</button>
          <h2 className="modal-title-old-alumni">Register with Alumni ID</h2>
          <form onSubmit={handleSubmit} className="register-form-old-alumni">
            {/* Alumni ID Field */}
            <input
              type="text"
              placeholder="Alumni ID"
              value={alumniID}
              onChange={(e) => setAlumniID(e.target.value)}
              required
              className="input-field-old-alumni"
            />

            {/* Name Fields */}
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="input-field-old-alumni"
            />
            <input
              type="text"
              placeholder="Middle Initial"
              value={middleInitial}
              onChange={(e) => setMiddleInitial(e.target.value)}
              required
              className="input-field-old-alumni"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="input-field-old-alumni"
            />

            {/* Password and Confirm Password Fields */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field-old-alumni"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="input-field-old-alumni"
            />

            <button type="submit" className="submit-btn-old-alumni">Register</button>
          </form>
        </div>
      </div>
    );
};

export default Register_OldAlumni;
