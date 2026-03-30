import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Star, Calendar, BookOpen, Globe2, Layers, Heart, RefreshCw, ArrowLeft, Check, Share2, X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const bookStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .book-display { font-family: 'Playfair Display', Georgia, serif; }
  .book-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes bkFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .bk-fade-up { animation: bkFadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .bk-d1 { animation-delay: 80ms; }
  .bk-d2 { animation-delay: 160ms; }
  .bk-d3 { animation-delay: 240ms; }
`;

const conditionConfig = {
  'Like New': { bg: 'bg-teal-50',  text: 'text-teal-700',  border: 'border-teal-200'  },
  'Good':     { bg: 'bg-blue-50',  text: 'text-blue-700',  border: 'border-blue-200'  },
  'Fair':     { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Poor':     { bg: 'bg-red-50',   text: 'text-red-600',   border: 'border-red-200'   },
};

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
  const [copied, setCopied] = useState(false);

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myBooks, setMyBooks] = useState([]);
  const [selectedOfferedBooks, setSelectedOfferedBooks] = useState([]);
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
      setMyBooks(Array.isArray(data) ? data.filter(b => b.isAvailable !== false) : []);
    } catch { setMyBooks([]); }
    setShowSwapModal(true);
  };

  const toggleOfferedBook = (bookId) => {
    setSelectedOfferedBooks(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const handleSwapRequest = async (e) => {
    e.preventDefault();
    setSwapLoading(true);
    try {
      await axios.post('/api/swaps', {
        requestedBookIds: [book._id],
        offeredBookIds: selectedOfferedBooks,
        message: swapMessage.trim(),
      });
      setActionMsg({ text: 'Swap request sent!', type: 'success' });
      setShowSwapModal(false);
      setSelectedOfferedBooks([]);
      setSwapMessage('');
    } catch (err) {
      setActionMsg({ text: err.response?.data?.message || 'Failed to send swap request', type: 'error' });
    } finally {
      setSwapLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isOwnBook = user && book?.owner && (book.owner._id === user._id || book.owner === user._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f7f4]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-gray-200 border-t-teal-600" />
      </div>
    );
  }
  if (error) return <p className="text-red-600 text-center py-20">{error}</p>;
  if (!book) return null;

  const condCfg = conditionConfig[book.condition] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' };

  return (
    <div className="min-h-screen bg-[#f8f7f4] book-body">
      <style>{bookStyles}</style>

      {/* ── Hero — dark editorial ── */}
      <div className="relative bg-[#021a0f] overflow-hidden">
        {/* Background library photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#021a0f]/95 via-[#021a0f]/80 to-[#021a0f]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021a0f]/70 via-transparent to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pb-16">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-xs font-medium mb-8 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Browse
          </button>

          <div className="flex flex-col lg:flex-row gap-10 sm:gap-14">

            {/* Cover */}
            <div className="flex-shrink-0 mx-auto lg:mx-0 bk-fade-up">
              <div className="w-44 sm:w-56 md:w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10">
                <img
                  src={imageSrc}
                  alt={book.title}
                  className="w-full aspect-[2/3] object-contain bg-white/5"
                  onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-5">

              {/* Eyebrow + genre */}
              <div className="bk-fade-up flex items-center gap-3">
                <div className="w-5 h-px bg-teal-500" />
                {book.genre ? (
                  <span className="text-teal-400 text-[11px] font-medium tracking-[0.18em] uppercase">{book.genre}</span>
                ) : (
                  <span className="text-white/30 text-[11px] font-medium tracking-[0.18em] uppercase">Book</span>
                )}
              </div>

              {/* Title + author */}
              <div className="bk-fade-up bk-d1">
                <h1 className="book-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
                  {book.title}
                </h1>
                <p className="text-white/50 text-base italic book-display">by {book.author}</p>
              </div>

              {/* Badges */}
              <div className="bk-fade-up bk-d2 flex flex-wrap gap-2">
                {book.condition && (
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide ${condCfg.bg} ${condCfg.text} ${condCfg.border}`}>
                    <Check size={11} />
                    {book.condition}
                  </span>
                )}
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide ${
                  book.isAvailable !== false
                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${book.isAvailable !== false ? 'bg-teal-500' : 'bg-red-500'}`} />
                  {book.isAvailable !== false ? 'Available' : 'Unavailable'}
                </span>
                {book.averageRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wide bg-amber-50 text-amber-700 border-amber-200">
                    <Star size={11} />
                    {book.averageRating.toFixed(1)} · {book.ratingsCount} ratings
                  </span>
                )}
              </div>

              {/* Meta */}
              <div className="bk-fade-up bk-d2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35 font-medium">
                {book.publishedYear && <span className="flex items-center gap-1.5"><Calendar size={12} />{book.publishedYear}</span>}
                {book.pages > 0   && <span className="flex items-center gap-1.5"><BookOpen size={12} />{book.pages} pages</span>}
                {book.format      && <span className="flex items-center gap-1.5"><Layers size={12} />{book.format}</span>}
                {book.language    && <span className="flex items-center gap-1.5"><Globe2 size={12} />{book.language}</span>}
                {book.location && book.location !== 'Unknown' && <span className="flex items-center gap-1.5"><MapPin size={12} />{book.location}</span>}
              </div>

              {/* Actions */}
              {!isOwnBook && (
                <div className="bk-fade-up bk-d3 flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={openSwapModal}
                    disabled={book.isAvailable === false}
                    className="px-6 py-3 bg-white hover:bg-gray-50 disabled:bg-white/20 disabled:cursor-not-allowed text-[#021a0f] disabled:text-white/40 font-semibold rounded-xl transition-colors text-sm inline-flex items-center gap-2 shadow-lg"
                  >
                    <RefreshCw size={16} />
                    Request Swap
                  </button>
                  <button
                    onClick={handleWishlist}
                    className="px-6 py-3 border border-white/20 text-white/70 hover:text-white hover:border-white/35 font-semibold rounded-xl transition-colors text-sm inline-flex items-center gap-2"
                  >
                    <Heart size={16} />
                    Wishlist
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-4 py-3 border border-white/15 text-white/40 hover:text-white/70 hover:border-white/25 rounded-xl transition-colors text-sm inline-flex items-center gap-2"
                  >
                    <Share2 size={15} />
                    {copied ? 'Copied!' : 'Share'}
                  </button>
                </div>
              )}

              {actionMsg.text && (
                <p className={`text-xs font-medium flex items-center gap-1.5 ${actionMsg.type === 'success' ? 'text-teal-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${actionMsg.type === 'success' ? 'bg-teal-400' : 'bg-red-400'}`} />
                  {actionMsg.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Left — description + details */}
          <div className="lg:col-span-2 space-y-5">

            {/* About */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="book-display text-xl font-bold text-[#021a0f] mb-4">
                About This <span className="italic font-normal">Book</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                {book.description || 'No description provided for this book.'}
              </p>
              {book.tags?.length > 0 && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((t) => (
                      <span key={t} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium hover:bg-teal-50 hover:text-teal-700 transition cursor-default">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Book details grid */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="book-display text-xl font-bold text-[#021a0f] mb-5">
                Book <span className="italic font-normal">Details</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Genre',     value: book.genre,      icon: BookOpen },
                  { label: 'Condition', value: book.condition,   icon: Check },
                  { label: 'Format',    value: book.format,      icon: Layers },
                  { label: 'Language',  value: book.language,    icon: Globe2 },
                  { label: 'Pages',     value: book.pages > 0 ? book.pages : null, icon: BookOpen },
                  { label: 'Published', value: book.publishedYear, icon: Calendar },
                  { label: 'Location',  value: book.location && book.location !== 'Unknown' ? book.location : null, icon: MapPin },
                ].filter(d => d.value).map(d => (
                  <div key={d.label} className="bg-[#f8f7f4] rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <d.icon size={11} className="text-gray-400" />
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{d.label}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800">{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — owner + actions */}
          <div className="space-y-4">

            {/* Owner card */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#021a0f] px-5 py-4">
                <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.15em]">Book Owner</p>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[#021a0f] rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="book-display text-white text-sm font-bold italic">
                      {book.owner?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{book.owner?.name || 'Unknown User'}</p>
                    {book.location && book.location !== 'Unknown' && (
                      <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={10} />{book.location}
                      </p>
                    )}
                  </div>
                </div>
                {!isOwnBook && (
                  <button
                    onClick={openSwapModal}
                    disabled={book.isAvailable === false}
                    className="w-full py-2.5 bg-[#021a0f] hover:bg-teal-900 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={15} />
                    Request Swap
                  </button>
                )}
              </div>
            </div>

            {/* Quick actions */}
            {!isOwnBook && (
              <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-2.5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1">Quick Actions</p>
                <button
                  onClick={handleWishlist}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Heart size={15} />
                  Save to Wishlist
                </button>
                <button
                  onClick={handleShare}
                  className="w-full py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <Share2 size={15} />
                  {copied ? '✓ Link Copied' : 'Share Book'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* More by Owner */}
        {moreByOwner?.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-teal-500" />
              <h2 className="book-display text-2xl font-bold text-[#021a0f]">
                More from <span className="italic font-normal">{book.owner?.name || 'this owner'}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {moreByOwner.map((b) => (
                <Link key={b._id} to={`/book/${b._id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50">
                      <img
                        src={getImageUrl(b.image, b.title)}
                        alt={b.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, b.title); }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 truncate">{b.title}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{b.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Similar Books */}
        {similar?.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-5 h-px bg-teal-500" />
              <h2 className="book-display text-2xl font-bold text-[#021a0f]">
                Books You Might <span className="italic font-normal">Like</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similar.map((b) => (
                <Link key={b._id} to={`/book/${b._id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50">
                      <img
                        src={getImageUrl(b.image, b.title)}
                        alt={b.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, b.title); }}
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-gray-900 truncate">{b.title}</p>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{b.author}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Swap Modal ── */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowSwapModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="bg-[#021a0f] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
                  <RefreshCw size={16} className="text-teal-400" />
                </div>
                <div>
                  <h2 className="book-display text-base font-bold text-white italic">Request a Swap</h2>
                  <p className="text-white/35 text-xs truncate max-w-[200px]">for {book.title}</p>
                </div>
              </div>
              <button onClick={() => setShowSwapModal(false)} className="p-1.5 hover:bg-white/15 rounded-lg transition text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400">
                Sending request to <span className="font-semibold text-gray-700">{book.owner?.name || 'the owner'}</span>
              </p>

              {myBooks.length > 0 && (
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-2 uppercase tracking-wide">Offer books in exchange <span className="text-gray-400 normal-case tracking-normal">(optional, select multiple)</span></label>
                  <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50 bg-[#fbfbfb]">
                    {myBooks.map(b => (
                      <div 
                        key={b._id} 
                        onClick={() => toggleOfferedBook(b._id)}
                        className={`px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-colors ${
                          selectedOfferedBooks.includes(b._id) ? 'bg-teal-50/50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          selectedOfferedBooks.includes(b._id) ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'
                        }`}>
                          {selectedOfferedBooks.includes(b._id) && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold truncate ${selectedOfferedBooks.includes(b._id) ? 'text-teal-900' : 'text-gray-700'}`}>
                            {b.title}
                          </p>
                          <p className="text-[10px] text-gray-400 truncate">by {b.author}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedOfferedBooks.length > 0 && (
                    <p className="text-[10px] text-teal-600 mt-1.5 font-medium">{selectedOfferedBooks.length} books selected for offer</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1.5 uppercase tracking-wide">Message <span className="text-gray-400 normal-case tracking-normal">(optional)</span></label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  placeholder="Hi! I'd love to swap for this book…"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-[10px] text-gray-400 mt-1 text-right">{swapMessage.length}/500</p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapRequest}
                  disabled={swapLoading}
                  className="flex-1 px-4 py-2.5 bg-[#021a0f] hover:bg-teal-900 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {swapLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  ) : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsPage;