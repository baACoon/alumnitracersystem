import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './client/home';
import Login from './admin/components/login/login'

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
