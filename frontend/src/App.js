import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Components
import FrontPage from '../src/client/components/Frontpage/frontpage';
import CrossCheckSurveyForm from '../src/client/components/CrossCheck-Survey/CrossCheck-Survey';
import Home from '../src/client/components/Home/home';
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
import ProtectedRoute from './client/components/ProtectedRoute';

// ADD THIS
import SessionChecker from './client/components/SessionChecker'; // create mo rin to, simple lang mamaya

function App() {
  return (
    <div className="App">
      <div className="backgroundWrapper">
        <BrowserRouter>

          {/* INSERT SESSION CHECKER HERE */}
          <SessionChecker />

          <Routes>

            {/* Public routes */}
            <Route index element={<FrontPage />} />
            <Route path="/Frontpage" element={<FrontPage />} />
            <Route path="/RegisterSurveyForm" element={<CrossCheckSurveyForm />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/RecoverAccount" element={<RecoverAccount />} />

            {/* Protected routes */}
            <Route path="/Home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/SurveyPage" element={<ProtectedRoute><SurveyPage /></ProtectedRoute>} />
            <Route path="/TracerSurvey2" element={<ProtectedRoute><TracerSurvey2 /></ProtectedRoute>} />
            <Route path="/Events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/JobPage" element={<ProtectedRoute><JobPage /></ProtectedRoute>} />
            <Route path="/JobPageGive" element={<ProtectedRoute><JobPageGive /></ProtectedRoute>} />
            <Route path="/JobPageGive/addjobform" element={<ProtectedRoute><AddJobForm /></ProtectedRoute>} />
            <Route path="/JobPageList" element={<ProtectedRoute><JobPageList /></ProtectedRoute>} />
            <Route path="/Profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/SurveyForm" element={<ProtectedRoute><SurveyForm /></ProtectedRoute>} />

          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
