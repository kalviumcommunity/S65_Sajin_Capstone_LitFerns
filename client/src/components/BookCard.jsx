import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link to={`/book/${book._id}`}>
        <div className="relative">
          <img
            src={book.imageUrl || `https://placehold.co/400x600/f8b056/ffffff?text=${book.title.replace(/\s/g, '+')}`}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-[#2a6049] text-white font-bold px-4 py-2 rounded-full">
            Swap
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-black text-gray-800 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{book.author}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs font-bold text-[#2a6049] bg-[#e8f0eb] px-3 py-1 rounded-full">
              {book.genre}
            </p>
            <div className="flex items-center">
              <span className="text-amber-500">★</span>
              <span className="text-sm font-medium ml-1">4.8</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;