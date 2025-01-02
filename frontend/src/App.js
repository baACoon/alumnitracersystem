import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"


{/* for Client path */}
import FrontPage from '../src/client/components/Frontpage/frontpage';
import CrossCheckSurveyForm from '../src/client/components/CrossCheck-Survey/CrossCheck-Survey';
import Home from '../src/client/components/Home/home'
import Survey from '../src/client/components/Survey/survey';
import Events from '../src/client/components/Events/events';
import JobPage from '../src/client/components/JobPage/jobpage';
import JobPageGive from '../src/client/components/JobPageGive/jobpagegive';
import AddJobForm from '../src/client/components/JobPageGive/addjobForm';
import JobPageList from '../src/client/components/JobPageList/jobpagelist';
import Contact from '../src/client/components/Contact/contact';
import Profile from '../src/client/components/Profile/profile';
import SurveyForm from '../src/client/components/SurveyForm/SurveyForm';
import CompletedForm from '../src/client/components/CompletedForm/CompletedForm';

{/* for Admin path */}
import Dashboard from '../src/admin/components/Dashboard/Dashboard';
import AlumniPage from '../src/admin/components/Alumni/Page/AlumniPage'
import SurveyContent from '../src/admin/components/AdminSurvey/Content/SurveyContent'
import EvenTabs from '../src/admin/components/Event/EventTabs';
import Opportunities from '../src/admin/components/Opportunities/Admin-Opportunities';
import Navbar from '../src/admin/components/Navbar';
import Login from './admin/src/Pages/Login';
import Register from './admin/src/Pages/Register';



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
            <Route path="/Survey" element={<Survey />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/JobPage" element={<JobPage />} />
            <Route path="/JobPageGive" element={<JobPageGive />} />
            <Route path="/JobPageGive/addjobform" element={<AddJobForm />} />
            <Route path="/JobPageList" element={<JobPageList />} />
            <Route path="/Contact" element={<Contact />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/SurveyForm" element={<SurveyForm />} />
            <Route path="/CompletedForm" element={<CompletedForm />} />

             {/* ADMIN paths */}
            <Route path="/admin/" element={<Dashboard />} />
            <Route path="/admin/Dashboard" element={<Dashboard />} />
            <Route path="/admin/AlumniPage" element={<AlumniPage />} />
            <Route path="/admin/SurveyContent" element={<SurveyContent />} />
            <Route path="/admin/EventTabs" element={<EvenTabs />} />
            <Route path="/admin/Opportunities" element={<Opportunities />} />
            <Route path="/admin/Navbar" element={<Navbar />} />
            <Route path="/admin/Login" element={<Login />} />
            <Route path="/admin/Register" element={<Register />} />

       
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
