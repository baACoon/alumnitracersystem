import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import {BrowserRouter, Routes, Route} from "react-router-dom"
<<<<<<< HEAD
import Home from './client/components/Home/home';
=======

{/* for Client path */}
import FrontPage from './client/components/Frontpage/frontpage';
import Home from './client/components/Home/home';
import LoginPage from './client/components/Login_client/Login_client';
import RegisterPage from './client/components/Register_client/Register_client';
import Survey from './client/components/Survey/survey'


{/* for Admin path */}
>>>>>>> main
import Login from './admin/components/login/login'



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* for client path */}
          <Route index element ={<FrontPage/>} />
          <Route path='/Home' element ={<Home/>} />
          <Route path='/LoginPage' element ={<LoginPage/>}/>
          <Route path='/FrontPage' element ={<FrontPage/>}/>
          <Route path='/RegisterPage' element ={<RegisterPage/>} /> 
          <Route path='/Survey' element ={<Survey/>} />

          {/* for admin path */}
          <Route path='/Login' element ={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
