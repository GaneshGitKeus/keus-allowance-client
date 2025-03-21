import { useState, useRef } from "react";

function Signin({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const otpRefs = useRef([]);

  const submitHandler = (e) => {
    e.preventDefault();
    handleLogin({ email, password });
  };

  const moveNext = (index, e) => {
    const value = e.target.value;
    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="Form">
      <form className="Form-1" onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        {/* <div className="container">
          <h2>Enter OTP</h2>
          <div className="otp-container">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                className="otp-input"
                maxLength="1"
                ref={(el) => (otpRefs.current[index] = el)}
                onChange={(e) => moveNext(index, e)}
              />
            ))}
          </div>
        </div> */}
     
        <button type="submit" className="Signin-Buttton">Login</button>
      </form>
    </div>
  );
}

export default Signin;
