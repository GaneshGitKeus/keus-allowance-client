import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Mail, Phone } from "lucide-react";
import ProfileImage from "./Profileimage.jpg";
import Keusimage from "./Keusname.png";

function Profile({setChanged}) {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        name: "",
        designation: "",
        empid: "",
        email: "",
        phone: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [tempData, setTempData] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const response = await fetch("https://keus-allowance-app.onrender.com/api/user/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Ensures cookies are sent
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user data");
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            setUserData(data.user);
            setIsEditing(false);
            setChanged((prev) => prev + 1);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile");
        }
    };


    const handleCancel = () => {
        if (tempData) {
            setUserData(tempData);
        }
        setIsEditing(false);
    };

    const handleEdit = () => {
        setTempData({ ...userData });
        setIsEditing(true);
    };

    const handleLogout = async () => {
        try {
            await fetch("https://keus-allowance-app.onrender.com/api/logout", {
                method: "POST",
                credentials: "include", // To ensure cookies are sent
            });
    
            // Clear authentication data
            localStorage.removeItem("user");
            navigate("/"); // Redirect to login page
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    


    return (
        <div className="Profile">
            <div className="keus-image">
                <img src={Keusimage} alt="No" className="Keusimage" />
            </div>
            <div className="profile-container">
                <div className="profile-card">
                    <div className="profile-image">
                        <img src={ProfileImage} alt="Profile" />
                    </div>
                    <div className="profile-info">
                        <input
                            type="text"
                            name="name"
                            value={userData.name || ""}
                            placeholder="Enter Name"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            name="designation"
                            value={userData.designation || ""}
                            placeholder="Enter Designation"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            name="empid"
                            value={userData.empid || ""}
                            placeholder="Enter Employee ID"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="contact-info">
                    <div className="contact-item">
                        <Mail size={20} />
                        <input
                            type="email"
                            name="email"
                            value={userData.email || ""}
                            placeholder="Enter Email"
                            onChange={handleChange}
                            disabled={true}
                        />
                    </div>
                    <div className="contact-item">
                        <Phone size={20} />
                        <input
                            type="text"
                            name="phone"
                            value={userData.phone || ""}
                            placeholder="Enter Phone Number"
                            onChange={handleChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="profile-actions">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={handleEdit}>Edit</button>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
