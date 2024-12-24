import React, { useState, useEffect } from 'react';
import '../../components/Styles/popup.css';
import './profile.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import ProfilePic from '../../components/image/ayne.jpg';
import { jwtDecode } from 'jwt-decode';

function Profile() {
  return (
    <div>
      <Header />
      <ProfilePage />
      <Footer />
    </div>
  );
}

function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/profile';
          return;
        }

        // Decode token and check if it's valid
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          if (!decoded.id) {
            throw new Error('Invalid token');
          }
        } catch (tokenError) {
          localStorage.removeItem('token');
          window.location.href = '/profile';
          return;
        }

        const response = await fetch('http://localhost:5050/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        if (data.profile && data.surveys) {
          setUserData(data.profile);
          setSurveyData(data.surveys);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
        
        // Don't redirect immediately, show the error instead
        if (err.message === 'Invalid token') {
          localStorage.removeItem('token');
          window.location.href = '/Profile';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add survey display section
  const renderSurveys = () => {
    if (!surveyData || surveyData.length === 0) {
      return <p>No surveys completed yet.</p>;
    }

    return (
      <div className="survey-summary">
        <h3>Completed Surveys</h3>
        {surveyData.map((survey, index) => (
          <div key={index} className="survey-item">
            <h4>Survey #{index + 1}</h4>
            {/* Add your survey display logic here based on your data structure */}
            <div className="survey-details">
              <p>Date Completed: {new Date(survey.completedAt).toLocaleDateString()}</p>
              {/* Add more survey details as needed */}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className='profile-container'>
      <section className='personal-info'>
        <h2>PERSONAL INFORMATION</h2>
        <div className='profile-section'>
          <div className='details'>
            <div className='row-group'>
              <div className='row'>
                <label>College</label>
                <input type='text' value={userData.college || ''} readOnly />
              </div>
              <div className='row'>
                <label>Course</label>
                <input type='text' value={userData.course || ''} readOnly />
              </div>
              <div className='row'>
                <label>Degree</label>
                <input type='text' value={userData.degree || ''} readOnly />
              </div>
            </div>

            <div className='row'>
              <label>Name</label>
              <input 
                type='text' 
                value={`${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`} 
                readOnly 
              />
            </div>

            <div className='row'>
              <label>Address</label>
              <input type='text' value={userData.address || ''} readOnly />
            </div>

            <div className='row'>
              <label>Birthday</label>
              <input type='text' value={userData.birthday || ''} readOnly />
            </div>

            <div className='row'>
              <label>Email</label>
              <input type='text' value={userData.email || ''} readOnly />
            </div>

            <div className='row'>
              <label>Contact No.</label>
              <input type='text' value={userData.contact_no || ''} readOnly />
            </div>
          </div>
        </div>
      </section>

      <section className='employment-status'>
        <h2>Employment Status</h2>
        <div className='details'>
          <div className='row'>
            <label>Occupation</label>
            <input type='text' value={userData.occupation || ''} readOnly />
          </div>

          <div className='row'>
            <label>Company</label>
            <input type='text' value={userData.company_name || ''} readOnly />
          </div>

          <div className='row'>
            <label>Position</label>
            <input type='text' value={userData.position || ''} readOnly />
          </div>

          <div className='row'>
            <label>Job Status</label>
            <input type='text' value={userData.job_status || ''} readOnly />
          </div>

          <div className='row'>
            <label>Year Started</label>
            <input type='text' value={userData.year_started || ''} readOnly />
          </div>

          <div className='row'>
            <label>Organization Type</label>
            <input type='text' value={userData.type_of_organization || ''} readOnly />
          </div>

          <div className='row'>
            <label>Work Alignment</label>
            <input type='text' value={userData.work_alignment || ''} readOnly />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
