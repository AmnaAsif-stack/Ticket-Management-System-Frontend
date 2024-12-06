import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import jsPDF from "jspdf";
import './Checkout.css';

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Fetch the booking details from localStorage
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const booking = bookings.find((b) => b.id === bookingId);
    setBookingDetails(booking);
  }, [bookingId]);
  const handleModifyTiming = () => {
    navigate(`/Dashboard`, {
      state: {
        bookingId: bookingId, // Pass the booking ID to the dashboard
      },
    });
  };
  // Handle increasing the number of tickets
  const handleIncreaseTickets = () => {
    if (!bookingDetails) return;
    const updatedBookingDetails = { ...bookingDetails };
    updatedBookingDetails.tickets += 1;

    setBookingDetails(updatedBookingDetails);

    // Update bookings in localStorage
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? updatedBookingDetails : b
    );
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
  };

  // Handle decreasing the number of tickets
  const handleDecreaseTickets = () => {
    if (!bookingDetails) return;
    if (bookingDetails.tickets > 1) {
      const updatedBookingDetails = { ...bookingDetails };
      updatedBookingDetails.tickets -= 1;

      setBookingDetails(updatedBookingDetails);

      // Update bookings in localStorage
      const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
      const updatedBookings = bookings.map((b) =>
        b.id === bookingId ? updatedBookingDetails : b
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    }
  };

  // Generate the ticket PDF
  const generatePDF = () => {
    if (!paymentCompleted) {
      alert("Please complete the payment process first.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ticket Confirmation", 20, 20);
    doc.text("-------------------------------------", 20, 30);
    doc.text(`Booking ID: ${bookingDetails.id}`, 20, 40);
    doc.text(`Route: ${bookingDetails.routeName}`, 20, 50);
    doc.text(`Bus Number: ${bookingDetails.busNumber}`, 20, 60);
    doc.text(`Time: ${bookingDetails.time}`, 20, 70);
    doc.text(`Tickets: ${bookingDetails.tickets}`, 20, 80);
    doc.text(`Total Amount: $${bookingDetails.tickets * 500}`, 20, 90);
    doc.text(`Payment Status: Completed`, 20, 100);
    doc.text("-------------------------------------", 20, 110);
    doc.text("Thank you for booking with us!", 20, 120);

    // Save the PDF with a filename
    doc.save(`${bookingDetails.routeName}_Ticket_${new Date().toISOString()}.pdf`);
  };

  if (!bookingDetails) return <p>Loading...</p>;

  // Calculate total amount based on updated ticket count
  const ticketPrice = 500; // Set your ticket price here
  const totalAmount = ticketPrice * bookingDetails.tickets;

  const handlePayment = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) return;
  
    try {
      // Step 1: Create Payment Intent on the server
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount * 100 }), // Sending amount in cents
      });
      
  
      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('Failed to get clientSecret from the server');
      }
  
      // Step 2: Confirm the Payment using Stripe Elements
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement), // Use the card details from CardElement
        },
      });
  
      if (error) {
        setStripeError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        setPaymentCompleted(true); // Mark payment as completed
        alert('Payment successful!');
      }
    } catch (error) {
      setStripeError(error.message);
    }
  };
  
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Booking Information Section */}
      <div className="section">
        <h3>Booking Information</h3>
        <p>Booking ID: {bookingDetails.id}</p>
        <p>Route: {bookingDetails.routeName}</p>
        <p>Bus: {bookingDetails.busNumber}</p>
        <p>Time: {bookingDetails.time}</p>
        <p>Total Amount: ${totalAmount}</p>
      </div>

      {/* Ticket Controls Section */}
      <div className="section">
        <h3>Ticket Quantity</h3>
        <p>Number of Tickets: {bookingDetails.tickets}</p>
        <div className="ticket-controls">
          <span onClick={handleDecreaseTickets} className="ticket-arrow">
            &#8593; {/* Up arrow */}
          </span>
          <span>{bookingDetails.tickets}</span>
          <span onClick={handleIncreaseTickets} className="ticket-arrow">
            &#8595; {/* Down arrow */}
         
          </span>
          
        </div>
      
      {/* Other checkout details like ticket information, etc. */}
      
      <button onClick={handleModifyTiming}>Modify Timing</button>
      </div>
      
 
      {/* Payment Section */}
      <div className="section">
        <h3>Payment</h3>
        <form onSubmit={handlePayment}>
          <CardElement
            options={{
              style: {
                base: {
                  color: 'black',
                  fontSize: '16px',
                  fontFamily: 'Arial, sans-serif',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  padding: '10px',
                  '::placeholder': {
                    color: 'lightgray',
                  },
                },
                invalid: {
                  color: 'red',
                },
              },
            }}
          />
          <button type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
        </form>
        {stripeError && <p className="stripe-error">{stripeError}</p>}
      </div>

      {/* Modify Bus Timing Section */}
      {paymentCompleted && (
        <div className="section">
          <h3>Ticket Confirmation</h3>
          <button onClick={generatePDF}>Generate Ticket PDF</button>
        </div>
      )}

   
    </div>
  );
};

export default Checkout;
