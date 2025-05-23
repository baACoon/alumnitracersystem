"use client"
import { useNavigate, useLocation } from "react-router-dom"
import "../../components/Styles/popup.css"
import "../Header/header.css"
import Tuplogo from "../../components/image/Tuplogo.png"
import Alumnilogo from "../../components/image/alumniassoc_logo.png"

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="header-container">
      {/* Logo and Banner Section */}
      <div className="header-top">
        <div className="header-logo">
          <a onClick={() => navigate("/Home")}>
          <img src={Tuplogo || "/placeholder.svg"} alt="TUP Logo" className="header-logo-1" />
          <img src={Alumnilogo || "/placeholder.svg"} alt="Alumni Logo" className="header-logo-2" />
        </a>
        </div>

        <div className="header-banner">
          <h1>The Technological University of the Philippines - Alumni Tracer System</h1>
          <h2>
            <i>Your Journey, Our Legacy</i>
          </h2>
        </div>
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
                <a
                  onClick={() => navigate("/Home")}
                  className={`nav-link ${isActive("/Home") ? "active" : ""}`}
                  aria-current="page"
                >
                  HOME
                </a>
              </li>
              <li className="nav-item">
                <a
                  onClick={() => navigate("/SurveyPage")}
                  className={`nav-link ${isActive("/SurveyPage") ? "active" : ""}`}
                >
                  SURVEYS
                </a>
              </li>
              <li className="nav-item">
                <a onClick={() => navigate("/Events")} className={`nav-link ${isActive("/Events") ? "active" : ""}`}>
                  EVENTS
                </a>
              </li>
              <li className="nav-item">
                <a onClick={() => navigate("/JobPage")} className={`nav-link ${isActive("/JobPage") ? "active" : ""}`}>
                  OPPORTUNITIES
                </a>
              </li>
            </ul>

            <div className="d-flex">
              <a onClick={() => navigate("/Profile")} className={`nav-link ${isActive("/Profile") ? "active" : ""}`}>
                PROFILE
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Header