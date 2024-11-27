import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"

{/* for Client path */}
import FrontPage from './client/components/Frontpage/frontpage';
import Home from './client/components/Home/home';
import LoginPage from './client/components/Login_client/Login_client';
import RegisterPage from './client/components/Register_client/Register_client';
import Survey from './client/components/Survey/survey'


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

        {/* for Admin path */}
        <Route path='/AlumniPage' element ={<AlumniPage/>}/>
        <Route path='/Login' element ={<Login/>}/>
        <Route path='/AlumniPage' element ={<AlumniPage/>}/>
        <Route path='/AlumniProfile' element ={<AlumniProfile/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
    
  );
  
}

export default App;
