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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const logout = () => {
    localStorage.removeItem("token-info");
    setIsLoggedin(false);
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
                value={`${profileData.personalInfo?.first_name || ''} ${profileData.personalInfo?.middle_name || ''} ${profileData.personalInfo?.last_name || ''}`}
                readOnly
              />
            </div>

            <div className="row">
              <label>Address</label>
              <input type="text" value={profileData.personalInfo?.address || ''} readOnly />
            </div>

            <div className="row">
              <label>Birthday</label>
              <input type="text" value={formatDate(profileData.personalInfo?.birthday) || ''} readOnly />
            </div>

            <div className="row">
              <label>Email</label>
              <input type="text" value={profileData.personalInfo?.email_address || ''} readOnly />
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

      <section className="completed-surveys">
        
        {profileData.surveys?.map((survey, index) => (
          <div key={survey._id} className="survey-item">
            <p>Date Completed: {formatDate(survey.createdAt)}</p>
          </div>
        ))}
      </section>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;