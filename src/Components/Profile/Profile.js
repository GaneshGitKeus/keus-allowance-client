import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { Mail, Phone, User } from "lucide-react";
import ProfileImage from "./Profileimage.jpg";
import Keusimage from "./Keusname.png";
import { baseurl } from "../../constants";
import { updateUserData, userLogout, changePassword } from "../../api";

function Profile({ setChanged }) {
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
    const [mode, setMode] = useState("info"); // "info" or "password"
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSave = async () => {
        if (mode === "info") {
            try {
                const data = await updateUserData(userData);
                localStorage.setItem("user", JSON.stringify(data.user));
                setUserData(data.user);
                setIsEditing(false);
                setChanged((prev) => prev + 1);
            } catch (error) {
                console.error("Error updating profile:", error);
                alert("Failed to update profile");
            }
        } else if (mode === "password") {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setError("New passwords do not match");
                return;
            }

            try {
                console.log(passwordForm);
                await changePassword({
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword,
                });
                console.log("Password changed successfully");
                setSuccess("Password changed successfully");
                setPasswordForm({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
                setIsEditing(false);
                setMode("info");
            } catch (err) {
                setError(err.message || "Failed to change password");
            }
        }
    };



    const handleCancel = () => {
        if (mode === "info") {
            if (tempData) setUserData(tempData);
        } else {
            setPasswordForm({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setError("");
            setSuccess("");
        }
        setIsEditing(false);
        setMode("info");
    };


    const handleEdit = () => {
        setTempData({ ...userData });
        setIsEditing(true);
    };

    const handleEditProfile = () => {
        setTempData({ ...userData });
        setIsEditing(true);
        setMode("info");
    };

    const handleEditPassword = () => {
        setIsEditing(true);
        setMode("password");
    };


    const handleLogout = async () => {
        try {
            await userLogout(); // Call the logout API
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
                        {mode === "info" ? (
                            <>
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
                                    type="email"
                                    name="email"
                                    value={userData.email || ""}
                                    placeholder="Enter Email"
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                />
                            </>
                        ) : (
                            <>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={passwordForm.oldPassword}
                                    placeholder="Current Password"
                                    onChange={handlePasswordChange}
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    placeholder="New Password"
                                    onChange={handlePasswordChange}
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordForm.confirmPassword}
                                    placeholder="Confirm New Password"
                                    onChange={handlePasswordChange}
                                />
                            </>
                        )}
                        {error && <p style={{ color: "red" }} onClick={() => setError("")}>{error}</p>}
                        {success && <p style={{ color: "green" }} onClick={() => setSuccess("")}>{success}</p>}
                    </div>
                </div>
                <div className="contact-info">
                    <div className="contact-item">
                        <User size={20} />

                        <input
                            type="text"
                            name="empid"
                            value={userData.empid || ""}
                            placeholder="Enter Employee ID"
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
                            disabled={!isEditing || mode === "password"}
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
                        <>
                            <button onClick={handleEditProfile}>Edit</button>
                            <button onClick={handleEditPassword}
                                style={{ width: "8rem" }}
                            >Change Password</button>
                        </>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                </div>

            </div>
        </div>
    );
}

export default Profile;
