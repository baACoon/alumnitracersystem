import React from 'react';
import { useNavigate } from 'react-router-dom';
import './jobpage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';

function JobPage() {
  return (
    <div>
      <Header />
      <JobPageMainPage />
      <Footer />
    </div>
  );
}

function JobPageMainPage() {
  const navigate = useNavigate();

  const goToGive = () => {
    navigate('/JobPageGive');
  };

  const goToList = () => {
    navigate('/JobPageList');
  };

  return (
    <div className="JobPageContainer">
      <div onClick={goToGive} className="JobPageOption-1 JobPageBox">
        <FontAwesomeIcon icon={faHandHoldingHeart} className="JobPageIcon" />
        <h3>GIVE OPPORTUNITY FOR OTHERS</h3>
      </div>
      <div onClick={goToList} className="JobPageOption-2 JobPageBox">
        <FontAwesomeIcon icon={faBriefcase} className="JobPageIcon" />
        <h3>OPPORTUNITIES</h3>
      </div>
    </div>
  );
}

export default JobPage;
