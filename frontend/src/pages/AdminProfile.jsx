import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Card } from "react-bootstrap";
import API_BASE_URL from "../config";


const AdminProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = user?.token;
      const res = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      updateUser(res.data); // update context
      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="container py-5">
      <Card className="shadow-lg p-4 border-0">
        <h2 className="text-center text-primary mb-4">Admin Profile</h2>

        {!isEditing ? (
          <>
            <div className="row">
              <div className="col-md-4 text-center mb-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="Admin Avatar"
                  className="rounded-circle border border-primary"
                  width="150"
                  height="150"
                />
              </div>

              <div className="col-md-8">
                <h4 className="fw-bold">{user?.name || "Admin"}</h4>
                <p className="mb-1">
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className="mb-1">
                  <strong>Role:</strong> {user?.role}
                </p>
                <p className="mb-1">
                  <strong>Last Login:</strong>{" "}
                  {new Date().toLocaleString()}
                </p>

                <hr />
                <h5 className="text-secondary mt-3">Admin Controls</h5>
                <ul>
                  <li>✅ Manage all users and bookings</li>
                  <li>✅ Update or delete user identities</li>
                  <li>✅ View system reports</li>
                </ul>

                <button
                  className="btn btn-warning mt-3"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-success me-2">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminProfile;
