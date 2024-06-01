import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import Login from "./Login"
import Signup from './Signup';
import {LoginProvider} from './LoginContext';

ReactDOM.render(
  <React.StrictMode>
    <LoginProvider>
      <MyRoutes/>
    </LoginProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

function MyRoutes() {
  return <BrowserRouter>
  <Routes> 
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/' element={<App/>}/>
  </Routes>
</BrowserRouter>
}