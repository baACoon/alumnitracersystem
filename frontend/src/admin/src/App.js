import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Login from './Pages/Login';
import ProtectedRoute from './components/ProtectRoute';
import SessionChecker from './components/SessionChecker';
import Dashboard from './components/Dashboard/MainPage/Dashboard';
import AlumniPage from './components/Alumni/Page/AlumniPage';
import SurveyContent from './components/AdminSurvey/Content/SurveyContent';
import EvenTabs from './components/Event/EventTabs';
import Opportunities from './components/Opportunities/Admin-Opportunities';
import NotFound from './Pages/NotFound';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SessionChecker/>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - only accessible when authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={
              <>
                <Navbar />
                <Dashboard />
              </>
            } />
            <Route path="/alumni-page" element={
              <>
                <Navbar />
                <AlumniPage />
              </>
            } />
            <Route path="/survey-content" element={
              <>
                <Navbar />
                <SurveyContent />
              </>
            } />
            <Route path="/event-tabs" element={
              <>
                <Navbar />
                <EvenTabs />
              </>
            } />
            <Route path="/opportunities" element={
              <>
                <Navbar />
                <Opportunities />
              </>
            } />
          </Route>

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      
      <ToastContainer 
        position="top-center" 
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
}

export default App;