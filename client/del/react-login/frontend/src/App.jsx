import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
// import './App.css';

import Signup from './signup.jsx';
import Login from './login.jsx';
import Home from "./home.jsx"; //home is where the map is going to stay


function App() {
  return (
   <div>
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </BrowserRouter>
    </div> 
  )
}

export default App