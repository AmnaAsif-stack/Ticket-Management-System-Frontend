import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";  // Import Link for navigation
import { TicketBooking } from '../Tickets/BookTicket';  // named import
import axios from "axios";

import RoutesList from '../Customer/RouteList';

const Dashboard = () => {
  const [showRoutes, setShowRoutes] = useState(false);
  const [routes, setRoutes] = useState([]); // Replace this with your actual routes data from the database
  const [routeSelected, setRouteSelected] = useState(null); // Track selected route
  const [expandedBus, setExpandedBus] = useState(null); // Track expanded bus schedule
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const ticketPrice = 100; // Example ticket price (this could be dynamic)
  const [filter, setFilter] = useState("");
  const [newTime, setNewTime] = useState("");
  const [bookings, setBookings] = useState(
    JSON.parse(localStorage.getItem("bookings")) || []
  );
  const [schedule, setSchedule] = useState([]); // Track the fetched schedule for the selected route
  const [error, setError] = useState([]); // Track the fetched schedule for the selected route

  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showTravelHistory, setShowTravelHistory] = useState(false); // Add this line

  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState({
    name: "",
    email: ""
  });


  // Fetch routes from the backend
 // Fetch routes from the backend
 useEffect(() => {
  fetchRoutes();
}, []);

const fetchRoutes = () => {
  console.log("Fetching routes..."); // Check if this is logged
  fetch("http://localhost:5000/api/routes")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched Routes Data:", data); // Should appear if data is fetched
      setRoutes(data);
    })
    .catch((error) => {
      console.error("Error fetching routes:", error);
    });
};


const filterRoutes = routes.filter((route) =>
  route.name && route.name.toLowerCase().includes(filter.toLowerCase())  // Safe check for 'name'
);


  
  const handleShowTravelHistory = () => {
    setShowTravelHistory(!showTravelHistory);
  };
  
  const handleShowMyBookings = () => {
    setShowMyBookings(!showMyBookings);
  };

  const routesData = [
    {
      id: "route1",
      name: "Route 1: Downtown to Uptown",
      buses: [
        { busId: "B101-1", schedule: ["9:00 AM", "9:30 AM", "10:00 AM"] },
        { busId: "B101-2", schedule: ["10:30 AM", "11:00 AM", "11:30 AM"] },
      ],
    },
    {
      id: "route2",
      name: "Route 2: Central Park to Midtown",
      buses: [
        { busId: "B102-1", schedule: ["8:00 AM", "9:00 AM", "10:00 AM"] },
        { busId: "B102-2", schedule: ["11:00 AM", "12:00 PM", "1:00 PM"] },
      ],
    },
  ];

  const [showTicketInfoDropdown, setShowTicketInfoDropdown] = useState(false);
  // Handle route selection
  const handleSelectRoute = (route) => {
    console.log("Selected route:", route);  // Ensure the route object is correct
    setRouteSelected(route);  // Set the selected route object
    setExpandedBus(null);
    setSchedule([]);  // Clear existing schedule
    setError("");  // Reset error message
  
    // Fetch schedules for the selected route
    const fetchSchedules = async (routeId) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bus-schedules/${routeId}`);
        console.log("Fetched schedules:", response.data);
        setSchedule(response.data);  // Set the fetched schedule
      } catch (err) {
        console.error("Error fetching schedules:", err.response?.data || err.message);
        setSchedule([]);  // Clear schedule on error
        setError("Failed to load schedules. Please try again.");
      }
    };
  
    fetchSchedules(route.id);  // Pass route.id to the function
  };
  
  
    
  
const handleRouteSelection = (route) => {
  console.log(route);  // Log the selected route to debug
  setRouteSelected(route);
};

  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    if (location.state?.bookingId) {
      const bookingId = location.state.bookingId;
      const foundBooking = bookings.find((booking) => booking.id === bookingId);
      if (foundBooking) {
        setSelectedBooking(foundBooking);
        setRouteSelected({
          name: foundBooking.routeName,
          buses: routesData.find((route) => route.name === foundBooking.routeName)
            .buses,
        });
        setSelectedTime(foundBooking.time);
      }
    }
  }, [location, bookings]);
  const handleShowRoutesClick = () => {
    setShowRoutes(!showRoutes);
  };
  const handleTicketBooking = (event) => {
    event.preventDefault();
  
    if (!routeSelected || !expandedBus || !selectedTime || !selectedDate) {
      alert("Please complete all fields before booking.");
      return;
    }
  
    const totalAmount = ticketPrice * numberOfTickets;
  
    const newBooking = {
      id: new Date().toISOString(),
      routeName: routeSelected.name,
      busNumber: expandedBus,
      time: selectedTime,
      date: selectedDate, // Ensure date is stored
      tickets: numberOfTickets,
      amount: totalAmount,
      paid: false,
    };
    
  
    const updatedBookings = [...bookings, newBooking];
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  
    alert("Booking successful! Proceed to checkout to complete payment.");
    navigate(`/checkout/${newBooking.id}`);
  };
  
  const handleSaveModifiedTime = () => {
    if (!selectedBooking || !newTime) return;

    const updatedBooking = { ...selectedBooking, time: newTime };

    const updatedBookings = bookings.map((b) =>
      b.id === selectedBooking.id ? updatedBooking : b
    );
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    alert("Bus schedule updated successfully!");
    navigate(`/checkout/${selectedBooking.id}`);
  };

  const handleBookOnly = () => {
    setShowTicketInfoDropdown(true); // Ensure dropdown is shown only on "Book Only"
  };
  const handleCancelBooking = (bookingId) => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.id === bookingId) {
        // Mark as canceled and refunded
        return { ...booking, canceled: true, refundStatus: "Refunded" };
      }
      return booking;
    });
  
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  
    alert("Your booking has been canceled. Refund will be processed.");
  };
    const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);

    doc.text(`Ticket Confirmation`, 20, 20);
    doc.text(`-------------------------------------`, 20, 30);
    doc.text(`Name: ${profile.name}`, 20, 40);
    doc.text(`Email: ${profile.email}`, 20, 50);
    doc.text(`Location: ${profile.location}`, 20, 60);
    doc.text(`Route: ${routeSelected.name}`, 20, 70);
    doc.text(`Bus Number: ${expandedBus}`, 20, 80);
    doc.text(`Date: ${selectedDate}`, 20, 85); // Add date

    doc.text(`Departure Time: ${selectedTime}`, 20, 90);
    doc.text(`Number of Tickets: ${numberOfTickets}`, 20, 100);
    doc.text(`Total Amount: $${ticketPrice * numberOfTickets}`, 20, 110);

    doc.text(`Payment Status: Pending`, 20, 120);  // Added line for payment status

    doc.text(`-------------------------------------`, 20, 130);
    doc.text(`Thank you for booking with us!`, 20, 140);
  
    // Save the PDF with a filename based on the user's name and booking time
    doc.save(`${profile.name}_Ticket_${new Date().toISOString()}.pdf`);
  };
  const filterRecentBookings = (bookings) => {
    const today = new Date();
    const currentMonth = today.getMonth(); // Current month (0-11)
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January case
    const currentYear = today.getFullYear();
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      const bookingMonth = bookingDate.getMonth();
      const bookingYear = bookingDate.getFullYear();
  
      return (
        (bookingYear === currentYear && bookingMonth === currentMonth) || // Current month
        (bookingYear === lastMonthYear && bookingMonth === lastMonth) // Last month
      );
    });
  };
    // Fetch user profile on component mount
    useEffect(() => {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`, // Assuming you're using JWT tokens
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const userData = await response.json();
          setProfile(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // You can handle error here by redirecting to login page or showing a message
        }
      };
  
      fetchUserProfile();
    }, []);
    const handleManageProfile = () => {
      navigate("/passenger-management");
    };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Explore routes, schedules, and book your tickets here.</p>
      </header>

      <div>
           
            <RoutesList />
        </div>

      
      <div className="user-profile">
      <h2>Welcome, {profile.name || "User"}</h2>
      <p>Email: {profile.email || "Not available"}</p>
      <button onClick={handleManageProfile}>Manage Profile</button>
      
      <button onClick={handleShowTravelHistory}>
        {handleShowTravelHistory ? "Show Travel History" : "Hide Travel History"}
      </button>
    </div>
     
     
      {showTravelHistory && (
        <div className="travel-history">
          <h3>Your Travel History</h3>
          {filterRecentBookings(bookings).length === 0 ? (
            <p>You have no travel history from the last or current month.</p>
          ) : (
            <ul>
              {filterRecentBookings(bookings).map((booking) => (
                <li key={booking.id}>
                  <p>Route: {booking.routeName}</p>
                  <p>Bus Number: {booking.busNumber}</p>
                  <p>Date: {booking.date}</p>
                  <p>Time: {booking.time}</p>
                  <p>Status: {booking.canceled ? "Canceled" : "Active"}</p>
                  {booking.canceled && <p>Refund Status: {booking.refundStatus}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

<div className="dashboard-actions">
        <button onClick={handleShowMyBookings}>
          {showMyBookings ? "Hide My Bookings" : "Show My Bookings"}
        </button>
        {/* Add Travel History button */}
        <button onClick={handleShowTravelHistory}>
          {showTravelHistory ? "Hide Travel History" : "Show Travel History"}
        </button>
      </div>

      {showMyBookings && (
  <div className="my-bookings-section">
    <h3>My Bookings</h3>
    {filterRecentBookings(bookings).length === 0 ? (
      <p>You have no bookings from the last or current month.</p>
    ) : (
      <ul>
        {filterRecentBookings(bookings).map((booking) => (
          <li key={booking.id} className={`booking-item ${booking.canceled ? "canceled" : ""}`}>
            <p>Route: {booking.routeName}</p>
            <p>Bus Number: {booking.busNumber}</p>
            <p>Date: {booking.date}</p>
            <p>Time: {booking.time}</p>
            <p>Tickets: {booking.tickets}</p>
            <p>Total Amount: ${booking.amount}</p>
            <p>Status: {booking.canceled ? "Canceled" : "Active"}</p>
            {booking.canceled && <p>Refund Status: {booking.refundStatus}</p>}
            {!booking.canceled && (
              <button onClick={() => handleCancelBooking(booking.id)}>
                Cancel Booking
              </button>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
)}


 {/* Show Travel History Section */}

 <div className="show-routes-button">
      {/* Toggle Button to Show/Hide Routes */}
      <button onClick={handleShowRoutesClick}>
        {showRoutes ? 'Hide Routes' : 'Show Routes'}
      </button>

      {/* Conditionally render routes */}
      {showRoutes && routes.length > 0 ? (
        <div className="routes-container">
          {routes.map((route) => (
            <div key={route._id} className="route-card">
              <h3>{route.start} to {route.end}</h3>
              <p><strong>Distance:</strong> {route.distance} km</p>
              <p><strong>Stops:</strong> {route.stops.join(', ')}</p>
              <button
                className="select-route-button"
                onClick={() => handleSelectRoute(route)}
              >
                Select Route
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>{showRoutes ? 'No routes available' : ''}</p>
      )}

{routeSelected && (
  <div className="route-schedule">
    <h3>Bus Schedule for {routeSelected.start} to {routeSelected.end}</h3>
    {console.log("Schedule state:", schedule)}  {/* Log the schedule state */}
    {console.log("Route Selected:", routeSelected)}  {/* Log the selected route */}
    {error ? (
      <p>{error}</p>
    ) : schedule.length ? (
      schedule.map((bus) => (
        <div key={bus._id}>
          <p><strong>Bus ID:</strong> {bus._id}</p>
          <p><strong>Departure Time:</strong> {new Date(bus.departureTime).toLocaleString()}</p>
          <p><strong>Arrival Time:</strong> {new Date(bus.arrivalTime).toLocaleString()}</p>
          <p><strong>Status:</strong> {bus.status}</p>
        </div>
      ))
    ) : (
      <p>Loading schedule...</p>
    )}
  </div>
)}

    </div>
  
    

      {selectedBooking && (
        <div className="modify-bus-timing">
          <h3>Modify Bus Timing for Your Booking</h3>
          <p>
            You currently have a booking for {selectedBooking.routeName} at{" "}
            {selectedBooking.time}.
          </p>
          <label>Select New Time: </label>
          <select
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          >
            <option value="">Select a new time</option>
            {routeSelected.buses
              .find((bus) => bus.busId === selectedBooking.busNumber)
              .schedule.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
          </select>
          <button type="button" onClick={handleSaveModifiedTime}>
            Save New Time
          </button>
        </div>
      )}

{showTicketInfoDropdown && (
  <div className="ticket-info-dropdown">
    <h3>Booking Summary</h3>
    <p>Route: {routeSelected.name}</p>
    <p>Bus Number: {expandedBus}</p>
    <p>Date: {selectedDate}</p> {/* Display selected date */}
    <p>Time: {selectedTime}</p>
    <p>Tickets: {numberOfTickets}</p>
    <p>Total Price: ${ticketPrice * numberOfTickets}</p>
    <button onClick={generatePDF}>Confirm Booking</button>
  </div>
)}

    </div>

    
  );
  
};
const BrowseRoutes = ({ routes, filter, setFilter, onSelectRoute }) => (
  <div className="route-list">
    <input
      type="text"
      placeholder="Search routes"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
    <ul>
      {routes.length === 0 ? (
        <p>Loading routes...</p>
      ) : (
        routes.map((route) => (
          <li key={route._id}>
            <button onClick={() => onSelectRoute(route)}>{route.name}</button>
          </li>
        ))
      )}
    </ul>
  </div>
);

const UserProfile = ({ profile, handleShowTravelHistory }) => {
  const navigate = useNavigate();

  return (
    <div className="user-profile">
      <h2>Welcome, {profile.name || "User"}</h2>
      <p>Email: {profile.email || "Not available"}</p>
      <p>Location: {profile.location || "Not available"}</p>
      <button onClick={() => navigate("/passenger-management")}>
        Manage Profile
      </button>
      <button onClick={handleShowTravelHistory}>
        Toggle Travel History
      </button>
    </div>
  );
};

const RouteList = ({ routes, filter, setFilter, onSelectRoute }) => (
  <div className="route-list">
    <input
      type="text"
      placeholder="Search routes"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
    />
    <ul>
      {routes.map((route) => (
        <li key={route._id}>
          <button onClick={() => onSelectRoute(route)}>{route.name}</button>
        </li>
      ))}
    </ul>
  </div>
);
export default Dashboard;
