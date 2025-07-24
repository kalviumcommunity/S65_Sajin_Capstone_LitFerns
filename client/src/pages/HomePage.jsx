import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <h1>Welcome to LitFerns</h1>
        <p>Your community for swapping books and discovering new stories.</p>
        <Link to="/browse" className="cta-button">
          Start Browsing
        </Link>
      </section>
    </div>
  );
};

export default HomePage;