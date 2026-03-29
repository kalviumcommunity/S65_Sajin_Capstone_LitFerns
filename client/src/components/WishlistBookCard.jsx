import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const WishlistBookCard = ({ book, onRemove }) => {
  if (!book) return null;

  const imageUrl = getImageUrl(book.image, book.title);

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <Link to={`/book/${book._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imageUrl}
            alt={book.title || 'Book cover'}
            className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 truncate">{book.title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{book.author}</p>
          {book.genre && (
            <span className="inline-block mt-2 text-xs font-semibold text-pink-600 bg-pink-100/80 px-2.5 py-1 rounded-full">
              {book.genre}
            </span>
          )}
        </div>
      </Link>
      <button
        onClick={() => onRemove(book._id)}
        className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full transition-all hover:bg-red-600 hover:scale-110 shadow-sm backdrop-blur-sm"
        aria-label="Remove from wishlist"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default WishlistBookCard;