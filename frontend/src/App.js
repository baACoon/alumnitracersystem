import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
{/* for Client path */}
import FrontPage from '../src/client/components/Frontpage/frontpage';
import CrossCheckSurveyForm from '../src/client/components/CrossCheck-Survey/CrossCheck-Survey';
import Home from '../src/client/components/Home/home'
import SurveyPage from '../src/client/components/Surveys/SurveyPage';
import TracerSurvey2 from '../src/client/components/Surveys/TracerSurvey2/TracerSurvey2';
import Events from '../src/client/components/Events/events';
import JobPage from '../src/client/components/JobPage/jobpage';
import JobPageGive from '../src/client/components/JobPageGive/jobpagegive';
import AddJobForm from '../src/client/components/JobPageGive/addjobForm';
import JobPageList from '../src/client/components/JobPageList/jobpagelist';
import Contact from '../src/client/components/Contact/contact';
import Profile from '../src/client/components/Profile/profile';
import SurveyForm from '../src/client/components/SurveyForm/SurveyForm';
import RecoverAccount from './client/components/Register_NewAlumni/recover_account';
import DataPrivacyConsent from './client/components/Security/dataprivacy';
import UpdateEmployment from './client/components/Surveys/UpdateEmployment';


function App() {
  return (
    <div className="App">
      <div className="backgroundWrapper">
        <BrowserRouter>
          <Routes>
            {/* CLIENT path */}
            <Route index element={<FrontPage />} />
            <Route path="/Frontpage" element={<FrontPage />} />
            <Route path="/RegisterSurveyForm" element={<CrossCheckSurveyForm />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/SurveyPage" element={<SurveyPage />} />
            <Route path="/TracerSurvey2" element={<TracerSurvey2 />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/JobPage" element={<JobPage />} />
            <Route path="/JobPageGive" element={<JobPageGive />} />
            <Route path="/JobPageGive/addjobform" element={<AddJobForm />} />
            <Route path="/JobPageList" element={<JobPageList />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/SurveyForm" element={<SurveyForm />} />
            <Route path="/RecoverAccount" element={<RecoverAccount />} />
            <Route 
              path="/data-privacy"  
              element={<DataPrivacyConsent 
                onComplete={() => navigate('/RegisterSurveyForm')}
                onDecline={() => navigate(-1)}
                fullPage={true}
              />} 
            />
            <Route path="/UpdateEmployment" element={<UpdateEmployment />} />
          </Routes>
        </BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </div>
  );
}

export default App;