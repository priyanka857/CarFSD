import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.token || localStorage.getItem("token");
  } catch (err) {
    return localStorage.getItem("token");
  }
};

function BecomeEmployee() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    experience: "",
    qualification: "",
    vehicleType: "",
    licenseNumber: "",
    availability: true,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [hasExisting, setHasExisting] = useState(false);

  // Fetch logged-in user's existing employee profile if exists
  useEffect(() => {
    const fetchMyApplication = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await axios.get("http://localhost:5000/api/employees/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data._id) {
          setForm(res.data);
          setHasExisting(true);
        }
      } catch (err) {
        console.log("No existing employee profile");
      }
    };
    fetchMyApplication();
  }, []);

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  // submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        alert("Please login before applying.");
        return;
      }

      if (hasExisting) {
        // update my employee profile
        await axios.put("http://localhost:5000/api/employees/me", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Profile updated successfully!");
      } else {
        // first-time apply
        await axios.post("http://localhost:5000/api/employees", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Application submitted successfully!");
        setHasExisting(true);
      }
    } catch (err) {
      console.error("Apply/Update error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center my-5">
      <div className="card shadow" style={{ maxWidth: 800, width: "100%" }}>
        <div
          className="card-header text-white"
          style={{
            background: "linear-gradient(90deg,#6f42c1,#9b59b6)",
          }}
        >
          <h4 className="mb-0">
            {hasExisting ? "Update Employee Profile" : "Become an Employee / Driver"}
          </h4>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                  type="email"
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Experience (years)</label>
                <input
                  name="experience"
                  value={form.experience || ""}
                  onChange={handleChange}
                  type="number"
                  min="0"
                  className="form-control"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Qualification</label>
                <input
                  name="qualification"
                  value={form.qualification || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Preferred Vehicle Type</label>
                <input
                  name="vehicleType"
                  value={form.vehicleType || ""}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Sedan, SUV"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">License Number</label>
                <input
                  name="licenseNumber"
                  value={form.licenseNumber || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div>
                  <input
                    name="availability"
                    checked={form.availability}
                    onChange={handleChange}
                    className="form-check-input me-2"
                    type="checkbox"
                    id="available"
                  />
                  <label className="form-check-label" htmlFor="available">
                    Available to work
                  </label>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label">Notes / Short Bio</label>
                <textarea
                  name="notes"
                  value={form.notes || ""}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>

              <div className="col-12 text-end">
                <button
                  disabled={loading}
                  className="btn btn-primary"
                  type="submit"
                  style={{
                    background: "linear-gradient(90deg,#6f42c1,#9b59b6)",
                    border: "none",
                  }}
                >
                  {loading
                    ? "Saving..."
                    : hasExisting
                    ? "Update Profile"
                    : "Submit Application"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BecomeEmployee;
