import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear user state
    navigate("/login"); // Navigate immediately
  };
  if (user === undefined) return null; // wait until context initializes

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="DriveEase"
            width="35"
            height="35"
            className="me-2 rounded-circle border border-light"
          />
          DriveEase
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {/* No user logged in */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* User logged in */}
            {user && user.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/bookings">
                    Manage Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/users">
                    Manage Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/employees">
                    Manage Employees
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="text-light mx-2">Admin: {user?.name}</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* Normal user */}
            {user && user.role !== "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/become-employee">
                    Become an Employee
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/book">
                    Book Service
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my">
                    My Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="text-light mx-2">Hi, {user?.name}</span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
