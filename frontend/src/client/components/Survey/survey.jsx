import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../Header/header';
import Footer from '../../../admin/components/Footer/Footer';


function Survey() {
  return (
    <div>
      <Header/>
      <SurveyPage/>
      <Footer/>
    </div>
  );
}

function SurveyPage() {
  return (

      <div className="d-flex">
        {/* Sidebar */}
        <div className="sidebar bg-danger text-white p-3">
          <ul className="list-unstyled">
            <li>
              <a href="/" className="text-white text-decoration-none">
                Pending Surveys
              </a>
            </li>
            <li>
              <a href="/about" className="text-white text-decoration-none">
                Completed Surveys
              </a>
            </li>
          </ul>
        </div>
  
        {/* Main Content */}
        <div className="content p-3">
          <h1>Main Content Area</h1>
          <p>
            This is the main content area. The sidebar remains open without a toggle.
          </p>
        </div>
      </div>
    
  );
}



export default Survey;
