import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate for redirection
import Register_OldAlumni from '../Register_OldAlumni/register_oldalumni';  // Form for users with Alumni ID
import Register_NewAlumni from '../Register_NewAlumni/register_newalumni';  // Form for users without Alumni ID
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'
import './registerselection.css'


const RegisterSelection = () => {
  // State to manage modal visibility
  const [showRegister_NewAlumniModal, setShowRegister_NewAlumniModal] = useState(false);
  const [showRegister_OldAlumniModal, setShowRegister_OldAlumniModal] = useState(false);
  const navigate = useNavigate();  // Initialize the navigate function

  const handleLoginBackClick = () => navigate('../testfrontpage');  // Redirect to RegisterSelection page

  // Function to open the No Alumni ID modal
  const openRegister_NewAlumniModal = () => setShowRegister_NewAlumniModal(true);

  // Function to open the With Alumni ID modal
  const openRegister_OldAlumniModal = () => setShowRegister_OldAlumniModal(true);

  // Function to close the modal
  const closeModal = () => {
    setShowRegister_NewAlumniModal(false);
    setShowRegister_OldAlumniModal(false);
  };

  return (
    <div className="registerselection-container">
        <div className="logo">
            <img src={Tuplogo} alt="TUP logo" className="logo-1" />
            <img src={Alumnilogo} alt="Alumni logo" className="logo-2" />
        </div>
        <div className="system-title">
            <h3 className='system-title-1'>TUPATS</h3>
            <h4 className='system-title-2'>The Technological University of the Philippines Alumni Tracer System</h4>
        </div>

        <h2>Select Registration Type</h2>
        <div className="registerselection-btn">
            <button className="btn-NoAlumniID" onClick={openRegister_NewAlumniModal}>No Alumni ID</button>
            <button className="btn-WithAlumniID" onClick={openRegister_OldAlumniModal}>With Alumni ID</button>
    
            {/* Conditional Rendering Based on Selected Option */}
            {showRegister_NewAlumniModal && <Register_NewAlumni closeModal={closeModal} />}
            {showRegister_OldAlumniModal && <Register_OldAlumni closeModal={closeModal} />}
      </div>
      <button className="regselect-back"onClick={handleLoginBackClick}>BACK</button>
    </div>
    
  );
};

export default RegisterSelection;
