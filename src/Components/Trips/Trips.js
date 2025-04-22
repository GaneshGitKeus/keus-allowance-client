import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import Activity from "./Activity";
import "./Trips.css";
import Empty from "./no.png";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Filesystem, Directory } from '@capacitor/filesystem';


function Trips({ user, expenses, handleEditExpense, handleDeleteExpense }) {
    const getCurrentMonthFirstDate = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    };

    const [date, setDate] = useState(getCurrentMonthFirstDate());
    const [query, setQuery] = useState("");
    const [groupedExpenses, setGroupedExpenses] = useState({});
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalDistance, setTotalDistance] = useState(0);
    const [todayExpenses, setTodayExpenses] = useState(0);
    const [todayDistance, setTodayDistance] = useState(0);


    useEffect(() => {
        const filtered = expenses.filter(expense => new Date(expense.date).toISOString().split("T")[0] >= date);

        const searchQuery = query.toLowerCase();
        const searchFiltered = filtered.filter(expense =>
            expense.clientName.toLowerCase().includes(searchQuery) ||
            expense.leadId.toLowerCase().includes(searchQuery)
        );

        setFilteredExpenses(searchFiltered);
    }, [expenses, date, query]);

    useEffect(() => {
        const grouped = filteredExpenses.reduce((acc, expense) => {
            const expenseDate = new Date(expense.date).toISOString().split("T")[0];
            if (!acc[expenseDate]) acc[expenseDate] = [];

            acc[expenseDate].push({
                _id: expense._id,
                clientName: expense.clientName,
                leadId: expense.leadId,
                purpose: expense.purpose,
                from: expense.from,
                to: expense.to,
                distance: expense.distance,
            });

            if (expense.restaurant) {
                acc[expenseDate].push({
                    _id: expense._id,
                    clientName: expense.clientName,
                    leadId: expense.leadId,
                    purpose: expense.purpose,
                    from: expense.from,
                    to: expense.to,
                    restaurant: expense.restaurant,
                    amount: expense.amount,
                    persons: expense.persons,
                });
            }

            if(expense.otherPurpose) {
                acc[expenseDate].push({
                    _id: expense._id,
                    clientName: expense.clientName,
                    leadId: expense.leadId,
                    purpose: expense.purpose,
                    from: expense.from,
                    to: expense.to,
                    otherPurpose: expense.otherPurpose,
                    otherAmount: expense.otherAmount
                });
            }

            return acc;
        }, {});

        setGroupedExpenses(grouped);
    }, [filteredExpenses]);

    useEffect(() => {
        let totalDist = 0;
        let totalExp = 0;
        let todayDist = 0;
        let todayExp = 0;

        const todayDate = new Date().toISOString().split("T")[0];

        filteredExpenses.forEach(expense => {
            const expenseDate = new Date(expense.date).toISOString().split("T")[0];

            let expenseAmount = (expense.restaurant ? expense.amount : 0) + (expense.distance * 4) + (expense.otherAmount || 0);
            totalDist += expense.distance;
            totalExp += expenseAmount;

            if (expenseDate === todayDate) {
                todayDist += expense.distance;
                todayExp += expenseAmount;
            }
        });

        setTotalDistance(totalDist);
        setTotalExpenses(totalExp);
        setTodayDistance(todayDist);
        setTodayExpenses(todayExp);
    }, [filteredExpenses]);

    const handleDownload = async () => {

        if (user.name === "" || user.empid === "" || user.designation === "") {
            alert("Please update your profile before downloading the report.");
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const expensesByMonth = {};

        user.expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        user.expenses.forEach(expense => {
            const date = new Date(expense.date);
            const monthYear = date.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

            if (!expensesByMonth[monthYear]) {
                expensesByMonth[monthYear] = [];
            }
            expensesByMonth[monthYear].push(expense);
        });

        // Create sheets for each month-year and add expenses
        Object.entries(expensesByMonth).forEach(([monthYear, expenses]) => {
            const sheet = workbook.addWorksheet(monthYear);

            // Header Row (Employee Details)
            const headerRow = sheet.addRow(["Emp Name", user.name, "Emp. ID", user.empid, "Designation", user.designation, "Month", monthYear]);
            headerRow.font = { bold: true };  // Make header row bold

            sheet.addRow([]); // Empty row

            // Column Headers
            const columnHeaderRow = sheet.addRow(["Date", "Client Name", "Lead ID", "Purpose", "From", "To", "Vehicle", "Distance (Km)", "Amount (Rs)", "Food (Rs)", "Team Members", "otherPurpose", "otherAmount (Rs)"]);
            columnHeaderRow.font = { bold: true }; // Make column headers bold

            let totalAmount = 0;
            let totalFood = 0;
            let totalOtherAmount = 0;

            // Add Expense Data
            expenses.forEach(expense => {
                const formattedDate = new Date(expense.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                const amount = (expense.distance * 4);
                totalAmount += amount;
                totalFood += expense.amount || 0;
                totalOtherAmount += expense.otherAmount || 0;

                sheet.addRow([
                    formattedDate, // Formatted Date (e.g., "10-Jan-2025")
                    expense.clientName,
                    expense.leadId,
                    expense.purpose,
                    expense.from,
                    expense.to,
                    "Bike", // Default Vehicle
                    expense.distance,
                    amount,
                    expense.amount || 0,
                    expense.team,
                    expense.otherPurpose,
                    expense.otherAmount
                ]);
            });

            const finalTotalAmount = totalAmount + totalFood + totalOtherAmount;

            // Add Total Row
            sheet.addRow([]);
            const totalRow = sheet.addRow(["Total", "", "", "", "", "", "", "", totalAmount, totalFood, "", totalOtherAmount]);
            totalRow.font = { bold: true }; // Make total row bold

            // Final Total Row
            const finalTotalRow = sheet.addRow(["Total Petrol And Food", "", "", "", "", "", "", "", "", finalTotalAmount]);
            finalTotalRow.font = { bold: true }; // Make final total row bold
            // Merge I and J columns in the final total row
            sheet.mergeCells(`I${finalTotalRow.number}:J${finalTotalRow.number}`);

            // Set the final total amount explicitly in the merged cell (I column)
            sheet.getCell(`I${finalTotalRow.number}`).value = finalTotalAmount;
            sheet.getCell(`I${finalTotalRow.number}`).alignment = { horizontal: "center" };

            sheet.addRow([]);

            // Signature Row
            const signatureRow = sheet.addRow(["Claimant Signature", "", "Approval Authority Sign", "", "Final Authority Sign"]);
            signatureRow.font = { bold: true }; // Make signature row bold

            const columnWidths = [20, 25, 21, 25, 20, 20, 8, 12, 12, 12, 20];
            columnWidths.forEach((width, index) => {
                sheet.getColumn(index + 1).width = width;
            });

            sheet.getColumn(11).alignment = { wrapText: true };
        });



        // Create and download Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        // const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        // saveAs(blob, `Expenses_${user.name}.xlsx`);
        // Create a URL for the blob
        try {
            // Convert buffer to base64 string
            const base64Data = arrayBufferToBase64(buffer);
            
            // Save file using Capacitor Filesystem API
            const fileName = `Expenses_${user.name}.xlsx`;
            const savedFile = await Filesystem.writeFile({
                path: fileName,
                data: base64Data,
                directory: Directory.Documents,
                recursive: true
            });
            
            // Alert the user that the file has been saved
            alert(`Report saved to: ${savedFile.uri}`);
            
            // Optionally open the file
            // This requires installing @capacitor/document-viewer plugin
        } catch (error) {
            console.error('Error saving file:', error);
            alert('Failed to save the report. Please try again.');
        }
    };
    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }


    return (
        <div className="trip">
            <div className="Bgcolor">
                <div className="Totalcount">
                    <div>
                        <div>
                            <span className="">Total Distance : </span>
                            <span className="Amount">{totalDistance}</span>
                            <span>km</span>
                        </div>
                        <div>
                            <span className="">Total Expense : </span>
                            <span className="Amount">{totalExpenses}</span>
                            <span><i className="bi bi-currency-rupee"></i></span>
                        </div>
                    </div>
                    <div>
                        {/* <div>
                            <span className="">Today Distance: </span>
                            <span className="Amount">{todayDistance}</span>
                            <span>km  </span>
                        </div>
                        <div>
                            <span className="">Today Expense: </span>
                            <span className="Amount">{todayExpenses}</span>
                            <span><i className="bi bi-currency-rupee"></i></span>
                        </div> */}
                    </div>
                </div>
                <div className="Downloadicon" onClick={handleDownload}>
                    <i className="bi bi-download"></i>
                </div>
            </div>

            {/* <div className="search-container">
                <div className="date-selector">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="Search-client">
                    <input
                        type="text"
                        placeholder="Search Lead ID or Client Name"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div> */}

            <div className="search-container">
                <div className="date-selector">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="Search-client">
                    <input type="text" placeholder="Lead ID or Name" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </div>


            <div className="activities">
                {Object.keys(groupedExpenses).length > 0 ? (
                    Object.keys(groupedExpenses).map(expenseDate => (
                        <Activity
                            key={expenseDate}
                            user={user}
                            expenseDate={expenseDate}
                            activity={groupedExpenses[expenseDate]}
                            handleEditExpense={handleEditExpense}
                            handleDeleteExpense={handleDeleteExpense}
                        />
                    ))
                ) : (
                    <div className="empty-expenses">
                        <img src={Empty} alt="No expenses added" />
                        <p style={{textAlign:"center",}}>No items found</p>
                    </div>
                )}
            </div>

        </div>
    );
}

export default Trips;
