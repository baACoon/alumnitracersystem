import React, { useState, useEffect } from 'react';
import './login.css'; // Ensure CSS is correctly imported


function LoginPage() {
  const [tup_id, setTupId] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [action, setAction] = useState('login')
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

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing

    try {
      const response = await axios.post('http://localhost:8800/users', {
        tup_id,
        password,
        birthdate,
        college,
        action
      });

      if (response.data.success) {
        setSuccess(response.data.success);
        setError('');
        if (action ===  'login'){
          window.location.href = '../../home';
        }
      } else {
        setError(response.data.error || 'something went wrong');
        setSuccess('');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setSuccess('');
    }
  };

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
            <h2>Login Form</h2>
            {success && <div className="success-message">{success}</div>}
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <label htmlFor="college">College:</label>
              <select id="college" name="college" onChange={(e) => setCollege(e.target.value)}>
                <option value="COE">College of Engineering</option>
                <option value="COS">College of Science</option>
                <option value="CIE">College of Industrial Education</option>
                <option value="CLA">College of Liberal Arts</option>
                <option value="CAFA">College of Architecture and Fine Arts</option>
              </select>
              <br />
              <br />

              
              <label htmlFor="tup_id">TUP-ID:</label>
              <input type="text" 
              id="tup_id" 
              name="tup_id" 
              placeholder="TUPM - ## - ####" 
              value={tup_id} 
              onChange={(e) => setTupId(e.target.value)} 
              required/>
              <br />
              <br />

              <label htmlFor="password">Password:</label>
              <input type="password" 
              id="password" 
              name="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required/>
              <br />
              <br />

              <label htmlFor="birthdate">Birthdate:</label>
              <input type="date" 
              id="birthdate" 
              name="birthdate" 
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required />
              <br />
              <br />

              <button type="submit" name="login_user">{action === 'login' ? 'Login' : 'Register'}</button>
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
