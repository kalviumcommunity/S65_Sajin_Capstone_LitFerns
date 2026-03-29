import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';

const BookCard = ({ book }) => {
  const imageSrc = getImageUrl(book?.image, book?.title || 'Book');
  const metaLine = [book.author, book.publishedYear].filter(Boolean).join(' · ');

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <Link to={`/book/${book._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-50 aspect-[2/3]">
          <img
            src={imageSrc}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = getImageUrl(null, book?.title || 'Book');
            }}
          />
          {book.isAvailable === false && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white/95 text-gray-800 text-[11px] font-bold px-3 py-1 rounded-full shadow-md">Unavailable</span>
            </div>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-sm font-bold text-gray-800 truncate mb-0.5 group-hover:text-emerald-600 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3 truncate">{metaLine || book.author}</p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full truncate">{book.genre}</span>
            {book.condition && (
              <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full shrink-0">{book.condition}</span>
            )}
          </div>
          {book.averageRating > 0 && (
            <div className="mt-3 flex items-center gap-1 text-xs">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-gray-700">{book.averageRating.toFixed(1)}</span>
              <span className="text-gray-400 text-[11px]">({book.ratingsCount || 0})</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default BookCard;