import "./Addexpenses.css";
import { useState, useEffect } from "react";

function Addexpenses({ user, setChanged, selectedExpense, setPage, setSelectedExpense }) {
    const [clientName, setClientName] = useState("");
    const [leadID, setLeadID] = useState("");
    const [purpose, setPurpose] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [distance, setDistance] = useState("");
    const [restaurant, setRestaurant] = useState("");
    const [amount, setAmount] = useState("");
    const [persons, setPersons] = useState(0);
    const [date, setDate] = useState("");
    const [showExtraFields, setShowExtraFields] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [message, setMessage] = useState("");
    const [team, setTeam] = useState("");

    useEffect(() => {
        const dist = distance ? parseFloat(distance) : 0;
        const amt = showExtraFields && amount ? parseFloat(amount) : 0;
        setTotalAmount(dist * 4 + amt);
    }, [distance, amount, showExtraFields]);

    useEffect(() => {
        clearData();
    }, [selectedExpense]);

    const getExpenseDetailUsingUserIdandExpenseId = async (expenseId) => {
        try {
            const response = await fetch(`https://keus-allowance-app.onrender.com/api/expense/${user._id}/${expenseId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching expense details:", error);
            return null;
        }
    };

    useEffect(() => {
        if (selectedExpense) {

            getExpenseDetailUsingUserIdandExpenseId(selectedExpense._id).then((data) => {
                if (data) {
                    console.log("Expense Data:", data);
                    setClientName(data.clientName);
                    setLeadID(data.leadId);
                    setPurpose(data.purpose);
                    setFrom(data.from);
                    setTo(data.to);
                    setDistance(data.distance || "");
                    setRestaurant(data.restaurant || "");
                    setAmount(data.amount || "");
                    setPersons(data.persons || 0);
                    setTeam(data.team || "");
                    setDate(data.date ? data.date.split("T")[0] : "");
                    setShowExtraFields(!!data.restaurant);
                }
            });
        }
    }, [selectedExpense]);

    const clearData = () => {
        setClientName("");
        setLeadID("");
        setPurpose("");
        setFrom("");
        setTo("");
        setDistance("");
        setRestaurant("");
        setAmount("");
        setPersons(0);
        setDate("");
        setShowExtraFields(false);
        setTotalAmount(0);
        setMessage("");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const payload = {
            clientName, leadId: leadID, purpose, from, to, distance: parseFloat(distance) || 0,
            restaurant, amount: parseFloat(amount) || 0, persons: parseInt(persons) || 0, date, team
        };

        const url = selectedExpense
            ? `https://keus-allowance-app.onrender.com/api/expense/${selectedExpense._id}`
            : "https://keus-allowance-app.onrender.com/api/expense";

        const method = selectedExpense ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setMessage(selectedExpense ? "Expense updated successfully!" : "Expense added successfully!");

            if (selectedExpense) {
                setPage(0);
                setSelectedExpense(null);
            }
            clearData();
            setChanged(prev => prev + 1);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };


    return (
        <div className="Addexpenses">
            <div className="Heading">
                Claim Travel Expenses
            </div>
            {message && <div className="message">{message}</div>}
            <div className="expenses-content">
                <form onSubmit={handleSubmit} className="Actions">
                    <label>Client Name</label>
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => {
                            if (e.target.value.length <= 20) {
                                setClientName(e.target.value);
                            }
                        }}
                        maxLength={20}
                        required
                    />
                    <label>Lead ID</label>

                    <input
                        type="text"
                        value={leadID}
                        onChange={(e) => {
                            if (e.target.value.length <= 20) {
                                setLeadID(e.target.value);
                            }
                        }}
                        maxLength={20}
                        required
                    />
                    <label>Purpose of visit</label>
                    <input type="text" value={purpose} onChange={(e) => setPurpose(e.target.value)} required />
                    <label>From</label>
                    <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} required />
                    <label>To</label>
                    <input type="text" value={to} onChange={(e) => setTo(e.target.value)} required />
                    <label>Date</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} max={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })} required />
                    <label>Distance</label>
                    <span className="Actions-distance">
                        <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} required /> Km
                    </span>
                    <br />
                    <label className="toggle-label">Add Food Bill</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={showExtraFields}
                            onChange={() => setShowExtraFields(!showExtraFields)}
                        />
                        <span className="slider"></span>
                    </label>

                    {showExtraFields && (
                        <div>
                            <label>Restaurant</label>
                            <input type="text" value={restaurant} onChange={(e) => setRestaurant(e.target.value)} />
                            <label>Amount</label>
                            <span className="Actions-distance">
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /> Rs
                            </span>
                            <label>Persons</label>
                            <input type="number" value={persons} onChange={(e) => setPersons(e.target.value)} />
                            <label>Team</label>
                            <input type="text" value={team} onChange={(e) => setTeam(e.target.value)}  />
                        </div>
                    )}
                    <div className="total-amount">Total Amount: {totalAmount} Rs</div>
                    <div className="Submit-main">
                        <button className="Submit" type="submit">
                            {selectedExpense ? "Update Expense" : "Submit"} 
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Addexpenses;
