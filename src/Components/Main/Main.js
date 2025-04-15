import { useState, useEffect, use } from "react";
import Trips from "../Trips/Trips";
import Addexpenses from "../Addexpenses/Addexpenses";
import Profile from "../Profile/Profile";
import "./Main.css";
import { useNavigate } from "react-router-dom";
import {baseurl} from "../../constants"
import { userData } from "../../api";

function Main() {
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [user, setUser] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [changed, setChanged] = useState(0);
    const [selectedExpense, setSelectedExpense] = useState(null);

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

        try {
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setChanged(prev => prev + 1);
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };



    return (
        <div>
            {page === 0 && <Trips user={user} expenses={expenses} handleEditExpense={handleEditExpense} handleDeleteExpense={handleDeleteExpense} />}
            {page === 1 && <Addexpenses user={user} selectedExpense={selectedExpense} setChanged={setChanged} page={page} setPage={setPage} setSelectedExpense={setSelectedExpense} />}
            {page === 2 && <Profile user={user} setChanged={setChanged} />}

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
                <div className="Profile" onClick={() => setPage(2)}>
                    <i className="bi bi-person-circle"></i>
                    <span>Profile</span>
                </div>
            </div>
        </div>
    );
}

export default Main;
