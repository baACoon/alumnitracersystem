import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"

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
      <BrowserRouter basename="/admin">
        <Routes>
          {/* Default route: Redirect to Login */}
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Login" element={<Login />} />

          {/* Other admin paths */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/AlumniPage" element={<AlumniPage />} />
          <Route path="/SurveyContent" element={<SurveyContent />} />
          <Route path="/EventTabs" element={<EvenTabs />} />
          <Route path="/Opportunities" element={<Opportunities />} />
          <Route path="/Navbar" element={<Navbar />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
