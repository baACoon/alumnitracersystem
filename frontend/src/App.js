import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './client/home';
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
        <Route path='/AlumniPage' element ={<AlumniPage/>}/>
        <Route path='/AlumniProfile' element ={<AlumniProfile/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
    
  );
  
}

export default App;
