import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';

import Dashboard from './components/Dashboard/MainPage/Dashboard';
import AlumniPage from './components/Alumni/Page/AlumniPage';
import SurveyContent from './components/AdminSurvey/Content/SurveyContent';
import EvenTabs from './components/Event/EventTabs';
import Opportunities from './components/Opportunities/Admin-Opportunities';
import Navbar from './components/Navbar';
import Login from './Pages/Login';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectRoute';
import SessionChecker from './components/SessionChecker';
import NotFound from './Pages/NotFound';



function App() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  return (
    <div className="App">
      <div className="backgroundWrapper">
      <BrowserRouter>
      <SessionChecker onAuthCheckComplete={() => setIsAuthChecked(true)} />
      {isAuthChecked ? (
        <Routes>
          {/* Default route: Redirect to Login */}
          <Route path="/" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />

          {/* Other admin paths */}
          <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/alumni-page" element={<ProtectedRoute><AlumniPage /></ProtectedRoute>} />
          <Route path="/SurveyContent" element={<ProtectedRoute><SurveyContent /></ProtectedRoute>} />
          <Route path="/EventTabs" element={<ProtectedRoute><EvenTabs /></ProtectedRoute>} />
          <Route path="/Opportunities" element={<ProtectedRoute><Opportunities /></ProtectedRoute>} />
          <Route path="/navbar" element={<ProtectedRoute><Navbar /></ProtectedRoute>} />

          
       
      
        </Routes>

      ) : (
            <div className="loading-screen">Checking authentication...</div>
          )}
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />

      </div>
    </div>
  );
}

export default App;