import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const WishlistBookCard = ({ book, onRemove }) => {
  const imageUrl = getImageUrl(book?.image, book?.title || 'Book');

  return (
    <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
      <Link to={`/book/${book._id}`}>
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = getImageUrl(null, book?.title || 'Book');
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 truncate">{book.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
          <span className="inline-block mt-2.5 text-xs font-semibold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">{book.genre}</span>
        </div>
      </Link>
      <button
        onClick={() => onRemove(book._id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
        aria-label="Remove from wishlist"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default WishlistBookCard;