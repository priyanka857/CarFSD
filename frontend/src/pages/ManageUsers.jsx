import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";


const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });

  // ✅ Safely get token from localStorage
  const getToken = () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      return storedUser?.token || storedUser?.userInfo?.token || null;
    } catch (error) {
      console.error("Token parse error:", error);
      return null;
    }
  };

  // ✅ Fetch all users (Admin only)
  const fetchUsers = async () => {
    const token = getToken();
    if (!token) {
      alert("No token found. Please login again as Admin.");
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
  };

  // ✅ Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id)); // instant update
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  // ✅ Start edit mode
  const startEdit = (user) => {
    setEditingUser(user._id);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  // ✅ Update user
  const handleUpdate = async () => {
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/admin/users/${editingUser}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Failed to update user details.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary">Manage Users</h3>

      <table className="table table-bordered table-hover mt-3">
        <thead className="table-info">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => startEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingUser && (
        <div className="card shadow p-4 mt-4">
          <h5 className="fw-bold mb-3">Edit User</h5>
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <select
            className="form-select mb-3"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div>
            <button className="btn btn-success me-2" onClick={handleUpdate}>
              Update
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
