import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TravelHistory.css";

const TravelHistory = () => {
  const [travelHistory, setTravelHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch travel history from the backend API
    const fetchTravelHistory = async () => {
      try {
        const response = await axios.get("/api/travel-history", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // assuming the token is stored in localStorage
          },
        });
        setTravelHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching travel history:", error);
        setLoading(false);
      }
    };

    fetchTravelHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="travel-history-container">
      <h2>Travel History</h2>
      {travelHistory.length === 0 ? (
        <p>No travel history available.</p>
      ) : (
        <table className="travel-history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Route</th>
              <th>Schedule</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {travelHistory.map((history, index) => (
              <tr key={index}>
                <td>{history.date}</td>
                <td>{history.route}</td>
                <td>{history.schedule}</td>
                <td>{history.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TravelHistory;
