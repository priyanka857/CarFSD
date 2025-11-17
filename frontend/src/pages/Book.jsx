import React, { useState } from "react";
import axios from "axios";

function Book() {
  const [form, setForm] = useState({
    bookingType: "Car",
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    totalAmount: "",
    vehicleType: "",
    experience: "",
    licenseType: "",
    rating: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:5000/api/bookings", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      setForm({
        bookingType: "Car",
        pickupLocation: "",
        dropLocation: "",
        bookingDate: "",
        totalAmount: "",
        vehicleType: "",
        experience: "",
        licenseType: "",
        rating: "",
      });
    } catch (err) {
      console.error("❌ Booking Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Booking failed! Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="card shadow-lg border-0 rounded-4 p-4"
        style={{ maxWidth: "550px", width: "100%", backgroundColor: "#f8f5ff" }}
      >
        <div
          className="text-center text-white rounded-3 p-3 mb-4"
          style={{
            background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
          }}
        >
          <h3 className="fw-bold mb-1">Book Your {form.bookingType}</h3>
          <p className="small mb-0">DriveEase – Smart, Simple, Secure</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Booking Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">
              Booking Type
            </label>
            <select
              name="bookingType"
              value={form.bookingType}
              onChange={handleChange}
              className="form-select shadow-sm"
            >
              <option value="Car">Car</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          {/* Pickup Location */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">
              Pickup Location
            </label>
            <input
              type="text"
              name="pickupLocation"
              value={form.pickupLocation}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Enter pickup location"
              required
            />
          </div>

          {/* Drop Location (Car only) */}
          {form.bookingType === "Car" && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Drop Location
                </label>
                <input
                  type="text"
                  name="dropLocation"
                  value={form.dropLocation}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder="Enter drop location"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Vehicle Type
                </label>
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="form-select shadow-sm"
                  required
                >
                  <option value="">Select Vehicle Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
            </>
          )}

          {/* Driver Fields */}
          {form.bookingType === "Driver" && (
            <>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Experience (in years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder="e.g., 3"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  License Type
                </label>
                <input
                  type="text"
                  name="licenseType"
                  value={form.licenseType}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  placeholder="e.g., LMV, HMV"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary">
                  Driver Rating
                </label>
                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="form-select shadow-sm"
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐</option>
                  <option value="⭐⭐⭐⭐">⭐⭐⭐⭐</option>
                  <option value="⭐⭐⭐">⭐⭐⭐</option>
                </select>
              </div>
            </>
          )}

          {/* Booking Date */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">
              Booking Date
            </label>
            <input
              type="date"
              name="bookingDate"
              value={form.bookingDate}
              onChange={handleChange}
              className="form-control shadow-sm"
              required
            />
          </div>

          {/* Total Amount */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-secondary">
              Total Amount (₹)
            </label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              className="form-control shadow-sm"
              placeholder="Enter total amount"
              required
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold shadow-sm py-2"
            style={{
              background: "linear-gradient(135deg, #6f42c1, #9b59b6)",
              color: "white",
              border: "none",
            }}
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default Book;
