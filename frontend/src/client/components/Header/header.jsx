import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../components/Styles/popup.css';
import '../Header/header.css';
import Tuplogo from '../../components/image/Tuplogo.png';
import Alumnilogo from '../../components/image/alumniassoc_logo.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState("User"); // Default username

    useEffect(() => {
        // Fetch the user name from localStorage (or API in the future)
        const storedUser = localStorage.getItem("userName");
        if (storedUser) {
            setUserName(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        alert("You have been logged out.");
        navigate("/frontpage");
    };

    const handleChangePassword = () => {
        navigate("/change-password");
    };

    return (
        <div className="header-container">
            {/* Logo Section */}
            <div className="header-logo">
                <img src={Tuplogo} alt="TUP Logo" className="header-logo-1" />
                <img src={Alumnilogo} alt="Alumni Logo" className="header-logo-2" />
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
                                <a onClick={() => navigate("/Home")}
                                    className={`nav-link ${isActive("/Home") ? "active" : ""}`} aria-current="page">
                                    HOME
                                </a>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => navigate("/SurveyPage")}
                                    className={`nav-link ${isActive("/SurveyPage") ? "active" : ""}`}>
                                    SURVEYS
                                </a>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => navigate("/Events")}
                                    className={`nav-link ${isActive("/Events") ? "active" : ""}`}>
                                    EVENTS
                                </a>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => navigate("/JobPage")}
                                    className={`nav-link ${isActive("/JobPage") ? "active" : ""}`}>
                                    OPPORTUNITIES
                                </a>
                            </li>
                        </ul>

                        {/* Custom Profile Dropdown */}
                        <div className="select" onClick={() => setShowDropdown(!showDropdown)}>
                            <div className={`selected ${showDropdown ? 'active' : ''}`} data-one="profile">
                                {userName}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 512 512"
                                    className={`arrow ${showDropdown ? 'rotate' : ''}`}
                                >
                                    <path
                                        d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                                    ></path>
                                </svg>
                            </div>
                            {showDropdown && (
                                <div className="options">
                                    <div>
                                        <input id="profile" name="option" type="radio" checked="" />
                                        <label className="option"></label>
                                        <button className="dropdownButton" onClick={handleChangePassword}>Change Password</button>
                                        <button className="dropdownButton" onClick={handleLogout}>Logout</button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;
