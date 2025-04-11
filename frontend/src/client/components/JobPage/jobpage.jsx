import React, { useState, useEffect} from 'react';
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay (3 seconds)
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);


  const goToGive = () => {
    navigate('/JobPageGive');
  };

  const goToList = () => {
    navigate('/JobPageList');
  };

  return (
    
    <>
      {/* Show Loading Animation */}
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
        <div className="JobPageContainer">
          <div onClick={goToGive} className="JobPageOption-1 JobPageBox">
            <FontAwesomeIcon icon={faHandHoldingHeart} className="JobPageIcon" />
            <h3>GIVE OPPORTUNITY TO  OTHERS</h3>
          </div>
          <div onClick={goToList} className="JobPageOption-2 JobPageBox">
            <FontAwesomeIcon icon={faBriefcase} className="JobPageIcon" />
            <h3>OPPORTUNITIES</h3>
          </div>
        </div>
      )}
    </>
  );
}

export default JobPage;
