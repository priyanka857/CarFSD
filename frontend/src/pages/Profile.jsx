import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";


const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if no user (not logged in)
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: "",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      // 1️⃣ Upload to Cloudinary
      const uploadRes = await axios.post(
        `${API_BASE_URL}/api/upload/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 2️⃣ Update user picture in database
      const updateRes = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        { profilePicture: uploadRes.data.imageUrl },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      updateUser(updateRes.data);

      setFormData((prev) => ({
        ...prev,
        profilePicture: uploadRes.data.imageUrl,
      }));

      alert("Profile picture updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile picture");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/users/profile`,
        { name: formData.name },
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      updateUser(res.data);
      setFormData((prev) => ({ ...prev, name: res.data.name }));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (!user) return null; // prevent render errors

  return (
    <div className="container mt-5">
      <h3>My Profile</h3>

      <div className="text-center mb-4 position-relative">
        <img
          src={
            formData.profilePicture
              ? formData.profilePicture // Cloudinary URL direct
              : "/default-profile.png"
          }
          alt="Profile"
          className="rounded-circle"
          width="120"
          height="120"
          style={{ objectFit: "cover" }}
        />
        <label
          htmlFor="profilePicInput"
          className="position-absolute"
          style={{
            bottom: 0,
            right: "calc(50% - 10px)",
            backgroundColor: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            padding: "6px",
            cursor: "pointer",
          }}
        >
          <FaCamera color="white" />
        </label>
        <input
          type="file"
          id="profilePicInput"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      <form
        onSubmit={handleProfileUpdate}
        className="card p-4 shadow-sm"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            name="email"
            value={formData.email}
            className="form-control"
            disabled
          />
        </div>

        <button className="btn btn-primary w-100">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
