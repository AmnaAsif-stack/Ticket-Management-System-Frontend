// src/components/RouteDetails.js
import React, { useState, useEffect } from 'react';

const RouteDetails = ({ routeId }) => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/bus-schedules/${routeId}`);
                const data = await response.json();
                console.log("Fetched schedules:", data);
                setSchedules(data);
            } catch (error) {
                console.error('Error fetching schedules:', error);
            }
        };

        fetchSchedules();
    }, [routeId]);

    const formatDate = (date) => {
        return date ? new Date(date).toLocaleString() : 'Not available';
    };

    return (
        <div>
            {schedules.length > 0 ? (
                schedules.map(schedule => {
                    const { route, bus, departureTime, arrivalTime, status } = schedule;

                    return (
                        <div key={schedule._id}>
                            <h3>{route ? route.start : 'N/A'} to {route ? route.end : 'N/A'}</h3>
                            <p>Bus: {bus ? bus.licensePlate : 'N/A'}</p>
                            <p>Departure: {formatDate(departureTime)}</p>
                            <p>Arrival: {formatDate(arrivalTime)}</p>
                            <p>Status: {status || 'Not available'}</p>
                        </div>
                    );
                })
            ) : (
                <p>No schedules available for this route.</p>
            )}
        </div>
    );
};

export default RouteDetails;
