import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../components/Styles/popup.css';
import './profile.css'
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';
import Tuplogo from '../../components/image/Tuplogo.png'
import Alumnilogo from '../../components/image/alumniassoc_logo.png'

function Profile() {
  return (
    <div>
      <Header />
      <Footer />
    </div>
  );
}


export default Profile;
