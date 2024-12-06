import React from "react";
import "./css/Home.css";
import lahoreImage from "../assets/images/lahore.jpg";
import islamabadImage from "../assets/images/islamabad.jpg";
import karachiImage from "../assets/images/Karachi.jpeg";
import abbotabadImage from "../assets/images/Abbotabad.jpeg";
import peshawerImage from "../assets/images/Peshawer.jpg";
import murreeImage from "../assets/images/murree.jpg";

const Home = () => {

  const routes = [
    { title: "Buses from Islamabad to Lahore", image: lahoreImage },
    { title: "Buses from Lahore to Islamabad", image: islamabadImage },
    { title: "Buses from Islamabad to Karachi", image: karachiImage },
    { title: "Buses from Islamabad to Abbottabad", image: abbotabadImage },
    { title: "Buses from Islamabad to Peshawer", image: peshawerImage },
    { title: "Buses from Peshawer to Murree", image: murreeImage },
  ];

  return (
    <div className="home-container">
      {/* Background Image Section */}
      <div className="home-header"></div>

      {/* Hero Section */}
      <div className="hero-content">
        <h1 className="animate-slide">Welcome to Bus Ease</h1>
        <p className="animate-fade">Book your tickets seamlessly with our platform.</p>
        <button className="enquire-button animate-bounce">Book Now</button>
      </div>

      {/* Top Traveled Bus Routes Section */}
      <div className="bus-routes">
      <div className="bus-routes-box">
        <h2 className="routes-title">Top Traveled Bus Routes</h2>
        <div className="routes-container">
          {routes.map((route, index) => (
            <div key={index} className="route-card">
              <img
                src={route.image}
                alt={route.title}
                className="route-image"
              />
              <div className="route-overlay">
                <p className="route-text">{route.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>


      {/* Features Section */}
      <div className="features">
        <div className="feature-card animate-scale">
          <h2>Track Buses</h2>
          <p>Monitor your bus location in real-time and never miss a ride.</p>
        </div>
        <div className="feature-card animate-scale">
          <h2>Manage Refunds</h2>
          <p>Easily request cancellations and track your refunds.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;