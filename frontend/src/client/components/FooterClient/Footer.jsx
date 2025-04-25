import React from "react";
import Tuplogo from "../../components/image/Tuplogo.png";
import Alumnilogo from "../../components/image/alumniassoc_logo.png";
import "./Footer.css";

function FooterClient() {
  return (
    <footer className="footer-client">
      <div className="footer-content">
        {/* Left Logo */}
        <div className="footer-logo">
          <img src={Alumnilogo} alt="Alumni Logo" />
        </div>

        {/* Text Content */}
        <div className="footer-text">
          <h1 className="footer-title">TUP-Manila Alumni Association Inc.</h1>
          <p className="footer-p">
            Bulwagang Alumni, Technological University of the Philippines, <br />
            Ayala Blvd. Ermita, Manila, <br />
            Manila, Philippines
          </p>
          <h2 className="socmed-title">
            <i>Visit Us @ facebook.com/TUPManilaAlumni</i>
          </h2>
        </div>

        {/* Right Logo */}
        <div className="footer-logo-2">
          <img src={Tuplogo} alt="TUP Logo" />
        </div>
      </div>
    </footer>
  );
}

export default FooterClient;
