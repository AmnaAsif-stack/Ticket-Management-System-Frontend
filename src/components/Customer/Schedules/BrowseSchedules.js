import React, { useState } from "react";
import axios from "axios";

export const BrowseSchedules = ({ routesData }) => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState(null);

  const fetchSchedules = async (routeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/bus-schedules/${routeId}`);
      setSchedules(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setSchedules([]);
      setError("Failed to load schedules. Please try again.");
    }
  };

  return (
    <section className="bus-schedule-section">
      <h2>Bus Schedules</h2>
      <div className="route-list">
        {routesData.map((route) => (
          <div key={route._id} className="route-card">
            <h3>{route.start} to {route.end}</h3>
            <button
              className="auth-button"
              onClick={() => {
                setSelectedRoute(route._id);
                fetchSchedules(route._id);
              }}
            >
              Show Schedules
            </button>
          </div>
        ))}
      </div>

      {selectedRoute && (
        <div className="schedule-results">
          <h3>Schedules for Selected Route</h3>
          {error ? (
            <p className="error">{error}</p>
          ) : schedules.length > 0 ? (
            schedules.map((schedule) => (
              <div key={schedule._id} className="schedule-card">
                <h4>Bus: {schedule.bus.name}</h4>
                <p>Departure: {new Date(schedule.departureTime).toLocaleString()}</p>
                <p>Arrival: {new Date(schedule.arrivalTime).toLocaleString()}</p>
                <button className="auth-button">Book Ticket</button>
              </div>
            ))
          ) : (
            <p>No schedules available for this route.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default BrowseSchedules;
