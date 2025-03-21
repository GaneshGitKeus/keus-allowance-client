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
                {activity.map((expense, index) => (
                    <Expenses
                    key={index}
                    icon={expense.distance ? "bi bi-bicycle" : "bi bi-cup-straw"}
                    from={expense.distance ? expense.from : expense.restaurant}
                    to={expense.distance ? expense.to : ""}
                    event={expense.distance ? "Trip" : "Food"}
                    kmorperson={expense.distance ? `${expense.distance} km` : `${expense.persons} Person`}
                    amount={expense.distance ? expense.distance * 4 : expense.amount}
                    clientName={expense.clientName}
                    leadId={expense.leadId}
                    issue={expense.purpose}
                    handleEditExpense={handleEditExpense}
                    handleDeleteExpense={handleDeleteExpense}
                    expense={expense}
                    user={user}
                />
                
                ))}
            </div>

        </>
    )
}

export default Activity