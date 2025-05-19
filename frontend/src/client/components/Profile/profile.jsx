import React, { useState, useEffect } from 'react';
import styles from './profile.module.css'; // Import module-based styles
import Header from '../Header/header';
import Footer from '../FooterClient/Footer';
import ProfilePic from '../../components/image/ayne.jpg';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    surveys: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // For Change Password modal
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Session expired. Please log in again.");
          navigate('/frontpage');
          return;
        }

        try {
          const decoded = jwtDecode(token);
          if (!decoded.id) throw new Error('Invalid token');
        } catch (err) {
          toast.warning("Invalid session. Please log in again.");
          localStorage.removeItem('token');
          navigate('/frontpage');
          return;
        }

        const response = await fetch('https://alumnitracersystem.onrender.com/profile/user-profile', {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/frontpage');
  };

  const handleChangePassword = async () => {
    console.log('Old Password:', oldPassword);
    console.log('New Password:', newPassword);
  
    if (!oldPassword || !newPassword) {
      setPasswordError('All fields are required.');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://localhost:5050.onrender.com/profile/change-password', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
  
      const result = await response.json();
      console.log('Server Response:', result); // Debug response
  
      if (!response.ok) throw new Error(result.message || 'Password change failed');
  
      toast.success('Password changed successfully!');
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error:', error);
      setPasswordError(error.message);
    }
  };

  const handleUpdateEmployment = () => {
    navigate('/UpdateEmployment', {
      state: {
        lastStatus: profileData.employmentInfo?.job_status || ''
      }
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loaderContainer}>
          <svg viewBox="0 0 240 240" height="80" width="80" className={styles.loader}>
            <circle strokeLinecap="round" strokeDashoffset="-330" strokeDasharray="0 660" strokeWidth="20" stroke="#000" fill="none" r="105" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringA}`}></circle>
            <circle strokeLinecap="round" strokeDashoffset="-110" strokeDasharray="0 220" strokeWidth="20" stroke="#000" fill="none" r="35" cy="120" cx="120" className={`${styles.pl__ring} ${styles.pl__ringB}`}></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="85" className={`${styles.pl__ring} ${styles.pl__ringC}`}></circle>
            <circle strokeLinecap="round" strokeDasharray="0 440" strokeWidth="20" stroke="#000" fill="none" r="70" cy="120" cx="155" className={`${styles.pl__ring} ${styles.pl__ringD}`}></circle>
          </svg>
          <p>Loading Profile...</p>
        </div>
      </div>
    );
  }
    if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.profileContainer}>
      <section className={styles.personalInfo}>
        <h2>Personal Information</h2>
        <div className={styles.profileSection}>
          <div className={styles.rowGroup}>
            <div className={styles.row}>
              <label>College</label>
              <input type="text" value={profileData.personalInfo?.college || ''} readOnly />
            </div>
            <div className={styles.row}>
              <label>Course</label>
              <input type="text" value={profileData.personalInfo?.course || ''} readOnly />
            </div>
            <div className={styles.row}>
              <label>Degree</label>
              <input type="text" value={profileData.personalInfo?.degree || ''} readOnly />
            </div>
          </div>

          <div className={styles.row}>
            <label>Name</label>
            <input
              type="text"
              value={`${profileData.personalInfo?.first_name || ''} ${profileData.personalInfo?.middle_name || ''} ${profileData.personalInfo?.last_name || ''}`}
              readOnly
            />
          </div>
          <div className={styles.row}>
            <label>Birthday</label>
            <input type="text" value={formatDate(profileData.personalInfo?.birthdate) || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Email</label>
            <input type="text" value={profileData.personalInfo?.email_address || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Contact Number</label>
            <input type="text" value={profileData.personalInfo?.contact_no || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Address</label>
            <input type="text" value={profileData.personalInfo?.address || ''} readOnly />
          </div>
        </div>
      </section>

      {/* <section className={styles.employmentStatus}>
        <h2>Employment Status</h2>
        <div className={styles.details}>
          <div className={styles.row}>
            <label>Occupation</label>
            <input type="text" value={profileData.employmentInfo?.occupation || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Company</label>
            <input type="text" value={profileData.employmentInfo?.company_name || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Position</label>
            <input type="text" value={profileData.employmentInfo?.position || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Job Status</label>
            <input type="text" value={profileData.employmentInfo?.job_status || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Year Started</label>
            <input type="text" value={profileData.employmentInfo?.year_started || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Organization Type</label>
            <input type="text" value={profileData.employmentInfo?.type_of_organization || ''} readOnly />
          </div>
          <div className={styles.row}>
            <label>Work Alignment</label>
            <input type="text" value={profileData.employmentInfo?.work_alignment || ''} readOnly />
          </div>
        </div>
      </section> */}

      {/* <section className={styles.completedSurveys}>
        <h2>Completed Surveys</h2>
        {profileData.surveys?.map((survey, index) => (
          <div key={survey._id} className={styles.surveyItem}>
            <p>Date Completed: {formatDate(survey.createdAt)}</p>
          </div>
        ))}
      </section> */}

      <button className={styles.logoutBtn} onClick={handleLogout}>
        Logout
      </button>
      <button className={styles.changepass} onClick={() => setShowModal(true)}>
        Change Password
      </button>

      <button 
        className={styles.updateEmploymentBtn}
        onClick={handleUpdateEmployment}
      >
        Update Employment Status
      </button>

      
            {/* Change Password Modal */}
            {showModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h2>Change Password</h2>
                {passwordError && <p className={styles.error}>{passwordError}</p>}
                <div className={styles.inputGroup}>
                  <label>Old Password</label>
                  <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}  />
                </div>
                <div className={styles.inputGroup}>
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Confirm New Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className={styles.modalActions}>
                  <button className={styles.saveBtn} onClick={handleChangePassword}>Save</button>
                  <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}

export default Profile;