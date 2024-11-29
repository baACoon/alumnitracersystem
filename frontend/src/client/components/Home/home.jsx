import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css'
import Header from '../Header/header'
import Footer from '../../../admin/components/Footer/Footer';


function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    // Mock session data (replace with actual logic to fetch session data in production)
    const session = {
      show_popup: true,
      success: 'You are now registered!',
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
      <Footer/>
    </div>
  );

  function Popup({ message, onClose }) {
    return (
      <div className="pop-background" id="popBackground">
        <div className="popup" id="welcomePopup">
          <p>{message}</p>
          <button className="popbutton" onClick={onClose}>OK</button>
        </div>
      </div>
    );
  }
}


export default Home;
