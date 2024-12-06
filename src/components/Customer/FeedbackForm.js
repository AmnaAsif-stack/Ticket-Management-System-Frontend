import React, { useState } from "react";
import '../Customer/FeedbackForm.css'; // Optional for styling

const FeedbackForm = ({ onSubmitFeedback }) => {
  const [feedback, setFeedback] = useState({
    rating: 1,
    comments: "",
    userId: JSON.parse(localStorage.getItem("userProfile"))?.id || 'guest', // Assume userProfile stores user info like id
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedback({
      ...feedback,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedback.comments.trim() === "") {
      alert("Please enter some feedback!");
      return;
    }
    onSubmitFeedback(feedback); // Pass feedback to parent component
    setFeedback({ rating: 1, comments: "" }); // Reset form
    alert("Feedback submitted!");
  };

  return (
    <div className="feedback-form">
      <h2>Submit Your Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating (1 to 5):</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          value={feedback.rating}
          onChange={handleInputChange}
        />
        <br />
        <label>Comments:</label>
        <textarea
          name="comments"
          value={feedback.comments}
          onChange={handleInputChange}
          rows="4"
          placeholder="Write your comments here..."
        />
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
