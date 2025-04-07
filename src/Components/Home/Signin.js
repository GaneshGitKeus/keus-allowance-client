import { useState, useRef } from "react";
import "./Signin.css"; // Add this CSS file

function Signin({ handleLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await handleLogin({ email, password });
    } finally {
      setIsLoading(false);
    }
  };

  const moveNext = (index, e) => {
    const value = e.target.value;
    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="Form">
      <form className="Form-1" onSubmit={submitHandler}>
        <input
          type="email"
          className="form-control custom-input mb-3"
          placeholder="Email Address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control custom-input mb-3"
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

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>
    </div>
  );
}

export default Signin;