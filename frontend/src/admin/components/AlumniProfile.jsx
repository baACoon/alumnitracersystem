import React from 'react';
import { useParams } from 'react-router-dom';
import { useAlumniData } from './hooks/useAlumniData';
import AlumniHeader from './Header/Header';
import ProfileImage from './ProfileImage';
import ProfileDetails from './ProfileDetails';
import SurveyList from './SurveyList';
import styles from './styles/AlumniProfile.module.css';

const AlumniProfile = () => {
  const { id } = useParams();
  const { profile, surveys, isLoading, error } = useAlumniData(id);

  const handleExportSurveys = async () => {
    try {
      const response = await fetch(`/api/alumni/${id}/surveys/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `surveys_${id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading) {
    return <div className={styles.loading} role="alert" aria-busy="true">Loading...</div>;
  }

  if (error) {
    return <div className={styles.error} role="alert">{error}</div>;
  }

  if (!profile) {
    return <div className={styles.error} role="alert">Alumni profile not found</div>;
  }

  return (
    <div className={styles.container}>
      <AlumniHeader />
      
      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>ALUMNI DATABASE</h1>
        
        <section className={styles.profileSection} aria-label="Alumni Profile">
          <ProfileImage imageUrl={profile.imageUrl} alumniId={profile.id} />
          <ProfileDetails profile={profile} />
        </section>
        
        <SurveyList surveys={surveys} onExport={handleExportSurveys} />
      </main>
      
      <footer className={styles.footer}>
        <p>2024 TUP-Manila</p>
        <p>Designs by: GGPR</p>
      </footer>
    </div>
  );
};

export default AlumniProfile;