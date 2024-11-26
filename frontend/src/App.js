import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './client/home';
import Login from './admin/components/login/login'
import AlumniPage from './admin/components/Alumnis/Page/AlumniPage'
import Alumni from './admin/components/alumni/alumnidatabase'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/Home' element ={<Home/>} />
        <Route path='/Login' element ={<Login/>}/>
        <Route path='/AlumniPage' element ={<AlumniPage/>}/>
        <Route path='/Alumni' element ={<Alumni/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
