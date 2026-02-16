import React, { useState } from "react";
import "./Signup.css";
import { BACKEND_URL } from "./MyContext";

function Signup({setUser}) {
  const [isSignup, setIsSignup] = useState(true);

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const [userData, setUserData] = useState(null);

const [showRightSuccess, setShowRightSuccess] = useState(false);
const [showLoader, setShowLoader] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.Email || !form.Password || (isSignup && !form.Name)) {
      setMessage("All fields are required");
      return;
    }

    setLoading(true);
    setMessage("");

    const url = isSignup
  ? `${BACKEND_URL}/api/signup`
  : `${BACKEND_URL}/api/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Something went wrong");
      } else {
        setMessage(
          isSignup ? "Signup successful!" : "Login successful!"
        );
        setForm({ Name: "", Email: "", Password: "" });
        
setUserData(data.user);
setUserData(data.user);

// Step 1 → show success
setShowRightSuccess(true);

// Step 2 → hide success after 3s, show loader
setTimeout(() => {
  setShowRightSuccess(false);
  setShowLoader(true);

  // Step 3 → after loader (3s), set user and redirect
  setTimeout(() => {
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  }, 3000);

}, 3000);


      }
    } catch (err) {
      setMessage("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="page">


      <div className={`card ${showLoader ? "blur" : ""}`}>


  {/* LEFT SIDE FORM */}
  <div className="left">
         <h2> {isSignup ? "Create Account" : "Login"}
        </h2>
{message && (
    <div className={`alert-popup ${message.includes("success") ? "success" : ""}`}>
  {message}
</div>

  )}
        <form onSubmit={handleSubmit} >
          {isSignup && (
            <input
              className="input"
              name="Name"
              placeholder="Name"
              value={form.Name}
              onChange={handleChange}
               autoComplete="name"
            />
          )}

          <input
            className="input"
            name="Email"
            type="email"
            placeholder="Email"
            value={form.Email}
            onChange={handleChange}
             autoComplete="email"
          />

          <input
            className="input"
            name="Password"
            type="password"
            placeholder="Password"
            value={form.Password}
            onChange={handleChange}
             autoComplete={
      isSignup ? "new-password" : "current-password"
    }
          />

          <button
            className="button primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isSignup
              ? "Sign Up"
              : "Login"}
          </button>
      

        </form>
          <h5
  className="me"
  onClick={() => {
    setIsSignup(!isSignup);
    setMessage("");
  }}
>
  {isSignup ? (
    <>
      Already have an account?{" "}
      <span className="highlight">Login</span>
    </>
  ) : (
    <>
      Don't have an account?{" "}
      <span className="highlight">Sign Up</span>
    </>
  )}
</h5>
 
  
       

       
      </div>
     <div className="right">
  {showRightSuccess ? (
    <div className="success-box">
      <img
        src={userData?.ProfileImage || "https://i.pravatar.cc/100"}
        alt="user"
        className="user-img"
      />
      <h3>Welcome {userData?.Name}</h3>
      <p>Getting things ready...</p>
    </div>
  ) : (
    <div>
      <h2>Welcome Back</h2>
      <p>Please login to continue</p>
    </div>
  )}
</div>
</div>

    {/* LOADER */}
   {showLoader && (
  <div className="loader-overlay">
    <div className="small-loader"></div>
  </div>
)}

    </div>
  );
}

export default Signup;
