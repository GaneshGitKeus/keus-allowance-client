import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";
import Keuslogo from "../Keuslogo";
import "./Home.css";

function Home() {
    const [active, setActive] = useState(0);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is already logged in by fetching user data
        const checkAuth = async () => {
            try {
                const response = await fetch("https://keus-allowance-app.onrender.com/api/user", {
                    method: "GET",
                    credentials: "include", // Send cookies
                });
                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("user", JSON.stringify(data));
                    navigate("/main"); // Redirect if authenticated
                }
            } catch (error) {
                console.error("Not authenticated:", error);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleSignup = async (userData) => {
        setError("");
        setSuccess("");
        try {
            const response = await fetch("https://keus-allowance-app.onrender.com/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setSuccess("✅ Success Full Registration");
            setActive(0);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogin = async (credentials) => {
        setError("");
        try {
            const response = await fetch("https://keus-allowance-app.onrender.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
                credentials: "include", // Ensure cookies are stored
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            console.log("Login: ", data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");
            navigate("/main"); // Redirect after login
        } catch (err) {
            setError("❌ Failed to Login");
        }
    };

    return (
        <div className="Home">
            {error && (
                <div className="error-message" onClick={() => setError("")}>{error}</div>
            )}
            {success && (
                <div className="success-message" onClick={() => setSuccess("")}>{success}</div>
            )}
            <Keuslogo />
            <div className="Login-form-text">
                {active === 0 ? <span>Login Form</span> : <span>Register Form</span>}
            </div>

            <div className="Login-Button">
                <button
                    className="Login-Buttton-size"
                    onClick={() => setActive(0)}
                    style={{
                        backgroundColor: active === 0 ? "rgb(18, 18, 149)" : "white",
                        color: active === 0 ? "white" : "black",
                    }}
                >
                    Login
                </button>
                {/* <button
                    className="Signup-Buttton-size"
                    onClick={() => setActive(1)}
                    style={{
                        backgroundColor: active === 1 ? "rgb(18, 18, 149)" : "white",
                        color: active === 1 ? "white" : "black",
                    }}
                >
                    Signup
                </button> */}
            </div>
            {active === 0 ? <Signin handleLogin={handleLogin} /> : <Signup handleSignup={handleSignup} />}
        </div>
    );
}

export default Home;
