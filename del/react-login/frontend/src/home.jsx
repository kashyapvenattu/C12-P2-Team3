import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Home() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
            });
        } else {
            console.log("No token found, redirecting to login page");
            navigate("/login");
        }
    }, []);

    const handleLogout = () => {
        console.log("Logout button clicked");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div>
            <div>
                <h1>Welcome to MAP</h1>
                {userData && (
                    <div>
                        <p>Hello, {userData.userName}!</p>
                        <p>User ID: {userData._id}</p>
                        {/* Display other user information as needed */}
                    </div>
                )}
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Home;