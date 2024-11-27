import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../store/alumniReducer';
import { updateProfileImage } from '../api/alumniApi';
import styles from '../styles/ProfileSection.module.css';

const ProfileImage = ({ imageUrl, alumniId }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const newImageUrl = await updateProfileImage(alumniId, file);
      dispatch(updateProfile({ imageUrl: newImageUrl }));
    } catch (error) {
      console.error('Failed to update profile image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.imageSection}>
      <img
        src={imageUrl}
        alt="Alumni profile"
        className={styles.profileImage}
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        aria-label="Click to update profile image"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <button
        className={styles.editButton}
        onClick={handleImageClick}
        disabled={isUploading}
        aria-busy={isUploading}
      >
        {isUploading ? 'UPLOADING...' : 'EDIT IMAGE'}
      </button>
    </div>
  );
};

export default ProfileImage;