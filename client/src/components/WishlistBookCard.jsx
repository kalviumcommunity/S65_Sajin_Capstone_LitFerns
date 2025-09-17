import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const WishlistBookCard = ({ book, onRemove }) => {
  const imageUrl = book.image && book.image.startsWith('/')
    ? `http://localhost:5000${book.image}`
    : book.image || `https://placehold.co/400x600/a3e635/1f2937?text=${book.title.replace(/\s/g, '+')}`;
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-md group">
      <Link to={`/book/${book._id}`}>
        <img
            src={imageUrl}
            alt={book.title}
            className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author}</p>
        </div>
      </Link>
      <button
        onClick={() => onRemove(book._id)}
        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
        aria-label="Remove from wishlist"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default WishlistBookCard;