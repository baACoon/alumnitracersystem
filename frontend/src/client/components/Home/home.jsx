import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/Styles/popup.css';
import '../../components/Styles/header.css';
import '../../components/Styles/footer.css';
import './home.css';
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'

function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    // Mock session data (replace with actual logic to fetch session data in production)
    const session = {
      show_popup: true,
      success: 'You are now registered!',
      tup_id: '123456',
    };

    if (session.show_popup) {
      setShowPopup(true);
      if (session.success) {
        setPopupMessage(session.success);
      } else if (session.tup_id) {
        setPopupMessage(`Welcome, ${session.tup_id}!`);
      }
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={showPopup ? 'popup-visible' : ''}>
      <Header />

    </div>
  );
}

function Header() {

    const navigate = useNavigate();

    const goToHome = () => {
      navigate('/Home');
    };
  
    const goToSurveys = () => {
      navigate('/Survey');
    };

  return (
    <header>
      <div className="header-container">
        <div className="header-logo">
          <div className="header-logo-1">
            <img src={Tuplogo} alt="TUP Logo" />
          </div>
          <div className="header-logo-2">
            <img src={Alumnilogo} alt="TUP Manila Association Logo" />
          </div>
        </div>

        <div className="header-banner">
          <h1>The Technological University of the Philippines - Alumni Tracer System</h1>
          <h2><i>Your Journey, Our Legacy</i></h2>
        </div>

        <nav className="navbar navbar-expand-lg navbar-dark bg-danger" id='navbar'>
            <div className="container-fluid">

                {/* Navbar Toggler for Mobile View */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
                {/* Collapsible Navbar Items */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {/* Navigation Links */}
                        <li className="nav-item">
                            <a onClick={goToHome}  className="nav-link active" aria-current="page">
                                HOME
                            </a>
                        </li>
                        <li className="nav-item">
                            <a onClick={goToSurveys}  className="nav-link">
                                SURVEYS
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="events.php">
                                EVENTS
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="opportunities.php">
                                OPPORTUNITIES
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="contact.php">
                                CONTACT US
                            </a>
                        </li>
                    </ul>
                    
                    {/* Profile Button */}
                    <div className="d-flex">
                        <a className="btn btn-outline-light" href="profile.php">
                            PROFILE
                        </a>
                    </div>
                </div>
            </div>
        </nav>
      </div>
    </header>
  );
}


export default Home;
