import React, { useState, useEffect } from 'react';
import './register.css'; // Ensure CSS is correctly imported


function LoginPage() {
  const [showModal, setShowModal] = useState(true); // Set initial state to true to open the modal immediately

  const closeModal = () => {
    document.body.style.overflow = ''; // Restore background scrolling
    setShowModal(false); // Close the modal
  };

  // Optional: If you want to open the modal based on a specific event, you can handle it here
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Prevent background scrolling when modal is open
    return () => {
      document.body.style.overflow = ''; // Restore background scrolling when component unmounts
    };
  }, []);

  return (
    <div>
      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" >
          <div className="modal-content"       
        onClick={(e) => e.stopPropagation()} >
            {/* Close Button */}
            <span className="close" onClick={closeModal} >
              &times;
            </span>


            {/* Login Form */}
            <h2>Register For</h2>
            <form method="POST" action="/Alumni-Tracking-System/backend/log_reg.php">
              <label htmlFor="college">College:</label>
              <select id="college" name="college">
                <option value="COE">College of Engineering</option>
                <option value="COS">College of Science</option>
                <option value="CIE">College of Industrial Education</option>
                <option value="CLA">College of Liberal Arts</option>
                <option value="CAFA">College of Architecture and Fine Arts</option>
              </select>
              <br />
              <br />

              <label htmlFor="tup_id">TUP-ID:</label>
              <input type="text" id="tup_id" name="tup_id" placeholder="TUPM - ## - ####" required />
              <br />
              <br />

              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required />
              <br />
              <br />

              <label htmlFor="birthdate">Birthdate:</label>
              <input type="date" id="birthdate" name="birthdate" required />
              <br />
              <br />

              <button type="submit" name="login_user">Login</button>
              <span>
                Forgot Password? <a href="#">Click here</a>
              </span>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
