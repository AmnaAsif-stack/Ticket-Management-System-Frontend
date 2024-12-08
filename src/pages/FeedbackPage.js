import React, { useState } from "react";
import FeedbackForm from "../components/Customer/SubmitFeedback";



const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const handleFeedbackSubmit = (newFeedback) => {
    setFeedbacks([...feedbacks, newFeedback]);
  };

  return (
    <div className="feedback-page">
      <h1>Feedback Page</h1>
      <FeedbackForm onSubmitFeedback={handleFeedbackSubmit} />
    </div>
  );
};

export default FeedbackPage;
