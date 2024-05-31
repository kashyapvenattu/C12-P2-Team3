import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './login.css';
import LoginContext from "./LoginContext";

function Login() {    

    const [userName, Username] = useState()
    const [password, Password] = useState()
    const navigate = useNavigate()
    const auth = useContext(LoginContext)
    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/api/login", {userName, password})
        .then(result => {
            console.log(result)
            if(result.data !== "Login error"){
                auth.setLoggedInUser(result.data)
                navigate("/")
            }
            else{
                // navigate("/signup")
                alert("You are not registered into the app system")
            }
        })
        .catch(err => console.log(err))
    }

  return (
    
        <div className="secondcontainer">
            <h2><center>Login</center></h2>
            <form onSubmit={handleSubmit}> 
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Username</strong>
                    </label>
                    <input type="text" 
                        placeholder='Enter Email' 
                        autoComplete='off' 
                        name='email' 
                        className='form-control rounded-0' 
                        onChange={(e) => Username(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Password</strong>
                    </label>
                    <input type="password" 
                        placeholder='Enter Password' 
                        name='password' 
                        className='form-control rounded-0' 
                        onChange={(e) => Password(e.target.value)}
                    />
                </div>                
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Login
                </button>
            </form>
            <p>Don't have an account?</p>
            <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                Sign Up
            </Link>
        </div>
)};

export default Login;