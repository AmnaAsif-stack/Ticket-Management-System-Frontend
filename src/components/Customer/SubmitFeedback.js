import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SubmitFeedback.css"; // Import the CSS for custom styling

const SubmitFeedback = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userFeedbacks, setUserFeedbacks] = useState([]); // User's feedbacks
  const [otherFeedbacks, setOtherFeedbacks] = useState([]); // Other people's feedbacks
  const [loading, setLoading] = useState(false);
  const [viewUserFeedbacks, setViewUserFeedbacks] = useState(true); // State to toggle between feedback views

  useEffect(() => {
    // Fetch user email from backend
    const fetchUserEmail = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    // Fetch feedbacks submitted by the logged-in user
    const fetchUserFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/feedback/view/${email}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setUserFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching user's feedbacks:", error);
      }
    };

    // Fetch all feedbacks from other users
    const fetchOtherFeedbacks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/feedback/view-all", // Adjust endpoint as needed
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setOtherFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching other feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchUserFeedbacks(); // Fetch user's feedbacks after email is set
      fetchOtherFeedbacks(); // Fetch other people's feedbacks
    }
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/feedback/submit",
        { customerEmail: email, message },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setMessage("");
      setUserFeedbacks([...userFeedbacks, response.data]);
    } catch (error) {
      setStatusMessage("Failed to submit feedback.");
    }
  };
  const handleDeleteFeedback = async (feedbackId) => {
    try {
        await axios.delete(`http://localhost:5000/api/feedback/delete/${feedbackId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Remove the deleted feedback from the local state
        setUserFeedbacks(userFeedbacks.filter(feedback => feedback._id !== feedbackId));
        setOtherFeedbacks(otherFeedbacks.filter(feedback => feedback._id !== feedbackId));

        setStatusMessage("Feedback deleted successfully.");
    } catch (error) {
        setStatusMessage("Failed to delete feedback.");
        console.error("Error deleting feedback:", error);
    }
};

const handleUpdate = async (feedbackId, newMessage) => {
  try {
      const response = await axios.put(
          `http://localhost:5000/api/feedback/update/${feedbackId}`,
          { message: newMessage },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // Update the feedback locally after the update
      const updatedFeedbacks = userFeedbacks.map(feedback =>
          feedback._id === feedbackId ? { ...feedback, message: newMessage } : feedback
      );

      setUserFeedbacks(updatedFeedbacks);

      setStatusMessage("Feedback updated successfully.");
  } catch (error) {
      setStatusMessage("Failed to update feedback.");
      console.error("Error updating feedback:", error);
  }
};


  return (
    <div className="feedback-container">
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            disabled
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="textarea-field"
          />
        </div>
        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {/* Buttons to Toggle Views */}
      <div className="view-toggle-btns">
        <button 
          onClick={() => setViewUserFeedbacks(true)} 
          className={`toggle-btn ${viewUserFeedbacks ? "active" : ""}`}
        >
          View Your Feedbacks
        </button>
        <button 
          onClick={() => setViewUserFeedbacks(false)} 
          className={`toggle-btn ${!viewUserFeedbacks ? "active" : ""}`}
        >
          View All Feedbacks
        </button>
      </div>

      {/* User's Feedback Section */}
      {viewUserFeedbacks ? (
        <div className="feedback-list-container">
          <h3>Your Feedbacks</h3>
          {loading ? (
            <p>Loading your feedbacks...</p>
          ) : (
            <div className="feedback-list">
              {userFeedbacks.length === 0 ? (
                <p>You have not submitted any feedback yet.</p>
              ) : (
                userFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <p className="feedback-message">
                    <strong>Message:</strong> {feedback.message}
                    </p>
                    
                    <p className="feedback-response">
                      <strong>Response:</strong> {feedback.response || "No response yet"}
                    </p>
                    <p className="feedback-date">
                    <strong>Submitted On:</strong> {new Date(feedback.createdAt).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => handleDeleteFeedback(feedback._id)} 
                      className="delete-btn"
                    >
                      Delete Feedback
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="feedback-list-container">
          <h3>Other People's Feedbacks</h3>
          {loading ? (
            <p>Loading other people's feedbacks...</p>
          ) : (
            <div className="feedback-list">
              {otherFeedbacks.length === 0 ? (
                <p>No feedbacks from other users yet.</p>
              ) : (
                otherFeedbacks.map((feedback) => (
                  <div key={feedback._id} className="feedback-card">
                    <p className="feedback-message">
                      <strong>Message:</strong> {feedback.message}
                    </p>
                    <p className="feedback-response">
                      <strong>Response:</strong> {feedback.response || "No response yet"}
                    </p>
                    <p className="feedback-date">
                      <strong>Submitted On:</strong> {new Date(feedback.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmitFeedback;
