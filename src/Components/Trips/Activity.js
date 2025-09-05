import { useEffect } from "react"
import Expenses from "./Expenses"

function Activity({ user, expenseDate, activity, handleEditExpense, handleDeleteExpense }) {
    useEffect(() => {
        console.log("Expense Date:", expenseDate);
        console.log("Activity:", activity);
    })

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        let formattedDate = date.toLocaleDateString('en-US', options);
        formattedDate = formattedDate.replace(/^(\w+), (\w+) (\d+), (\d+)$/, "$1, $3-$2-$4");
        return formattedDate;
    }

    return (
        <>
            <div className="Date">
                <span>{formatDate(expenseDate)}</span>
            </div>

            <div className="Expenses-Container">
                {activity.map((expense, index) => {
                    // Determine the expense type and related properties
                    let icon, from, to, event, kmorperson, amount;
                    
                    if (expense.otherPurpose || expense.otherAmount) {
                        // Other Expenses case
                        icon = "bi bi-box";
                        from = expense.otherPurpose;
                        to = "";
                        event = "Others";
                        kmorperson = "";
                        amount = expense.otherAmount;
                    } else if (expense.distance) {
                        // Trip case
                        icon = "bi bi-bicycle";
                        from = expense.from;
                        to = expense.to;
                        event = "Trip";
                        kmorperson = `${expense.distance} km`;
                        amount = expense.distance * 4;
                    } else {
                        // Food case
                        icon = "bi bi-cup-straw";
                        from = expense.restaurant;
                        to = "";
                        event = "Food";
                        kmorperson = `${expense.persons} Person`;
                        amount = expense.amount;
                    }
                    
                    return (
                        <Expenses
                            key={index}
                            icon={icon}
                            from={from}
                            to={to}
                            event={event}
                            kmorperson={kmorperson}
                            amount={amount}
                            clientName={expense.clientName}
                            leadId={expense.leadId}
                            issue={expense.purpose}
                            handleEditExpense={handleEditExpense}
                            handleDeleteExpense={handleDeleteExpense}
                            expense={expense}
                            user={user}
                        />
                    );
                })}
            </div>
        </>
    )
}

export default Activity