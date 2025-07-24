import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          LitFerns
        </Link>
        <nav>
          <ul className="nav-links">
            <li><Link to="/browse">Browse Books</Link></li>
            <li><Link to="/auth">Login / Register</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;