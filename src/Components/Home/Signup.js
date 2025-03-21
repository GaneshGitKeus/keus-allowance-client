import { useState } from "react";

function Signup({ handleSignup }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        handleSignup({ name, email, password });
    };

    return (
        <div className="Form-Signup">
            <form onSubmit={submitHandler}>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Re-enter Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <div>
                <button type="submit" className="Signup-Buttton">Signup</button>
                </div>
            </form>
        </div>
    );
}

export default Signup;
