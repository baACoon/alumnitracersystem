import React, { useState, useEffect } from 'react';
import '../../components/Styles/popup.css';
import './profile.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import ProfilePic from '../../components/image/ayne.jpg';
import { useNavigate } from 'react-router-dom';
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
  const [profileData, setProfileData] = useState({
    personalInfo: {},
    employmentInfo: {},
    surveys: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Session expired. Please log in again.");
          navigate('/frontpage');
          return;
        }

        // Verify token
        try {
          const decoded = jwtDecode(token);
          if (!decoded.id) throw new Error('Invalid token');
        } catch (err) {
          alert("Invalid session. Please log in again.");
          localStorage.removeItem('token');
          navigate('/frontpage');
          return;
        }

        // Fetch profile data
        const response = await fetch('https://alumnitracersystem.onrender.com/profile/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const renderSurveys = () => {
    if (!profileData.surveys || profileData.surveys.length === 0) {
      return <p>No surveys completed yet.</p>;
    }

    return (
      <div className="survey-summary">
        <h3>Completed Surveys</h3>
        {profileData.surveys.map((survey, index) => (
          <div key={survey._id} className="survey-item">
            <h4>Survey #{index + 1}</h4>
            <div className="survey-details">
              <p>Date Completed: {new Date(survey.createdAt).toLocaleDateString()}</p>
              <p>College: {survey.personalInfo?.college}</p>
              <p>Course: {survey.personalInfo?.course}</p>
              <p>Work Alignment: {survey.employmentInfo?.work_alignment}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="profile-container">
      <section className="personal-info">
        <h2>PERSONAL INFORMATION</h2>
        <div className="profile-section">
          <div className="details">
            <div className="row-group">
              <div className="row">
                <label>College</label>
                <input type="text" value={profileData.personalInfo?.college || ''} readOnly />
              </div>
              <div className="row">
                <label>Course</label>
                <input type="text" value={profileData.personalInfo?.course || ''} readOnly />
              </div>
              <div className="row">
                <label>Degree</label>
                <input type="text" value={profileData.personalInfo?.degree || ''} readOnly />
              </div>
            </div>

            <div className="row">
              <label>Name</label>
              <input
                type="text"
                value={`${profileData.personalInfo?.firstName || ''} ${profileData.personalInfo?.middleName || ''} ${profileData.personalInfo?.lastName || ''}`}
                readOnly
              />
            </div>

            <div className="row">
              <label>Address</label>
              <input type="text" value={profileData.personalInfo?.address || ''} readOnly />
            </div>

            <div className="row">
              <label>Birthday</label>
              <input type="text" value={profileData.personalInfo?.birthday || ''} readOnly />
            </div>

            <div className="row">
              <label>Email</label>
              <input type="text" value={profileData.personalInfo?.email || ''} readOnly />
            </div>

            <div className="row">
              <label>Contact No.</label>
              <input type="text" value={profileData.personalInfo?.contact_no || ''} readOnly />
            </div>
          </div>
        </div>
      </section>
      
      <section className="employment-status">
        <h2>Employment Status</h2>
        <div className="details">
          <div className="row">
            <label>Occupation</label>
            <input type="text" value={profileData.employmentInfo?.occupation || ''} readOnly />
          </div>

          <div className="row">
            <label>Company</label>
            <input type="text" value={profileData.employmentInfo?.company_name || ''} readOnly />
          </div>

          <div className="row">
            <label>Position</label>
            <input type="text" value={profileData.employmentInfo?.position || ''} readOnly />
          </div>

          <div className="row">
            <label>Job Status</label>
            <input type="text" value={profileData.employmentInfo?.job_status || ''} readOnly />
          </div>

          <div className="row">
            <label>Year Started</label>
            <input type="text" value={profileData.employmentInfo?.year_started || ''} readOnly />
          </div>

          <div className="row">
            <label>Organization Type</label>
            <input type="text" value={profileData.employmentInfo?.type_of_organization || ''} readOnly />
          </div>

          <div className="row">
            <label>Work Alignment</label>
            <input type="text" value={profileData.employmentInfo?.work_alignment || ''} readOnly />
          </div>
        </div>
      </section>

      <section className="survey-summary">
        {renderSurveys()}
      </section>
    </div>
  );
}

export default Profile;