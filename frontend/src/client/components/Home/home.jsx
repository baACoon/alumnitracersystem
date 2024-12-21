import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'
import Header from '../Header/header'
import Footer from '../../../admin/components/Footer/Footer';
import FooterClient from '../FooterClient/Footer';


function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function
    const handleCrossCheckSurveyFormClick = () => navigate('/RegisterSurveyForm');

  useEffect(() => {
    // Mock session data (replace with actual logic to fetch session data in production)
    const session = {
      show_popup: true,
      success: 'Welcome to TUPATS!',
      tup_id: '123456',
    };

    if (session.show_popup) {
      setShowPopup(true);
      if (session.success) {
        setPopupMessage(session.success);
      } else if (session.tup_id) {
        setPopupMessage(`Welcome, ${session.tup_id}!`);
      }
    }
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={showPopup ? 'popup-visible' : ''}>
      <Header />
      {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
      <HomePage/>
      <Tupats/>
      <Slanted/>
      <Articles/>
      <FooterClient/>
      <Footer/>
    </div>
  );

  function Popup({ message, onClose }) {
    return (
      <div className="pop-background" id="popBackground">
        <div className="popup" id="welcomePopup">
          <p>{message}</p>
          <button className="popbutton" onClick={handleCrossCheckSurveyFormClick} >Go to Survey</button>
        </div>
      </div>
    );
  }
}

function HomePage () {

  return (
    <div className='home-bg'>

      <div className='home-percentage'>
        <div className='percent-1'>
          <h1>97%</h1>
          <h2>Employability Rate of TUP Alumni</h2>
        </div>

        <div className='percent-2'>
          <h1>81%</h1>
          <h2>Aligned with Specialized Course</h2>
        </div>
      </div>
    </div>

  );
}

function Tupats () {
    return(
      <div className='TUPATS'>
        <div className='TUPATS-container'>
          <h1>TUPATS</h1>
            <p>The Technological University of the Philippines - Alumni Tracer System  
              <b> (TUPATS)</b> is the unofficial alumni tracer system of TUP-Manila where it’s 
              serves to monitor and collect data from the univerisity’s alumnus on their 
              employment status after graduating. The data  collected will help to assess 
              whether the university is upholding its responsibility as an educational 
              institution.
          </p>
        </div>
      </div>
    );

}

function Slanted () {
  return (

    <div className='slanted-container'>
        <div className="slanted-box">
            <h2>BE THE REASON ON WHY TUP IS THE BEST</h2>
            <p>Participate and answer survey and tracer forms.</p>
        </div>

        <div className="slanted-box">
            <h2>ENJOY UNIVERSITY EVENTS AS AN ALUMNI</h2>
            <p>Even after graduating, alumni are still included and invited to participate in university events.</p>
        </div>

        <div className="slanted-box">
            <h2>GET OR BE THE OPPORTUNITY</h2>
            <p>See the opportunities given by the community or be the opportunity itself.</p>
        </div>
    </div>
  );
}

function Articles () {
  return (

    <div className='article-container'>
          <div className="section-title">
            <h1>ARTICLES</h1>
            <hr/>
         </div>
    </div>
  );
}

export default Home;
