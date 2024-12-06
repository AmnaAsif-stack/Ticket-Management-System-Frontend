// src/components/RoutesList.js

import React, { useState, useEffect } from 'react';
import { fetchRoutes } from '../../api';
import RouteDetails from './RouteDetails';

const RoutesList = () => {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);

    useEffect(() => {
        const getRoutes = async () => {
            const data = await fetchRoutes();
            setRoutes(data);
        };

        getRoutes();
    }, []);

    const handleRouteClick = (routeId) => {
        setSelectedRoute(routeId);
    };

    return (
        <div>
            <h2>Available Routes</h2>
            <ul>
                {routes.map((route) => (
                    <li key={route._id} onClick={() => handleRouteClick(route._id)}>
                        {route.start} to {route.end}
                    </li>
                ))}
            </ul>

            {selectedRoute && <RouteDetails routeId={selectedRoute} />}
        </div>
    );
};

export default RoutesList;
