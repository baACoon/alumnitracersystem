import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './client/components/Home/home';


{/* for Client path */}
import FrontPage from './client/components/Frontpage/frontpage';
import Home from './client/components/Home/home';
import LoginPage from './client/components/Login_client/Login_client';
import RegisterPage from './client/components/Register_client/Register_client';
import Survey from './client/components/Survey/survey'


{/* for Admin path */}

import Login from './admin/components/login/login'
import AlumniPage from './admin/components/Alumnis/Page/AlumniPage'
import AlumniProfile from './admin/components/AlumniProfile'



function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/Home' element ={<Home/>} />
        <Route path='/Login' element ={<Login/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
    
  );
  
}

export default App;
