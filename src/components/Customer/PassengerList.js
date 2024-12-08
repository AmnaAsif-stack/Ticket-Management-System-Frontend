import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PassengerList = () => {
    const [passengers, setPassengers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPassengers = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/passengers',
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                setPassengers(response.data.passengers);
            } catch (error) {
                setMessage('Error fetching passengers');
            }
        };
        fetchPassengers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/passengers/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setPassengers(passengers.filter((passenger) => passenger._id !== id));
        } catch (error) {
            setMessage('Error deleting passenger');
        }
    };

    return (
        <div>
            <h2>Passenger List</h2>
            {message && <p>{message}</p>}
            <ul>
                {passengers.map((passenger) => (
                    <li key={passenger._id}>
                        {passenger.passportNumber} - {passenger.phone} - {passenger.address}
                        <button onClick={() => handleDelete(passenger._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PassengerList;
