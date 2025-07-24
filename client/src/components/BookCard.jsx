import React from 'react';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img 
        src={`https://via.placeholder.com/150/56a8c2/ffffff?text=${book.title.replace(/\s/g, '+')}`} 
        alt={book.title} 
        className="book-cover" 
      />
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">{book.author}</p>
      </div>
    </div>
  );
};

export default BookCard;