import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

const getToken = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user"));
    return u?.token || localStorage.getItem("token");
  } catch {
    return localStorage.getItem("token");
  }
};

function AdminManageEmployees() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(`${API_BASE_URL}/api/employees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setList(res.data);
    } catch (err) {
      console.error(
        "Fetch employees error:",
        err.response?.data || err.message
      );
      alert("Unable to fetch employees. Check auth.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = getToken();
      await axios.put(
        `${API_BASE_URL}/api/employees/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Employee Applications</h3>
      {list.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <table className="table table-bordered table-hover text-center">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Vehicle</th>
              <th>Exp (yrs)</th>
              <th>License</th>
              <th>Status</th>
              <th>Applied At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.phone || "-"}</td>
                <td>{e.vehicleType || "-"}</td>
                <td>{e.experience || 0}</td>
                <td>{e.licenseNumber || "-"}</td>
                <td>{e.status}</td>
                <td>{new Date(e.createdAt).toLocaleString()}</td>
                <td>
                  <div className="d-flex gap-1 justify-content-center">
                    {/* Hide Approve/Reject after decision */}
                    {e.status === "Pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => updateStatus(e._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => updateStatus(e._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(e._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminManageEmployees;
