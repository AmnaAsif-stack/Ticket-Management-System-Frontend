import React from "react";
import '../Customer/FeedbackList.css'; // Optional for styling

const FeedbackList = ({ feedbacks }) => {
  return (
    <div className="feedback-list">
      <h2>Customer Feedback</h2>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <div key={index} className="feedback-item">
            <h3>Rating: {feedback.rating} / 5</h3>
            <p>{feedback.comments}</p>
          </div>
        ))
      ) : (
        <p>No feedback submitted yet.</p>
      )}
    </div>
  );
};

export default FeedbackList;
