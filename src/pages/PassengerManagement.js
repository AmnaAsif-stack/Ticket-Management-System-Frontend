import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './css/PassengerManagement.css';

const PassengerManagement = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [passenger, setPassenger] = useState({
    passportNumber: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });

  const navigate = useNavigate();

  // Fetch user and passenger data from API and store it in state and localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data (for name, email)
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Set state with user data from the database
        setUser(userResponse.data);
        // Save the fetched data in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(userResponse.data));

        // Fetch passenger data (for passport number, phone, address, date of birth)
        const passengerResponse = await axios.get("http://localhost:5000/api/passenger", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Set state with passenger data
        setPassenger(passengerResponse.data);
        // Save the passenger data in localStorage for persistence
        localStorage.setItem("passenger", JSON.stringify(passengerResponse.data));
      } catch (error) {
        console.error("Error fetching user or passenger data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in user) {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (name in passenger) {
      setPassenger((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the current state
    console.log("Passenger state before update:", passenger);
  
    try {
      // Send the updated user and passenger details to the backend
      const response = await axios.put(
        "http://localhost:5000/update-profile",
        { ...user, ...passenger },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      if (response.data) {
        alert("Profile updated successfully");
  
        // Log response data
        console.log("Updated response:", response.data);
  
        // Save updated user and passenger data to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("passenger", JSON.stringify(response.data.passenger));
  
        // Navigate to the dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };
  

  return (
    <div className="profile-management">
      <h2>Manage Your Profile</h2>

      {/* Displaying Current User Information */}
      <div className="user-information">
        <h3>Your Current Profile Information:</h3>
        <div>
          <strong>Name:</strong> {user.name}
        </div>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>Passport Number:</strong> {passenger.passportNumber}
        </div>
        <div>
          <strong>Phone:</strong> {passenger.phone}
        </div>
        <div>
          <strong>Address:</strong> {passenger.address}
        </div>
        
      </div>

      {/* Profile Update Form */}
      <h3>Edit Your Profile:</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Passport Number</label>
          <input
            type="text"
            name="passportNumber"
            value={passenger.passportNumber}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={passenger.phone}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={passenger.address}
            onChange={handleInputChange}
          />
        </div>
      
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default PassengerManagement;
