import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css'; // Import CSS module
import Header from '../Header/header';
import Footer from '../FooterClient/Footer';
import FooterClient from '../FooterClient/Footer';
import ArticleClient from '../Articles/articlesclient';

function Home() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate(); // Initialize the navigate function
    const handleCrossCheckSurveyFormClick = () => navigate('/RegisterSurveyForm');

    useEffect(() => {
        const session = {
            
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
        <div className={showPopup ? styles.popupVisible : ''}>
            <Header />
            {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
            <HomePage />
            <Tupats />
            <Slanted />
            <ArticleClient/>
            <FooterClient />
            
        </div>
    );

    function Popup({ message, onClose }) {
        return (
            <div className={styles.popBackground} id="popBackground">
                <div className={styles.popup} id="welcomePopup">
                    <p>{message}</p>

                </div>
            </div>
        );
    }
}

function HomePage() {
    const [stats, setStats] = useState({
      totalAlumni: 0,
      employedAlumni: 0,
      alignedAlumni: 0,
    });
  
    const [employmentDisplay, setEmploymentDisplay] = useState(0);
    const [alignmentDisplay, setAlignmentDisplay] = useState(0);
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const baseURL = "https://alumnitracersystem.onrender.com/dashboard";
          const responses = await Promise.all([
            fetch(`${baseURL}/total-alumni`),
            fetch(`${baseURL}/employed-alumni`),
            fetch(`${baseURL}/course-aligned-alumni`),
          ]);
  
          if (!responses.every(res => res.ok)) {
            throw new Error("One or more requests failed");
          }
  
          const [totalData, employedData, alignedData] = await Promise.all(
            responses.map(res => res.json())
          );
  
          const total = totalData.totalAlumni || 0;
          const employed = employedData.employedAlumni || 0;
          const aligned = alignedData.alignedAlumni || 0;
  
          setStats({ totalAlumni: total, employedAlumni: employed, alignedAlumni: aligned });
  
          const employmentRate = total ? Math.round((employed / total) * 100) : 0;
          const alignmentRate = total ? Math.round((aligned / total) * 100) : 0;
  
          animateCount(employmentRate, alignmentRate);
        } catch (error) {
          console.error("Error fetching home page data:", error);
        }
      };
  
      const animateCount = (targetEmp, targetAlign) => {
        let emp = 0;
        let align = 0;
        const duration = 1500;
        const step = 20;
        const steps = duration / step;
        const empStep = targetEmp / steps;
        const alignStep = targetAlign / steps;
  
        const interval = setInterval(() => {
          emp += empStep;
          align += alignStep;
  
          setEmploymentDisplay(Math.min(emp, targetEmp));
          setAlignmentDisplay(Math.min(align, targetAlign));
  
          if (emp >= targetEmp && align >= targetAlign) {
            clearInterval(interval);
          }
        }, step);
      };
  
      fetchStats();
    }, []);
  
    return (
        <div className={styles.homebg}>
            <div className={styles.homePercentage}>
                <div className={styles.percent1}>
                <h1>{Math.round(employmentDisplay)}%</h1>
                <h2>Employability Rate of TUP Alumni</h2>
                </div>

                <div className={styles.percent2}>
                <h1>{Math.round(alignmentDisplay)}%</h1>
                <h2>Aligned with Specialized Course</h2>
                </div>
            </div>
        </div>

    );
}

function Tupats() {
    return (
        <div className={styles.tupats}>
            <div className={styles.tupatsContainer}>
                <h1>TUPATS</h1>
                <p>
                    The Technological University of the Philippines - Alumni Tracer
                    System <b>(TUPATS)</b> is the unofficial alumni tracer system of
                    TUP-Manila where it serves to monitor and collect data from the
                    university’s alumnus on their employment status after graduating.
                    The data collected will help to assess whether the university is
                    upholding its responsibility as an educational institution.
                </p>
            </div>
        </div>
    );
}

function Slanted() {
  const navigate = useNavigate();

  return (
      <div className={styles.slantedContainer}>
          <div
              className={styles.slantedBox}
              onClick={() => navigate('/SurveyPage')}
          >
              <h2>BE THE REASON WHY TUP IS THE BEST</h2>
              <p>Participate and answer survey and tracer forms.</p>
          </div>

          <div
              className={styles.slantedBox}
              onClick={() => navigate('/Events')}
          >
              <h2>ENJOY UNIVERSITY EVENTS</h2>
              <h2>AS AN ALUMNI</h2>
              <p>
                  Even after graduating, alumni are still included and invited to
                  participate in university events.
              </p>
          </div>

          <div
              className={styles.slantedBox}
              onClick={() => navigate('/JobPage')}
          >
              <h2>GIVE OR GET</h2>
              <h2>THE OPPORTUNITY</h2>
              <p>
                  See the opportunities given by the community or be the opportunity
                  itself.
              </p>
          </div>
      </div>
  );
}



export default Home;