import { useState, useEffect, use } from "react";
import SopScreen from "../../screens/SopScreen";

import Trips from "../Trips/Trips";
import Addexpenses from "../Addexpenses/Addexpenses";
import Profile from "../Profile/Profile";
import "./Main.css";
import { useNavigate } from "react-router-dom";
import { baseurl } from "../../constants"
import { userData } from "../../api";
import { Preferences } from "@capacitor/preferences";

function Main() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [changed, setChanged] = useState(0);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState("success");

    const handleEditExpense = (expense) => {
        console.log("Editing expense:", expense);
        setSelectedExpense(expense);
        setPage(1); // Navigate to Addexpenses page
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await userData(); // Assuming userData is a function that fetches user data
                setUser(data);
                setExpenses(data.expenses);
                console.log("User Data:", data);
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };

        fetchUserData();
    }, [changed]);

    const handleDeleteExpense = async (expense) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;

        let url = `${baseurl}/api/expense/${expense._id}`;
        let method = "DELETE";
        let body = null;

        // If it's a Food expense, update instead of delete
        if (!expense.distance && expense.restaurant) {
            url = `${baseurl}/api/expense/food/${expense._id}`;
            method = "PUT";
            body = JSON.stringify({
                clientName: expense.clientName,
                leadId: expense.leadId,
                purpose: expense.purpose,
                from: expense.from,
                to: expense.to,
                distance: expense.distance || 0,
                restaurant: "",
                amount: 0,
                persons: 0,
                date: expense.date
            });
        }

        if (!expense.distance && expense.otherPurpose) {
            url = `${baseurl}/api/expense/otherexpense/${expense._id}`;
            method = "PUT";
            body = JSON.stringify({
                clientName: expense.clientName,
                leadId: expense.leadId,
                purpose: expense.purpose,
                from: expense.from,
                to: expense.to,
                date: expense.date,
                otherPurpose: expense.otherPurpose,
                otherAmount: 0
            });
        }

        try {
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body
            });

            const data = await response.json();
            if (!response.ok) {
                setPopupType("error");
                const errorMsg = "Failed to delete expense";
                setPopupMessage(errorMsg);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
                throw new Error(data.error);
            }
            setPopupType("success");
            setPopupMessage("Expense deleted successfully");
            setShowPopup(true);
            const updatedUser = await userData(true);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            await Preferences.set({ key: "user", value: JSON.stringify(updatedUser) });
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
            setChanged(prev => prev + 1);
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };



    return (
        <div>
            {showPopup && (
                <div className="success-popup">
                    <div className="popup-content" style={{ backgroundColor: popupType === "success" ? "#4CAF50" : "#f44336" }}>
                        <i className="fas fa-check-circle"></i>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
            {page === 0 && <Trips user={user} expenses={expenses} handleEditExpense={handleEditExpense} handleDeleteExpense={handleDeleteExpense} />}
            {page === 1 && <Addexpenses user={user} selectedExpense={selectedExpense} setChanged={setChanged} page={page} setPage={setPage} setSelectedExpense={setSelectedExpense} />}
            {page === 2 && <Profile user={user} setChanged={setChanged} />}
            {page === 3 && <SopScreen />}

            <div className="Bottom-Buttons">
                <div className="Expenses-main" onClick={() => setPage(0)}>
                    <i className="bi bi-house"></i>
                    <span>Home</span>
                </div>
                <div className="New-expense" onClick={() => {
                    setSelectedExpense(null);
                    setPage(1);
                }}>
                    <i className="bi bi-plus-circle"></i>
                    <span>New Expense</span>
                </div>
                <div className="SOP" onClick={() => setPage(3)}>
                    <i className="bi bi-journal-text"></i> {/* Bootstrap icon for documents */}
                    <span>SOP</span>
                </div>
                <div className="Profile" onClick={() => setPage(2)}>
                    <i className="bi bi-person-circle"></i>
                    <span>Profile</span>
                </div>
                

            </div>
        </div>
    );
}

export default Main;
