import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/Styles/popup.css';
import './profile.css'
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';

function Profile() {
  return (
    <div>
      <Header />
      <Footer />
    </div>
  );
}


export default Profile;
