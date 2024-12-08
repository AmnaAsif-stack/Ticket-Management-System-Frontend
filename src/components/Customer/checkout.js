import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import jsPDF from "jspdf";
const stripePromise = loadStripe("pk_test_51QQtJrGVhVkfmBm60vWAByASAlcmgS34BftiIulgxMBXDova0N7F2Kse4SoXZAhWyRnxtcNT0Rxw35t9AczGPOpU00SXlRTdvK"); // Replace with your Stripe public key

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingInfo, setBookingInfo] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (location.state && location.state.bookingId) {
      const fetchBookingDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/bookings/${location.state.bookingId}`
          );
          setBookingInfo(response.data);
          console.log("Total Fare:", response.data.totalFare); // Check if it's above the minimum

          const amountInCents = response.data.totalFare * 100;

          if (amountInCents < 50) {
            alert("Amount must be at least 50 cents");
            return;
          }

        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      };
      fetchBookingDetails();
    }
  }, [location.state]);
  const handlePayment = async (event) => {
    event.preventDefault();
  
    // Show alert that the payment process has started
    alert("Payment Successful!");
  
    if (!stripe || !elements) {
      alert("Stripe is not initialized");
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    if (!cardElement) {
      alert("CardElement is not available.");
      return;
    }
  
    try {
      // Create payment method from card element
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement, // Using the card element instance directly
      });
  
      if (error) {
        alert("Error creating payment method: " + error.message);
        setPaymentStatus("failed");
        return;
      }
  
      // Send the payment method and bookingId to the backend to create a payment intent
      const paymentResponse = await axios.post(
        "http://localhost:5000/create-payment-intent",
        {
          paymentMethodId: paymentMethod.id,
          bookingId: bookingInfo._id, // Send the bookingId along with paymentMethodId
        }
      );
  
      if (paymentResponse.data.clientSecret) {
        // Confirm the payment intent
        const confirmResult = await stripe.confirmCardPayment(paymentResponse.data.clientSecret);
  
        if (confirmResult.error) {
          alert("Payment failed: " + confirmResult.error.message);
          setPaymentStatus("failed");
        } else if (confirmResult.paymentIntent.status === "succeeded") {
          setPaymentStatus("success");
          alert("Payment Successful! Your booking is confirmed.");
          await axios.put(
            `http://localhost:5000/api/bookings/${bookingInfo._id}/update-payment-status`,
            { paymentStatus: "completed" }
          );
          navigate("/payment-success");
        }
      }
    } catch (error) {
      alert("Payment process error: " + error.message);
      setPaymentStatus("failed");
    }
  };
  
    // Generate PDF with current booking information
    const handleGeneratePDF = () => {
      if (!bookingInfo) return;
  
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Booking Details", 10, 10);
      doc.text(`Booking ID: ${bookingInfo._id}`, 10, 20);
      doc.text(`Passenger Name: ${bookingInfo.customerName}`, 10, 30);
      doc.text(`Route: ${bookingInfo.route.start} to ${bookingInfo.route.end}`, 10, 40);
      doc.text(`Seats Booked: ${bookingInfo.seatsBooked}`, 10, 50);
      doc.text(`Total Fare: ₹${bookingInfo.totalFare}`, 10, 60);
      doc.text(`Payment Status: ${bookingInfo.paymentStatus}`, 10, 70); 
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
      doc.save(`booking-${bookingInfo._id}.pdf`);
    };
  
  if (!bookingInfo) {
    return <div>Loading booking details...</div>;
  }// Always call useEffect unconditionally

// Generate PDF only if bookingInfo is available
 
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="booking-details">
        <h3>Booking Information</h3>
        <p><strong>Booking ID:</strong> {bookingInfo._id}</p>
        <p><strong>Passenger Name:</strong> {bookingInfo.customerName}</p>
        <p><strong>Route:</strong> {bookingInfo.route.start} to {bookingInfo.route.end}</p>
        <p><strong>Seats Booked:</strong> {bookingInfo.seatsBooked}</p>
        <p><strong>Total Fare:</strong> ₹{bookingInfo.totalFare}</p>
        <p><strong>Departure Time:</strong> {new Date(bookingInfo.schedule.departureTime).toLocaleTimeString()}</p>
        <p><strong>Arrival Time:</strong> {new Date(bookingInfo.schedule.arrivalTime).toLocaleString()}</p>
      </div>

      <div className="payment-section">
        <h3>Payment</h3>
        <p>Total Amount: ₹{bookingInfo.totalFare}</p>

        {paymentStatus === "success" ? (
          <div className="payment-success">
            <p>Payment Successful! Your booking is confirmed.</p>
            <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
          </div>
        ) : (
          <>
            <form onSubmit={handlePayment}>
              <div className="card-element">
                <CardElement />
              </div>

              <button type="submit">Pay Now</button>

              </form>
          </>
        )}

        {paymentStatus === "failed" && (
          <div className="payment-failed">
            <p>Payment failed. Please try again.</p>
          </div>
        )}
         {paymentStatus === "succeeded" && (
          <div className="payment-failed">
            <p>Payment succeeded</p>
          </div>
        )}
        
      </div>
      <button onClick={handleGeneratePDF} className="generate-pdf-btn">
            Generate PDF
          </button>
    </div>
  );
};

export default Checkout;
