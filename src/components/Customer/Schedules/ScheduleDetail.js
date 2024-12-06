import React from "react";
import { useParams } from "react-router-dom";

const ScheduleDetail = () => {
  const { id } = useParams();
  const schedule = {
    id: id,
    route: "City A to City B",
    time: "10:00 AM",
    bus: "Express 101",
    seatsAvailable: 25,
    price: "$15",
  };


  

  return (
    <div className="container">
      <h2>Schedule Details</h2>
      <p><strong>Route:</strong> {schedule.route}</p>
      <p><strong>Time:</strong> {schedule.time}</p>
      <p><strong>Bus:</strong> {schedule.bus}</p>
      <p><strong>Seats Available:</strong> {schedule.seatsAvailable}</p>
      <p><strong>Price:</strong> {schedule.price}</p>
      <button className="auth-button">Book Ticket</button>
    </div>
  );
};

export default ScheduleDetail;
