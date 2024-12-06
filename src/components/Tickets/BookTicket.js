import React from 'react';
import { useParams } from 'react-router-dom';

const TicketBooking = () => {
  const { bookingId } = useParams();
  // Fetch booking details from localStorage using the bookingId
  const booking = JSON.parse(localStorage.getItem("bookings")).find(
    (b) => b.id === bookingId
  );

  return (
    <div>
      <h2>Booking Confirmation</h2>
      <p>Route: {booking.routeName}</p>
      <p>Bus: {booking.busNumber}</p>
      <p>Time: {booking.time}</p>
      <p>Total Tickets: {booking.tickets}</p>
      <p>Total Price: {booking.amount}</p>
      {/* You can add more details like user payment methods here */}
      <button>Proceed to Payment</button>
    </div>
  );
};

export default TicketBooking;
