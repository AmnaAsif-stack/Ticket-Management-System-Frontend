import React, { useState } from 'react';

const PassengerForm = ({ onSave }) => {
  const [passenger, setPassenger] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassenger({ ...passenger, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(passenger); // Trigger save function
    setPassenger({ name: '', email: '', phone: '', age: '', gender: '' }); // Reset form
  };

  return (
    <div className="passenger-form-container">
      <h2>Save Passenger Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="name"
            value={passenger.name}
            onChange={handleChange}
            placeholder="Enter Full Name"
            required
          />
        </div>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={passenger.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone"
            value={passenger.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={passenger.age}
            onChange={handleChange}
            placeholder="Enter Age"
            min="0"
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={passenger.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit">Save Passenger</button>
      </form>
    </div>
  );
};

export default PassengerForm;
