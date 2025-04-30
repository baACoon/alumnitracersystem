import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './jobpage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/header';
import Footer from '../FooterClient/Footer';

function JobPage() {
  return (
    <div className="page-wrapper">
      <Header />
      <div className="page-body">
        <JobPageMainPage />
      </div>
      <Footer />
    </div>
  );
}

function JobPageMainPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 100);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const goToGive = () => navigate('/JobPageGive');
  const goToList = () => navigate('/JobPageList');

  return (
    <div className="JobPageWrapper">
      {loading ? (
          <div className="loadingOverlay">
          <div className="loaderContainer">
            <div className="loader"></div>
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="JobPageContainer fadeInUp">
          {showContent && (
            <>
              <div onClick={goToGive} className="JobPageBox animatedBox">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="JobPageIcon" />
                <h3>GIVE OPPORTUNITY TO OTHERS</h3>
              </div>
              <div onClick={goToList} className="JobPageBox animatedBox">
                <FontAwesomeIcon icon={faBriefcase} className="JobPageIcon" />
                <h3>OPPORTUNITIES</h3>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default JobPage;
