import React, { useState, useEffect } from 'react';
import '../../components/Styles/popup.css';
import './profile.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import ProfilePic from '../../components/image/ayne.jpg';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

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

        // Decode token to extract user ID
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        // Fetch profile data from the backend
        const response = await fetch(`https://alumnitracersystem.onrender.com/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile data');
        }

        const data = await response.json();
        setUserData(data.data); // Set user data to state
      } catch (err) {
        setError(err.message);
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className="profile-container">
      <section className="personal-info">
        <h2>PERSONAL INFORMATION</h2>
        <div className="profile-section">
          <div className="details">
            <div className="row-group">
              <div className="row">
                <label>College</label>
                <input type="text" value={userData.college || ''} readOnly />
              </div>
              <div className="row">
                <label>Course</label>
                <input type="text" value={userData.course || ''} readOnly />
              </div>
              <div className="row">
                <label>Degree</label>
                <input type="text" value={userData.degree || ''} readOnly />
              </div>
            </div>

            <div className="row">
              <label>Name</label>
              <input
                type="text"
                value={`${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`}
                readOnly
              />
            </div>

            <div className="row">
              <label>Address</label>
              <input type="text" value={userData.address || ''} readOnly />
            </div>

            <div className="row">
              <label>Birthday</label>
              <input type="text" value={userData.birthday || ''} readOnly />
            </div>

            <div className="row">
              <label>Email</label>
              <input type="text" value={userData.email || ''} readOnly />
            </div>

            <div className="row">
              <label>Contact No.</label>
              <input type="text" value={userData.contact_no || ''} readOnly />
            </div>
          </div>
        </div>
      </section>

      <section className="employment-status">
        <h2>Employment Status</h2>
        <div className="details">
          <div className="row">
            <label>Occupation</label>
            <input type="text" value={userData.occupation || ''} readOnly />
          </div>

          <div className="row">
            <label>Company</label>
            <input type="text" value={userData.companyName || ''} readOnly />
          </div>

          <div className="row">
            <label>Position</label>
            <input type="text" value={userData.position || ''} readOnly />
          </div>

          <div className="row">
            <label>Job Status</label>
            <input type="text" value={userData.jobStatus || ''} readOnly />
          </div>

          <div className="row">
            <label>Year Started</label>
            <input type="text" value={userData.yearStarted || ''} readOnly />
          </div>

          <div className="row">
            <label>Organization Type</label>
            <input type="text" value={userData.typeOfOrganization || ''} readOnly />
          </div>

          <div className="row">
            <label>Work Alignment</label>
            <input type="text" value={userData.workAlignment || ''} readOnly />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
