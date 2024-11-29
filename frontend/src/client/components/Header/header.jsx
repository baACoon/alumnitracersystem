import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/Styles/popup.css';
import '../Header/header.css';
import '../../components/Styles/footer.css';
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'

function Header() {
    const navigate = useNavigate();

    const goToHome = () => {
      navigate('/Home');
    };
  
    const goToSurveys = () => {
      navigate('/Survey');
    };

    const goToEvents = () => {
      navigate('/Events');
    };

    const goToJob = () => {
      navigate('/Opportunities');
    };

    const goToContact = () => {
      navigate('/Contact');
    };

    const goToProfile = () => {
      navigate('/Profile');
    };


  return (

    <div className="header-container">
    {/* Logo Section */}
    <div className="header-logo">
      <img src={Tuplogo} alt="TUP Logo" className='header-logo-1'/>
      <img src={Alumnilogo} alt="Alumni Logo" className='header-logo-2' />
    </div>

    {/* Banner Section */}
    <div className="header-banner">
      <h1>The Technological University of the Philippines - Alumni Tracer System</h1>
      <h2><i>Your Journey, Our Legacy</i></h2>
    </div>

    {/* Navbar Section */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger" id="navbar">
      <div className="container-fluid">
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a onClick={goToHome} className="nav-link active" aria-current="page">
                HOME
              </a>
            </li>
            <li className="nav-item">
              <a onClick={goToSurveys} className="nav-link">
                SURVEYS
              </a>
            </li>
            <li className="nav-item">
              <a onClick={goToEvents} className="nav-link">
                EVENTS
              </a>
            </li>
            <li className="nav-item">
              <a onClick={goToJob} className="nav-link">
                OPPORTUNITIES
              </a>
            </li>
            <li className="nav-item">
              <a onClick={goToContact} className="nav-link">
                CONTACT US
              </a>
            </li>
          </ul>
          <div className="d-flex">
            <a onClick={goToProfile} className="btn btn-outline-light">
              PROFILE
            </a>
          </div>
        </div>
      </div>
    </nav>
  </div>
  );
}

export default Header