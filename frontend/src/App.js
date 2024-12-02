import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"

{/* for Client path */}
import FrontPage from './client/components/Frontpage/frontpage';
import Home from './client/components/Home/home'
import LoginPage from './client/components/Login_client/Login_client';
import RegisterPage from './client/components/Register_client/Register_client';
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
import Login from './admin/components/login/login'
import AlumniPage from './admin/components/Alumnis/Page/AlumniPage'




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        {/* for CLIENT path */}
        <Route index element ={<FrontPage/>} />
        <Route path='/FrontPage' element ={<FrontPage/>}/>
        <Route path='/Login_client' element ={<LoginPage/>}/>
        <Route path='/Register_client' element ={<RegisterPage/>}/>
        <Route path='/Home' element ={<Home/>} />
        <Route path='/Survey' element ={<Survey/>}/>
        <Route path='/Events' element ={<Events/>}/>
        <Route path='/JobPage' element ={<JobPage/>}/>
        <Route path='/JobPageGive' element ={<JobPageGive/>}/>
        <Route path='/JobPageGive/addjobform' element ={<AddJobForm/>}/>
        <Route path='/JobPageList' element ={<JobPageList/>}/>
        <Route path='/Contact' element ={<Contact/>}/>
        <Route path='/Profile' element ={<Profile/>}/>
        <Route path='/SurveyForm' element ={<SurveyForm/>}/>
        <Route path='/CompletedForm' element ={<CompletedForm/>}/>
        

        {/* for Admin path */}
        <Route path='/Login' element ={<Login/>}/>
        <Route path='/AlumniPage' element ={<AlumniPage/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
    
  );
  
}

export default App;
