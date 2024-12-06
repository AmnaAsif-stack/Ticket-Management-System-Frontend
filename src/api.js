// src/api.js

export const fetchRoutes = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/routes');
        if (!response.ok) {
            throw new Error('Error fetching routes');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchBusSchedules = async (routeId) => {
    try {
        const response = await fetch(`http://localhost:5000/api/bus-schedules/${routeId}`);
        if (!response.ok) {
            throw new Error('Error fetching bus schedules');
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};
