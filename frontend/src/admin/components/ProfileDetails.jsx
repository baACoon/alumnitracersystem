import React from 'react';
import styles from '../styles/ProfileSection.module.css';

const ProfileDetails = ({ profile }) => {
  return (
    <div className={styles.detailsSection}>
      <div className={styles.educationInfo}>
        <h3>{profile.college} {profile.graduationYear}</h3>
        <p>{profile.course}</p>
      </div>
      
      <hr className={styles.divider} role="separator" />
      
      <div className={styles.personalInfo}>
        <div className={styles.basicInfo}>
          <dl>
            <dt>Last Name</dt>
            <dd>{profile.lastName}</dd>
            
            <dt>First Name</dt>
            <dd>{profile.firstName}</dd>
            
            <dt>Middle Name</dt>
            <dd>{profile.middleName || 'N/A'}</dd>
            
            <dt>Suffix</dt>
            <dd>{profile.suffix || 'N/A'}</dd>
          </dl>
        </div>
        
        <div className={styles.contactInfo}>
          <dl>
            <dt>Address</dt>
            <dd>{profile.address}</dd>
            
            <dt>Birthday</dt>
            <dd>{new Date(profile.birthday).toLocaleDateString()}</dd>
            
            <dt>Email</dt>
            <dd>{profile.email}</dd>
            
            <dt>Contact No.</dt>
            <dd>{profile.contactNumber}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;