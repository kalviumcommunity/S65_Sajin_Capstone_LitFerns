import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Star, Calendar, BookOpen, Globe2, Layers, Heart, RefreshCw, ArrowLeft, Check, Clock, Share2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [moreByOwner, setMoreByOwner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState({ text: '', type: '' });

  // Swap request state
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedOfferedBook, setSelectedOfferedBook] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);

  const imageSrc = useMemo(() => getImageUrl(book?.image, book?.title || 'Book'), [book]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/api/books/${id}`);
        setBook(data.book || data);
        setSimilar(data.similar || []);
        setMoreByOwner(data.moreByOwner || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
    window.scrollTo(0, 0);
  }, [id]);

  const handleWishlist = async () => {
    if (!user) { navigate('/login'); return; }
    if (!book?._id) return;
    try {
      setActionMsg({ text: '', type: '' });
      await axios.post('/api/users/wishlist', { bookId: book._id });
      setActionMsg({ text: 'Added to wishlist!', type: 'success' });
    } catch (err) {
      setActionMsg({ text: err.response?.data?.message || 'Could not add to wishlist', type: 'error' });
    }
  };

  const openSwapModal = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await axios.get('/api/books/mybooks');
      setMyBooks(Array.isArray(data) ? data : []);
    } catch {
      setMyBooks([]);
    }
    setShowSwapModal(true);
  };

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    setSwapLoading(true);
    try {
      await axios.post('/api/swaps', {
        requestedBookId: book._id,
        offeredBookId: selectedOfferedBook || undefined,
        message: swapMessage.trim(),
      });
      setActionMsg({ text: 'Swap request sent successfully!', type: 'success' });
      setShowSwapModal(false);
      setSelectedOfferedBook('');
      setSwapMessage('');
    } catch (err) {
      setActionMsg({ text: err.response?.data?.message || 'Failed to send swap request', type: 'error' });
    } finally {
      setSwapLoading(false);
    }
  };

  const isOwnBook = user && book?.owner && (book.owner._id === user._id || book.owner === user._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" />
      </div>
    );
  }
  if (error) return <p className="text-red-600 text-center py-20">{error}</p>;
  if (!book) return null;

  const conditionColor = {
    'Like New': 'bg-emerald-100 text-emerald-700',
    'Good': 'bg-blue-100 text-blue-700',
    'Fair': 'bg-amber-100 text-amber-700',
    'Poor': 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-700 to-slate-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-10 sm:pb-12 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-emerald-200 hover:text-white transition text-sm mb-6 sm:mb-8"
          >
            <ArrowLeft size={16} />
            Back to Browse
          </button>

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10">
            {/* Book Cover */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="w-48 sm:w-64 md:w-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-white/5">
                <img
                  src={imageSrc}
                  alt={book.title}
                  className="w-full aspect-[2/3] object-contain bg-gray-50"
                  onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1 text-white space-y-5">
              <div>
                {book.genre && (
                  <span className="inline-block bg-emerald-500/30 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-emerald-500/30">
                    {book.genre}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">{book.title}</h1>
                <p className="text-base sm:text-lg text-emerald-200 mt-2">by {book.author}</p>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3">
                {book.condition && (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${conditionColor[book.condition] || 'bg-gray-100 text-gray-700'}`}>
                    <Check size={12} />
                    {book.condition}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${book.isAvailable !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${book.isAvailable !== false ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {book.isAvailable !== false ? 'Available' : 'Unavailable'}
                </span>
                {book.averageRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                    <Star size={12} />
                    {book.averageRating.toFixed(1)} ({book.ratingsCount})
                  </span>
                )}
              </div>

              {/* Meta Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-200/80">
                {book.publishedYear && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{book.publishedYear}</span>
                  </div>
                )}
                {book.pages > 0 && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={14} />
                    <span>{book.pages} pages</span>
                  </div>
                )}
                {book.format && (
                  <div className="flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>{book.format}</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex items-center gap-1.5">
                    <Globe2 size={14} />
                    <span>{book.language}</span>
                  </div>
                )}
                {book.location && book.location !== 'Unknown' && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    <span>{book.location}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isOwnBook && (
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={openSwapModal}
                    disabled={book.isAvailable === false}
                    className="px-7 py-3 bg-white text-emerald-800 font-semibold rounded-xl hover:bg-emerald-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition inline-flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCw size={18} />
                    Request Swap
                  </button>
                  <button
                    onClick={handleWishlist}
                    className="px-7 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition inline-flex items-center gap-2"
                  >
                    <Heart size={18} />
                    Wishlist
                  </button>
                </div>
              )}

              {actionMsg.text && (
                <p className={`text-sm font-medium ${actionMsg.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
                  {actionMsg.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Below Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Description & Tags */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Book</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {book.description || 'No description provided for this book.'}
              </p>
              {book.tags?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((t) => (
                      <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-emerald-50 hover:text-emerald-700 transition cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Book Details Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Genre', value: book.genre, icon: BookOpen },
                  { label: 'Condition', value: book.condition, icon: Check },
                  { label: 'Format', value: book.format, icon: Layers },
                  { label: 'Language', value: book.language, icon: Globe2 },
                  { label: 'Pages', value: book.pages > 0 ? book.pages : null, icon: BookOpen },
                  { label: 'Published', value: book.publishedYear, icon: Calendar },
                  { label: 'Location', value: book.location && book.location !== 'Unknown' ? book.location : null, icon: MapPin },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <d.icon size={14} />
                      <span className="text-xs font-medium uppercase tracking-wide">{d.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Owner Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wide">Book Owner</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-lg font-bold">{book.owner?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{book.owner?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">Member</p>
                </div>
              </div>
              {book.location && book.location !== 'Unknown' && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin size={14} className="text-gray-400" />
                  <span>{book.location}</span>
                </div>
              )}
              {!isOwnBook && (
                <button
                  onClick={openSwapModal}
                  disabled={book.isAvailable === false}
                  className="w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm"
                >
                  <RefreshCw size={16} />
                  Request Swap
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Quick Actions</h3>
              {!isOwnBook && (
                <button
                  onClick={handleWishlist}
                  className="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition flex items-center justify-center gap-2 text-sm"
                >
                  <Heart size={16} />
                  Save to Wishlist
                </button>
              )}
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="w-full py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition flex items-center justify-center gap-2 text-sm"
              >
                <Share2 size={16} />
                Share Book
              </button>
            </div>
          </div>
        </div>

        {/* More by Owner */}
        {moreByOwner?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">More from {book.owner?.name || 'This Owner'}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {moreByOwner.map((b) => (
                <Link key={b._id} to={`/book/${b._id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={getImageUrl(b.image, b.title)}
                        alt={b.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, b.title); }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{b.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{b.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar Books */}
        {similar?.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Books You Might Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similar.map((b) => (
                <Link key={b._id} to={`/book/${b._id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={getImageUrl(b.image, b.title)}
                        alt={b.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, b.title); }}
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{b.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{b.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSwapModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-1 text-gray-900">Request a Swap</h2>
            <p className="text-sm text-gray-500 mb-5">
              Request to swap for <strong className="text-gray-700">{book.title}</strong> from {book.owner?.name || 'the owner'}
            </p>

            <form onSubmit={handleSwapRequest} className="space-y-4">
              {myBooks.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer a book in exchange (optional)</label>
                  <select
                    value={selectedOfferedBook}
                    onChange={(e) => setSelectedOfferedBook(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">No specific book offered</option>
                    {myBooks.filter(b => b.isAvailable !== false).map(b => (
                      <option key={b._id} value={b._id}>{b.title} by {b.author}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Hi! I'd love to swap for this book..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={swapLoading}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:bg-gray-300 transition text-sm"
                >
                  {swapLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;
