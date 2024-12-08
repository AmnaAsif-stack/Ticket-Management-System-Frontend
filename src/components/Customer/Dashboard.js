import React, { useState, useEffect,useHistory } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import Checkout from "./checkout";

const Dashboard = () => {
  const [routes, setRoutes] = useState([]);
  const [routeSelected, setRouteSelected] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);  // Filtered routes state
  const [passengerList, setPassengerList] = useState([]);
  const [newPassengerName, setNewPassengerName] = useState("");
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [editPassengerName, setEditPassengerName] = useState("");
  const [userId, setUserId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [routeSearch, setRouteSearch] = useState(""); // State for search input

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();  // Correct for React Router v6
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [selectedScheduleDetails, setSelectedScheduleDetails] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
const [bookingInfo,setBookingInfo]=useState("");
  // New state for passenger info and fare
  const [passengerName, setPassengerName] = useState("");
  const [numSeats, setNumSeats] = useState(1);
  const [totalFare, setTotalFare] = useState(0);
  const handleBooking = () => {
    // Passing state to the checkout page
    navigate('/checkout', {
      state: {
        route: selectedRoute,
        schedule: selectedSchedule,
        booking: selectedBooking,
      },
    });
  };


  
  const fetchPassengers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/passengers");
      setPassengerList(response.data);
    } catch (error) {
      console.error("Error fetching passengers:", error);
    }
  };
  
  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await response.json();
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch routes
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routes");
        setRoutes(response.data);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, []);

  // Fetch schedule for selected route
  const handleRouteSelection = async (route) => {
    setRouteSelected(route);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/bus-schedules/${route._id}`
      );
      const schedules = response.data;
      setSchedule(schedules);

      // Extract available dates from schedules
      const dates = Array.from(
        new Set(schedules.map((busSchedule) => new Date(busSchedule.departureTime).toLocaleDateString()))
      );
      setAvailableDates(dates);

      // Reset selection and filtered schedule
      setSelectedDate("");
      setSelectedTime("");
      setFilteredSchedule([]);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      setSchedule([]);
    }
  };
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setRouteSearch(searchTerm);
    
    const filtered = routes.filter((route) => {
      const start = route.start ? route.start.toLowerCase() : '';
      const end = route.end ? route.end.toLowerCase() : '';
      const name = route.name ? route.name.toLowerCase() : '';
  
      return (
        start.includes(searchTerm) ||
        end.includes(searchTerm) ||
        name.includes(searchTerm)
      );
    });
    setFilteredRoutes(filtered); // Update filtered routes
  };
  
  // Handle date selection and filter schedule by date
  const handleDateSelection = (date) => {
    setSelectedDate(date);

    // Filter schedules by selected date
    const filteredByDate = schedule.filter(
      (busSchedule) =>
        new Date(busSchedule.departureTime).toLocaleDateString() === date
    );
    setFilteredSchedule(filteredByDate);
    setSelectedTime(""); // Reset time selection
    fetchFareFromDB(routeSelected._id);
    // Check for fare related to selected route and date
  };


 
  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  
    // Parse the time string as a Date object for comparison
    const selectedTimeObj = new Date(time);
  
    const selectedSchedule = filteredSchedule.find(
      (item) =>
        new Date(item.departureTime).getTime() === selectedTimeObj.getTime() // Compare timestamps
    );
  
    if (selectedSchedule) {
      setSelectedScheduleDetails(selectedSchedule);
    } else {
      setSelectedScheduleDetails(null); // Handle undefined case
    }
  };
  
  // Fetch fare for the selected route and date
 // Fetch fare dynamically from the fare schema
 const fetchFareFromDB = async (routeId) => {
  console.log("Fetching fare for routeId:", routeId);
  try {
    const response = await axios.get("http://localhost:5000/api/fare", {
      params: { routeId },
    });

    if (response.data && response.data.fare) {
      const baseFare = response.data.fare.baseFare || 0; 
      setTotalFare(baseFare); // Save base fare directly
    } else {
      alert("No fare information found for this route.");
      setTotalFare(0);
    }
  } catch (error) {
    console.error("Error fetching fare data:", error);
    alert("Failed to fetch fare.");
  }
};



  // Handle ticket booking
  const handleBookTicket = async () => {
    if (!routeSelected || !routeSelected._id) {
      alert("Route not selected or invalid.");
      return;
    }

    if (!filteredSchedule.length || !filteredSchedule[0]._id) {
      alert("Schedule not selected or invalid.");
      return;
    }

    if (!passengerName || numSeats <= 0) {
      alert("Please provide valid passenger information and number of seats.");
      return;
    }

    const bookingData = {
      customerName: passengerName,
      customerEmail: profile.email,
      route: routeSelected._id,
      schedule: filteredSchedule[0]._id,      seatsBooked: numSeats,
      totalFare: totalFare * numSeats,
      paymentStatus: "pending", // Default status
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        const bookingDetails = response.data;
        setBookingInfo(bookingDetails);
        navigate("/checkout", { state: { bookingId: response.data.booking._id } });

        alert("Ticket booked successfully!");
      } else {
        alert("Failed to book ticket. Please try again.");
      }
    } catch (error) {
      console.error("Error booking ticket:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to book ticket. Please try again.");
    }
  };



useEffect(() => {
  console.log(bookingInfo); // Log the booking info for debugging

}, [bookingInfo, navigate]);
const handleGeneratePDF = () => {
  if (!bookingInfo) return;

  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.text("Booking Details", 10, 10);
  doc.text(`Booking ID: ${bookingInfo.bookingId}`, 10, 20);
  doc.text(`Passenger Name: ${bookingInfo.passengerName}`, 10, 30);
  doc.text(`Route: ${bookingInfo.route}`, 10, 40);
  doc.text(`Seats Booked: ${bookingInfo.seatsBooked}`, 10, 50);
  doc.text(`Total Fare: ₹${bookingInfo.totalFare}`, 10, 60);
  doc.text(`Payment Status: ${bookingInfo.paymentStatus}`, 10, 70); // Payment Status
  doc.text(
    `Departure Time: ${new Date(bookingInfo.schedule.departureTime).toLocaleString()}`,
    10,
    80
  );
  doc.text(
    `Arrival Time: ${new Date(bookingInfo.schedule.arrivalTime).toLocaleString()}`,
    10,
    90
  );

  doc.save(`booking-${bookingInfo.bookingId}.pdf`);
};
const handleCheckoutClick = () => {
  navigate('/checkout');
};


  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Explore routes, schedules, and book your tickets here.</p>
      </header>

      <div className="user-profile">
        <h2>Welcome, {profile.name || "User"}</h2>
        <p>Email: {profile.email || "Not available"}</p>
     
<button onClick={() => navigate("/passenger-management")}>Manage Profile</button>

      </div>
     
      <div>
    {/* Search Bar */}
    <input
  type="text"
  value={routeSearch}
  onChange={handleSearchChange}
  placeholder="Search for a route"
  className="search-bar"
  
/>




      </div>
      <button onClick={() => setShowRoutes(!showRoutes)} className="show-routes-btn">
        {showRoutes ? "Hide Routes" : "Show Routes"}
      </button>

      {showRoutes && (
        <div className="routes-section">
          <h3>Available Routes</h3>
          <div className="routes-grid-container">
            <div className="routes-grid">
            {filteredRoutes.length > 0 ? (
  filteredRoutes.map((route) => (
    <div key={route._id} className="route-card">
      <h4>{route.start} to {route.end}</h4>
      <p><strong>Distance:</strong> {route.distance} km</p>
      <p><strong>Stops:</strong> {route.stops} </p>
      <p><strong>Duration:</strong> {route.estimatedDuration} Hours</p>
      <p><strong>Status:</strong> {route.status || "Available"}</p>
      <button
        className="select-route-btn"
        onClick={() => handleRouteSelection(route)}
      >
        Select Route
      </button>
    </div>
  ))
) : (
  <p>No routes available.</p>
)}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Form Section */}
      {routeSelected && (
        <div className="schedule-section">
          <div className="schedule-container">
          <h3>Schedules for {routeSelected.start} to {routeSelected.end}</h3>

            {/* Date Selection Dropdown */}
            {schedule.length > 0 && (
              <div className="select-date">
                <h4>Select Date</h4>
                <select onChange={(e) => handleDateSelection(e.target.value)}>
              <option value="">Select Date</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
            )}

{selectedDate && filteredSchedule.length > 0 && (
              <div className="select-time">
                <h4>Select Time</h4>
                <select
                  value={selectedTime}
                  onChange={(e) => handleTimeSelection(e.target.value)}
                >
                  <option value="">Select a time</option>
                  {filteredSchedule.map((busSchedule, index) => (
                    <option
                      key={index}
                      value={new Date(busSchedule.departureTime).toLocaleString()}
                    >
                      {new Date(busSchedule.departureTime).toLocaleTimeString(
                        "en-US",
                        {
                          timeZone: "UTC",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </option>
                  ))}
                </select>
              </div>
            )}

{selectedScheduleDetails && (
  <div className="passenger-info">
    <h4>Selected Schedule Details</h4>
    <p><strong>Bus Number:</strong> {selectedScheduleDetails.bus?.licensePlate || "N/A"}</p>
    <p><strong>Departure Time:</strong> {selectedScheduleDetails.departureTime ? new Date(selectedScheduleDetails.departureTime).toLocaleString() : "N/A"}</p>
    <p><strong>Arrival Time:</strong> {new Date(selectedScheduleDetails.arrivalTime).toLocaleString()}</p>
    <p><strong>Seats Available:</strong> {selectedScheduleDetails.availableSeats}</p>
    {/* More fields */}
 

          <h4>Passenger Information</h4>
          <label>
            Name:
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Number of Seats:
            <input
              type="number"
              value={numSeats}
              onChange={(e) => setNumSeats(Number(e.target.value))}
              min="1"
              max={selectedScheduleDetails.availableSeats}
            />
          </label>

          <p><strong>Total Fare:</strong> ₹{totalFare * numSeats}</p>

          <button
       onClick={handleBookTicket}
            className="book-ticket-btn"
            disabled={numSeats > selectedScheduleDetails.availableSeats}
          >
            Book Ticket
          </button>
        </div>
      )}
      {bookingInfo && (
        <div className="booking-details">
          <h4>Booking Successful!</h4>
          <p><strong>Booking ID:</strong> {bookingInfo.bookingId}</p>
          <p><strong>Passenger Name:</strong> {bookingInfo.passengerName}</p>
          <p><strong>Route:</strong> {bookingInfo.route}</p>
          <p><strong>Seats Booked:</strong> {bookingInfo.seatsBooked}</p>
          <p><strong>Total Fare:</strong> Rs{bookingInfo.totalFare}</p>
          <p><strong>Payment Status:</strong> {bookingInfo.paymentStatus}</p> {/* Payment Status */}
          <p>
  {new Date(bookingInfo.schedule.departureTime).toLocaleDateString("en-US", {
    timeZone: "UTC", // Ensures the time is shown in UTC
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  })}
</p>
<p>
  <strong>Arrival Time:</strong>{" "}
  {new Date(bookingInfo.schedule.arrivalTime).toLocaleDateString("en-US", {
    timeZone: "UTC", // Ensures the time is shown in UTC
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  })}
</p>

          <button onClick={handleGeneratePDF} className="generate-pdf-btn">
            Generate PDF
          </button>
        </div>
      )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;