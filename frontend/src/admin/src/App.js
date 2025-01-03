import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from './components/Dashboard/Dashboard';
import AlumniPage from './components/Alumni/Page/AlumniPage';
import SurveyContent from './components/AdminSurvey/Content/SurveyContent';
import EvenTabs from './components/Event/EventTabs';
import Opportunities from './components/Opportunities/Admin-Opportunities';
import Navbar from './components/Navbar';
import Login from './Pages/Login';
import Register from './Pages/Register';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Default route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Other admin paths */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alumni-page" element={<AlumniPage />} />
          <Route path="/survey-content" element={<SurveyContent />} />
          <Route path="/event-tabs" element={<EvenTabs />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/register" element={<Register />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
