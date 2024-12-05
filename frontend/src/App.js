import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"

{/* for Client path */}
import TestFrontPage from './client/components/testfrontpage/testfrontpage';
import RegisterSelection from './client/components/RegisterSelection/registerselection';
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
import Login from './admin/components/login/login'
import AlumniPage from './admin/components/Alumnis/Page/AlumniPage'




function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        {/* for CLIENT path */}
        <Route index element ={<TestFrontPage/>} />
        <Route path='/testfrontpage' element ={<TestFrontPage/>}/>
        <Route path='/registerselection' element ={<RegisterSelection/>}/>
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
