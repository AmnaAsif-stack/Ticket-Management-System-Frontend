import React, { useState, useEffect } from "react";
import axios from "axios";

const BrowseRoutes = () => {
  const [filter, setFilter] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
      fetch('http://localhost:5000/api/routes')  // Make sure this endpoint is correct
        .then(response => response.json())
        .then(data => {
          console.log("Fetched Routes Data:", data);  // Add this line to see the response in the console
          setRoutes(data);  // Store routes in the state
        })
        .catch(error => console.error('Error fetching routes:', error));
    }, []);
    

  const filteredRoutes = routes.filter((route) => {
    const searchTerm = filter.toLowerCase();
    return (
      (route.start && route.start.toLowerCase().includes(searchTerm)) ||
      (route.end && route.end.toLowerCase().includes(searchTerm)) ||
      (route.stops && route.stops.some((stop) => stop.toLowerCase().includes(searchTerm)))
    );
  });
  

  if (loading) return <p>Loading routes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container bus-routes">
      <h2>Browse Bus Routes</h2>
      <input
        type="text"
        placeholder="Filter by City or Stop"
        className="filter-input"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="routes-list">
        {filteredRoutes.length > 0 ? (
          filteredRoutes.map((route) => (
            <div key={route._id} className="route-card">
              <h3>{route.start} to {route.end}</h3>
              <p>Stops: {route.stops.join(", ")}</p>
              <p>Distance: {route.distance} km</p>
              <p>Estimated Duration: {route.estimatedDuration}</p>
              <button className="auth-button">View Schedule</button>
            </div>
          ))
        ) : (
          <p>No routes match your search.</p>
        )}
      </div>
    </div>
  );
};

export default BrowseRoutes;
