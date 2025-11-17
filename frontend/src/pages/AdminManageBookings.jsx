import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminManageBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchAll = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(res.data);
  };

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/bookings/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchAll();
  };

  const deleteBooking = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Manage Bookings (Admin)</h3>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Date</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.user?.name}</td>
                <td>{b.bookingType}</td>
                <td>{b.pickupLocation}</td>
                <td>{b.dropLocation || "-"}</td>
                <td>{new Date(b.bookingDate).toLocaleDateString()}</td>
                <td>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b._id, e.target.value)}
                    className="form-select form-select-sm"
                  >
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
                <td>₹{b.totalAmount}</td>
                <td>
                  <button
                    onClick={() => deleteBooking(b._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminManageBookings;
