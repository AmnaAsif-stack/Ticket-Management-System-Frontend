import React, { useState } from "react";
import FeedbackForm from "../components/Customer/FeedbackForm";
import FeedbackList from "../components/Customer/FeedbackList";
import "./css/FeedbackPage.css"; // Optional styling


const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const handleFeedbackSubmit = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]);
  };

  return (
    <div className="feedback-page">
      <h1>Feedback Page</h1>
      <FeedbackForm onSubmitFeedback={handleFeedbackSubmit} />
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
};

export default FeedbackPage;
