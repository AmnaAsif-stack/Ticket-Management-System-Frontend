import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './css/PassengerManagement.css'; // Import the styles for the background

const PassengerManagement = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    location: "New York",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    // Save the updated profile to localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile updated successfully!");
    navigate("/dashboard");
  };

  return (
    <div className="passenger-management-container">
      <div className="passenger-form-wrapper">
        <h2>Update Your Profile</h2>
        <form>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
          />
          <br />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            onChange={handleInputChange}
          />
          <br />
          <label>Location:</label>
          <input
            type="text"
            name="location"
            onChange={handleInputChange}
          />
          <br />
          <button type="button" onClick={handleSaveProfile}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassengerManagement;
