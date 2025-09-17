/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const normalize = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL || '';
    // If we have a base API URL (production), prefix it so images load from backend
    // In local dev, leave it relative so Vite proxy serves it
    if (base) {
      const trimmed = url.startsWith('/') ? url : `/${url}`;
      return `${base}${trimmed}`;
    }
    return url.startsWith('/') ? url : `/${url}`;
  };
  const imageSrc = normalize(book?.image) || normalize(book?.imageUrl) || `https://placehold.co/400x600/f8b056/ffffff?text=${(book?.title || 'Book').replace(/\s/g, '+')}`;
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md transition-all hover:shadow-xl hover:-translate-y-1">
      <Link to={`/book/${book._id}`}>
        <div className="relative">
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Link to={`/book/${book._id}`} className="bg-[#2a6049] text-white font-bold px-4 py-2 rounded-full">Swap</Link>
            {!book.isMine && (
              <button onClick={(e) => {
                e.preventDefault();
                try {
                  const raw = localStorage.getItem('wishlist');
                  const list = raw ? JSON.parse(raw) : [];
                  if (!list.find((b) => b._id === book._id)) {
                    list.push({ _id: book._id, title: book.title, author: book.author, genre: book.genre, image: book.image || book.imageUrl });
                    localStorage.setItem('wishlist', JSON.stringify(list));
                  }
                } catch (_) {}
              }} className="bg-[#f8b056] text-[#2a6049] font-bold px-4 py-2 rounded-full">Wishlist</button>
            )}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-black text-gray-800 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2">{book.author}</p>
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs font-bold text-[#2a6049] bg-[#e8f0eb] px-3 py-1 rounded-full">{book.genre}</p>
            {book.condition && (
              <span className="text-xs font-bold text-[#2a6049] bg-[#f0f8f4] px-3 py-1 rounded-full capitalize">{book.condition}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;