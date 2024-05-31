import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./signup.css"


function Signup() {    

    const [userName, setUsername] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("/api/signup", { userName, password })
        .then(result => {console.log(result)
        navigate("/login")
        })
        .catch(err => console.log(err))
    }
  return (
    <div className="firstcontainer">
        <div className="secondcontainer">
        <h2><center>Sign Up</center></h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Username</strong>
                    </label>
                    <input type="text" placeholder='Enter Name' autoComplete='off' name='username' className='form-control rounded-0'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email"> 
                    <strong>Password</strong>
                    </label>
                    <input type="password" placeholder='Enter Password' name='password' className='form-control rounded-0' 
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0"> Sign Up </button>
                
                </form>
                    <p>Already have an account?</p>
                        <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                            Login
                        </Link>         
        </div>
    </div>
  );
}

export default Signup;