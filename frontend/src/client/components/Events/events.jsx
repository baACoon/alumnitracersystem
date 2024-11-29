import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Events/events.css';
import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';


function Events() {
  return (
    <div>
      <Header />
      <Footer />
    </div>
  );
}


export default Events;
