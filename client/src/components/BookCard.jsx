import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const BookCard = ({ book }) => {
  const imageSrc = getImageUrl(book?.image, book?.title || 'Book');
  const metaLine = [book.author, book.publishedYear].filter(Boolean).join(' · ');

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group">
      <Link to={`/book/${book._id}`}>
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = getImageUrl(null, book?.title || 'Book');
            }}
          />
          {book.isAvailable === false && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">Unavailable</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 truncate mb-0.5">
            {book.title}
          </h3>
          <p className="text-sm text-gray-500 mb-3 truncate">{metaLine || book.author}</p>
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{book.genre}</span>
            {book.condition && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{book.condition}</span>
            )}
          </div>
          {book.averageRating > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-sm">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-gray-700">{book.averageRating.toFixed(1)}</span>
              <span className="text-gray-400 text-xs">({book.ratingsCount || 0})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BookCard;