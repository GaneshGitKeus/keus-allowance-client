import "./Addexpenses.css";
import { useState, useEffect } from "react";
import {baseurl} from "../../constants"

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
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

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
            const response = await fetch(`${baseurl}/api/expense/${user._id}/${expenseId}`);
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
        setIsLoading(true);

        const payload = {
            clientName, leadId: leadID, purpose, from, to, distance: parseFloat(distance) || 0,
            restaurant, amount: parseFloat(amount) || 0, persons: parseInt(persons) || 0, date, team
        };

        const url = selectedExpense
            ? `${baseurl}/api/expense/${selectedExpense._id}`
            : `${baseurl}/api/expense`;

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
            
            const successMsg = selectedExpense ? "Expense updated successfully!" : "Expense added successfully!";
            setPopupMessage(successMsg);
            setShowPopup(true);

            if (selectedExpense) {
                setPage(0);
                setSelectedExpense(null);
            }
            clearData();
            setChanged(prev => prev + 1);
            
            // Hide popup after 3 seconds
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
            
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Addexpenses">
            <div className="Heading">
                <i className="fas fa-wallet heading-icon"></i> Claim Travel Expenses
            </div>
            {message && <div className="error-message">{message}</div>}
            
            {/* Success Message Popup */}
            {showPopup && (
                <div className="success-popup">
                    <div className="popup-content">
                        <i className="fas fa-check-circle"></i>
                        <p>{popupMessage}</p>
                    </div>
                </div>
            )}
            
            <div className="expenses-content">
                <form onSubmit={handleSubmit} className="Actions">
                    <div className="form-group">
                        <label>Client Name</label>
                        <div className="input-with-icon">
                            <i className="fas fa-user input-icon"></i>
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
                                placeholder="Enter client name"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Lead ID</label>
                        <div className="input-with-icon">
                            <i className="fas fa-id-card input-icon"></i>
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
                                placeholder="Enter lead ID"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Purpose of visit</label>
                        <div className="input-with-icon">
                            <i className="fas fa-clipboard input-icon"></i>
                            <input 
                                type="text" 
                                value={purpose} 
                                onChange={(e) => setPurpose(e.target.value)} 
                                required 
                                placeholder="Enter purpose of visit"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>From</label>
                        <div className="input-with-icon">
                            <i className="fas fa-map-marker-alt input-icon"></i>
                            <input 
                                type="text" 
                                value={from} 
                                onChange={(e) => setFrom(e.target.value)} 
                                required 
                                placeholder="Starting location"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>To</label>
                        <div className="input-with-icon">
                            <i className="fas fa-map-marker input-icon"></i>
                            <input 
                                type="text" 
                                value={to} 
                                onChange={(e) => setTo(e.target.value)} 
                                required 
                                placeholder="Destination"
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Date</label>
                        <div className="input-with-icon">
                            <i className="fas fa-calendar-alt input-icon"></i>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                max={new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })} 
                                required 
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Distance</label>
                        <div className="distance-input">
                            <div className="input-with-icon">
                                <i className="fas fa-route input-icon"></i>
                                <input 
                                    type="number" 
                                    value={distance} 
                                    onChange={(e) => setDistance(e.target.value)} 
                                    required 
                                    placeholder="0"
                                />
                            </div>
                            <span className="unit">Km</span>
                        </div>
                    </div>
                    
                    <div className="form-group toggle-group">
                        <label className="toggle-label">Add Food Bill</label>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={showExtraFields}
                                onChange={() => setShowExtraFields(!showExtraFields)}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>

                    {showExtraFields && (
                        <div className="extra-fields">
                            <div className="form-group">
                                <label>Restaurant</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-utensils input-icon"></i>
                                    <input 
                                        type="text" 
                                        value={restaurant} 
                                        onChange={(e) => setRestaurant(e.target.value)} 
                                        placeholder="Restaurant name"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Amount</label>
                                <div className="distance-input">
                                    <div className="input-with-icon">
                                        <i className="fas fa-rupee-sign input-icon"></i>
                                        <input 
                                            type="number" 
                                            value={amount} 
                                            onChange={(e) => setAmount(e.target.value)} 
                                            placeholder="0"
                                        />
                                    </div>
                                    <span className="unit">Rs</span>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Persons</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-users input-icon"></i>
                                    <input 
                                        type="number" 
                                        value={persons} 
                                        onChange={(e) => setPersons(e.target.value)} 
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>Team</label>
                                <div className="input-with-icon">
                                    <i className="fas fa-users-cog input-icon"></i>
                                    <input 
                                        type="text" 
                                        value={team} 
                                        onChange={(e) => setTeam(e.target.value)}
                                        placeholder="Team name"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="total-amount">
                        <div className="amount-card">
                            <span className="amount-label">Total Amount:</span>
                            <span className="amount-value">{totalAmount} Rs</span>
                        </div>
                    </div>
                    
                    <div className="Submit-main">
                        <button className="Submit" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    <span className="btn-text">Processing...</span>
                                </>
                            ) : (
                                <span className="btn-text">{selectedExpense ? "Update Expense" : "Submit"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Addexpenses;