import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './jobpagegive.css';

import Header from '../Header/header';
import Footer from '../FooterClient/Footer';


function JobPageGive() {
  return (
    <div>
      <Header />
      <JobGiveMainPage />
      <Footer />
    </div>
  );
}

function JobGiveMainPage() {
    const navigate = useNavigate();

    const goToJobPage = () => {
      navigate('/JobPage');
    };

    const goToAddJob = () => {
      navigate('/JobPageGive/addjobForm');
    };
    


    return (
      <div className="givecontainer">
        <a onClick={goToJobPage} className="back-button">Back</a>
        <div className="title-container">
          <h1 className="give-title">OPPORTUNITIES POSTED</h1>
          <button className="add-button" onClick={goToAddJob}>
            ADD
          </button>
        </div>
        <td></td>
        <div className="giveoption">
          <h4 className="give-status">POSTED</h4>
          <div className="give-details">
            <h3>Front End Developer</h3>
            <h5>Makati City</h5>
            <h5>Full Time</h5>
          </div>
          <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />
          
        </div>
        <div className="giveoption">
          <h4 className="give-status">POSTED</h4>
          <div className="give-details">
            <h3>Back End Developer</h3>
            <h5>Quezon City</h5>
            <h5>Part Time</h5>
          </div>
          <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />
          
        </div>
        <div className="giveoption">
          <h4 className="give-status">POSTED</h4>
          <div className="give-details">
            <h3>UI/UX Designer</h3>
            <h5>Pasig City</h5>
            <h5>Freelance</h5>
          </div>
          <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />

        </div>
        <div className="giveoption-pending">
          <h4 className="give-status-pending">PENDING</h4>
          <div className="give-details">
            <h3>Project Manager</h3>
            <h5>Taguig City</h5>
            <h5>Full Time</h5>
          </div>
          <FontAwesomeIcon icon={faTrashCan} className="JobPageGiveIcon" />
        </div>
      </div>
    );
}

export default JobPageGive;
