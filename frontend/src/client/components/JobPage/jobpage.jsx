import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './jobpage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Header from '../Header/header';
import Footer from '../FooterClient/Footer';

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
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowContent(true), 100); // delay before showing
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const goToGive = () => navigate('/JobPageGive');
  const goToList = () => navigate('/JobPageList');

  return (
    <>
      {loading ? (
        <div className="loadingOverlay">
          <div className="loaderContainer">
            <svg viewBox="0 0 240 240" height="80" width="80" className="loader">
              <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className="pl__ring pl__ringA"></circle>
              <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className="pl__ring pl__ringB"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className="pl__ring pl__ringC"></circle>
              <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className="pl__ring pl__ringD"></circle>
            </svg>
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className={`JobPageContainer fadeInUp`}>
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
    </>
  );
}

export default JobPage;
