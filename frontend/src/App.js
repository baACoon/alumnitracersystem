import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"


{/* for Client path */}
import FrontPage from './client/components/Frontpage/frontpage';
import CrossCheckSurveyForm from './client/components/CrossCheck-Survey/CrossCheck-Survey';
import Home from './client/components/Home/home'
import Survey from './client/components/Survey/survey';
import Events from './client/components/Events/events';
import JobPage from './client/components/JobPage/jobpage';
import JobPageGive from './client/components/JobPageGive/jobpagegive';
import AddJobForm from './client/components/JobPageGive/addjobForm';
import JobPageList from './client/components/JobPageList/jobpagelist';
import Contact from './client/components/Contact/contact';
import Profile from './client/components/Profile/profile';
import SurveyForm from './client/components/SurveyForm/SurveyForm';
import CompletedForm from './client/components/CompletedForm/CompletedForm';

{/* for Admin path */}
import AlumniPage from './admin/components/Alumni/Page/AlumniPage'
import SurveyContent from './admin/components/AdminSurvey/Content/SurveyContent'
import EvenTabs from './admin/components/Event/EventTabs';
import Opportunities from './admin/components/Opportunities/Admin-Opportunities';
import Navbar from './admin/components/Navbar';
import Login from './admin/Pages/Login';
import Register from './admin/Pages/Register'
import Articles from './admin/components/Articles/articleadmin'




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

            {/* ADMIN path */}
            <Route path="/AlumniPage" element={<AlumniPage />} />
            <Route path="/SurveyContent" element={<SurveyContent />} />
            <Route path="/EventTabs" element={<EvenTabs />} />
            <Route path="/Opportunities" element={<Opportunities />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path='/Articles' element={< Articles/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
