import React from 'react';
import { useNavigate } from 'react-router-dom';
import './jobpagelist.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';

function JobPageList() {
  return (
    <div>
      <Header />
      <JobListMainPage />
      <Footer />
    </div>
  );
}

function JobListMainPage() {
  const navigate = useNavigate();

    const goToJobPage = () => {
      navigate('/JobPage');
    };


    return (
      <div className="listcontainer">
        <a onClick={goToJobPage} className="back-button">Back</a>
        <h1 className="list-title">OPPORTUNITIES</h1>
        <div className="listoption">
          <div className="list-details">
            <h3>Front End Developer</h3>
            <h5>Makati City</h5>
            <h5>Full Time</h5>
          </div>
          <h4 className="list-date">September 8, 2024</h4>
        </div>
        <div className="listoption">
          <div className="list-details">
            <h3>Back End Developer</h3>
            <h5>Quezon City</h5>
            <h5>Part Time</h5>
          </div>
          <h4 className="list-date">October 15, 2024</h4>
        </div>
        <div className="listoption">
          <div className="list-details">
            <h3>UI/UX Designer</h3>
            <h5>Pasig City</h5>
            <h5>Freelance</h5>
          </div>
          <h4 className="list-date">November 20, 2024</h4>
        </div>
        <div className="listoption">
          <div className="list-details">
            <h3>Project Manager</h3>
            <h5>Taguig City</h5>
            <h5>Full Time</h5>
          </div>
          <h4 className="list-date">December 1, 2024</h4>
        </div>
      </div>
    );
    
}

export default JobPageList;
