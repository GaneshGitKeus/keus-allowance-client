import React, { useState } from "react";

function Expenses(props) {
    const [showBottomSheet, setShowBottomSheet] = useState(false);

    // Handle long press event
    let pressTimer;
    const handleMouseDown = () => {
        pressTimer = setTimeout(() => setShowBottomSheet(true), 500); // 500ms threshold
    };

    const handleMouseUp = () => {
        clearTimeout(pressTimer);
    };

    // Determine what label to show before the location/purpose
    const getLocationLabel = () => {
        if (props.event === "Others") {
            return "Others:";
        } else if (props.to) {
            return "Destination:";
        } else {
            return "Restaurant:";
        }
    };

    return (
        <>
            <div 
                className="Expenses" 
                onMouseDown={handleMouseDown} 
                onMouseUp={handleMouseUp} 
                onTouchStart={handleMouseDown} 
                onTouchEnd={handleMouseUp}
            >
                <div className="Petrol-Icon">
                    <span className="icon"><i className={props.icon}></i></span>
                    <span>{props.event}</span>
                </div>
                <div className="Total-Details">
                    <div className="Trip-Details">
                        <span>{props.clientName} </span>
                        <span>{props.leadId}</span>
                        <span> <span className="Issue">{getLocationLabel()}</span> {props.from} {props.to && <span>to</span>} {props.to}</span>
                        <span><span className="Issue">POV: </span>{props.issue}</span>
                    </div>
                    <div className="Kms-Amount">
                        <span>{props.kmorperson}</span>
                        <span>{props.amount}<span><i className="bi bi-currency-rupee"></i></span></span>
                    </div>
                </div>
            </div>

            {/* Full-Screen Bottom Sheet Modal */}
            {showBottomSheet && (
                <div className="bottom-sheet-overlay" onClick={() => setShowBottomSheet(false)}>
                    <div className="bottom-sheet">
                        <button onClick={() => { props.handleEditExpense(props.expense); setShowBottomSheet(false); }}>Edit Expense</button>
                        <button onClick={() => { props.handleDeleteExpense(props.expense); setShowBottomSheet(false); }}>Delete Expense</button>
                        <button onClick={() => setShowBottomSheet(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Expenses;