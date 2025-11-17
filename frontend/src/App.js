import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import ManageUsers from "./pages/ManageUsers";
import MyBookings from "./pages/MyBookings";
import AdminManageBookings from "./pages/AdminManageBookings";
import AdminProfile from "./pages/AdminProfile";
import Book from "./pages/Book";
import BecomeEmployee from "./pages/BecomeEmployee";
import AdminManageEmployees from "./pages/AdminManageEmployee";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-fill">
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* User Routes */}
            <Route path="/book" element={<Book />} />
            <Route path="/my" element={<MyBookings />} />

            {/* Admin Routes */}
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<AdminManageBookings />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/become-employee" element={<BecomeEmployee />} />
            <Route path="/admin/employees" element={<AdminManageEmployees />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
