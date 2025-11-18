import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, {
        email,
        password,
      });
      localStorage.setItem("userInfo", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);

      if (res.data && res.data._id && res.data.token) {
        // ✅ Ensure token is included in the stored object
        login(res.data);
        alert("Login successful!");

        // Redirect based on role
        if (res.data.role === "admin") {
          navigate("/manageUsers"); // Admin dashboard
        } else {
          navigate("/"); // Regular user
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderTop: "4px solid #5a2ca0" }}
      >
        <h3 className="text-center mb-3" style={{ color: "#5a2ca0" }}>
          Login
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={togglePassword}
              style={{
                position: "absolute",
                right: "10px",
                top: "38px",
                cursor: "pointer",
                color: "#5a2ca0",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-danger text-center">{error}</p>}

          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#5a2ca0", color: "white" }}
          >
            Login
          </button>

          <p className="text-center mt-3 mb-0">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
