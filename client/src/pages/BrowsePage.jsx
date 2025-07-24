import React from 'react';
import BookCard from '../components/BookCard';
import './BrowsePage.css';


const mockBooks = [
  { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { _id: '2', title: '1984', author: 'George Orwell' },
  { _id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { _id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
  { _id: '5', title: 'Dune', author: 'Frank Herbert' },
  { _id: '6', title: 'The Hobbit', author: 'J.R.R. Tolkien' },
];

const BrowsePage = () => {
  return (
    <div className="browse-page">
      <h2>Browse Available Books</h2>
      <div className="book-grid">
        {mockBooks.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BrowsePage;