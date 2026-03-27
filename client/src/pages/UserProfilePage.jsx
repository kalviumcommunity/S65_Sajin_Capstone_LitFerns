import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Edit3, LogOut, Plus, BookOpen, Heart, Upload, X, Trash2, RefreshCw, MapPin, Clock, CheckCircle, ArrowRight, Search, Image, Tag, FileText, Bookmark, Hash, Globe, Layers, Calendar, ChevronDown, TrendingUp, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const profileStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .prof-display { font-family: 'Playfair Display', Georgia, serif; }
  .prof-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes pFadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes avatarPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); }
    50%       { box-shadow: 0 0 0 8px rgba(52,211,153,0.12); }
  }
  @keyframes avatarSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .prof-avatar-wrap:hover .avatar-ring {
    animation: avatarPulse 1.4s ease-in-out infinite;
  }
  .prof-avatar-wrap:hover .avatar-letter {
    transform: scale(1.08);
    transition: transform 0.2s cubic-bezier(.22,1,.36,1);
  }
  .avatar-letter { transition: transform 0.2s ease; }
  .p-fade-up { animation: pFadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
`;

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white';

const swapStatusConfig = {
  Pending:      { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  Accepted:     { dot: 'bg-teal-500',   text: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-100' },
  Shipped:      { dot: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  'In Transit': { dot: 'bg-violet-400', text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100' },
  Completed:    { dot: 'bg-gray-400',   text: 'text-gray-600',   bg: 'bg-gray-100',  border: 'border-gray-200' },
  Declined:     { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
  Cancelled:    { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
};

const SwapStatusBadge = ({ status }) => {
  const cfg = swapStatusConfig[status] || swapStatusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} border ${cfg.border} px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {status}
    </span>
  );
};

const UserProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('my-books');
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [recentSwaps, setRecentSwaps] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const [editingBook, setEditingBook] = useState(null);
  const [editBookData, setEditBookData] = useState({});
  const [editBookSaving, setEditBookSaving] = useState(false);

  const [deletingBookId, setDeletingBookId] = useState(null);

  const [formData, setFormData] = useState({
    title: '', author: '', genre: '', condition: '', description: '',
    publishedYear: '', format: 'Paperback', pages: '', language: 'English',
    location: '', tags: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const load = async () => {
      try {
        const { data } = await axios.get('/api/users/profile');
        setWishlist(data?.wishlist || []);
      } catch { /* ignore */ }
      await loadMyBooks();
      try {
        const { data } = await axios.get('/api/swaps');
        setRecentSwaps(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch { setRecentSwaps([]); }
    };
    load();
  }, [user, navigate]);

  const loadMyBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await axios.get('/api/books/mybooks');
      setMyBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddBook = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      let imagePath = '';
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const res = await axios.post('/api/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        imagePath = res.data?.image || '';
      }
      await axios.post('/api/books', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        image: imagePath,
      });
      setFormData({ title: '', author: '', genre: '', condition: '', description: '', publishedYear: '', format: 'Paperback', pages: '', language: 'English', location: '', tags: '' });
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      setSuccessMsg('Book added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadMyBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveWishlist = async (bookId) => {
    try {
      await axios.delete(`/api/users/wishlist/${bookId}`);
      setWishlist(prev => prev.filter(b => b._id !== bookId));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to remove from wishlist');
    }
  };

  const openEditProfile = () => {
    setEditName(user?.name || '');
    setEditEmail(user?.email || '');
    setShowEditProfile(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    setError('');
    try {
      await updateProfile({ name: editName, email: editEmail });
      setShowEditProfile(false);
      setSuccessMsg('Profile updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setEditSaving(false);
    }
  };

  const openEditBook = (book) => {
    setEditingBook(book);
    setEditBookData({
      title: book.title || '', author: book.author || '', genre: book.genre || '',
      condition: book.condition || '', description: book.description || '',
      publishedYear: book.publishedYear || '', format: book.format || 'Paperback',
      pages: book.pages || '', language: book.language || 'English', location: book.location || '',
    });
  };

  const saveBook = async (e) => {
    e.preventDefault();
    setEditBookSaving(true);
    setError('');
    try {
      await axios.put(`/api/books/${editingBook._id}`, editBookData);
      setEditingBook(null);
      setSuccessMsg('Book updated!');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadMyBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setEditBookSaving(false);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      setDeletingBookId(null);
      setSuccessMsg('Book deleted');
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadMyBooks();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const completedSwaps = recentSwaps.filter(s => s.status === 'Completed').length;

  const tabs = [
    { key: 'my-books', label: 'My Books', icon: BookOpen, count: myBooks.length, countColor: 'bg-teal-100 text-teal-700' },
    { key: 'wishlist', label: 'Wishlist',  icon: Heart,    count: wishlist.length, countColor: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] prof-body">
      <style>{profileStyles}</style>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-24 right-6 z-50 bg-[#021a0f] text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={13} className="text-teal-400" />
          {successMsg}
        </div>
      )}

      {/* ── Header — dark editorial ── */}
      <div className="bg-[#021a0f]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-0">

          {/* Profile row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8">
            {/* Avatar with hover animation */}
            <div className="relative flex-shrink-0 prof-avatar-wrap group">
              <div className="avatar-ring w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center ring-2 ring-transparent transition-all duration-300">
                <span className="avatar-letter prof-display text-white text-2xl font-bold italic">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              {/* Glow ring that appears on hover */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-teal-400/0 group-hover:ring-teal-400/40 transition-all duration-300 pointer-events-none" />
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-400 rounded-full border-2 border-[#021a0f]" />
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
                <div className="w-4 h-px bg-teal-500" />
                <p className="text-teal-500 text-[11px] font-medium tracking-[0.18em] uppercase">Your Profile</p>
              </div>
              <h1 className="prof-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {user.name?.split(' ')[0]}{' '}
                <span className="italic font-normal text-teal-300">{user.name?.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-white/45 text-xs mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail size={11} />
                {user.email}
              </p>
              <p className="text-white/30 text-[11px] mt-0.5 flex items-center gap-1 justify-center sm:justify-start">
                <Calendar size={10} />
                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={openEditProfile}
                className="px-4 py-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5"
              >
                <Edit3 size={13} />
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-2 border border-white/10 text-white/40 hover:bg-red-500/20 hover:border-red-400/30 hover:text-red-300 rounded-lg transition-all duration-150"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Stats row — colourful like SwapDashboard */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-teal-700 leading-none">{myBooks.length}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Books Listed</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <RefreshCw size={16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-blue-700 leading-none">{completedSwaps}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Swaps Done</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart size={16} className="text-rose-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-rose-600 leading-none">{wishlist.length}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Wishlist</p>
              </div>
            </div>
          </div>

          {/* Tabs flush to header bottom */}
          <div className="flex -mb-px">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-150 inline-flex items-center gap-2 border-b-2 -mb-px ${
                  activeTab === key
                    ? 'border-teal-400 text-white'
                    : 'border-transparent text-white/40 hover:text-white/65 hover:border-white/20'
                }`}
              >
                <Icon size={13} />
                {label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    activeTab === key ? 'bg-teal-500/20 text-teal-300' : 'bg-white/8 text-white/35'
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Books / Wishlist */}
          <div className="lg:col-span-2 space-y-4">

            {/* Add Book button (only on my-books tab) */}
            {activeTab === 'my-books' && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-[#021a0f] hover:bg-teal-900 text-white rounded-lg text-xs font-semibold transition-colors duration-150 flex items-center gap-1.5 shadow-sm"
                >
                  <Plus size={14} />
                  Add Book
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3">
                <X size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-teal-600" />
                <p className="text-xs text-gray-400">Loading...</p>
              </div>
            )}

            {/* My Books */}
            {activeTab === 'my-books' && !loading && (
              myBooks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-teal-500" size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">No books yet</h3>
                  <p className="text-xs text-gray-400 mb-6 max-w-[200px] mx-auto leading-relaxed">Share your first book with the community</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 bg-[#021a0f] hover:bg-teal-900 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus size={13} />
                    Add Your First Book
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {myBooks.map(book => (
                    <div key={book._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
                      <div className="flex gap-0">
                        <div className={`w-0.5 flex-shrink-0 ${book.isAvailable !== false ? 'bg-teal-500' : 'bg-gray-300'}`} />
                        <div className="flex-1 p-4 flex gap-4">
                          <Link to={`/book/${book._id}`} className="flex-shrink-0">
                            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm" style={{ width: '3.5rem', height: '4.75rem' }}>
                              <img
                                src={getImageUrl(book.image, book.title)}
                                alt={book.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                              />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link to={`/book/${book._id}`} className="font-semibold text-gray-900 hover:text-teal-600 transition-colors text-sm truncate block">
                                  {book.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
                              </div>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button onClick={() => openEditBook(book)} className="p-1.5 hover:bg-teal-50 rounded-lg transition-colors">
                                  <Edit3 size={13} className="text-gray-400 hover:text-teal-600" />
                                </button>
                                <button onClick={() => setDeletingBookId(book._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {book.genre && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide">
                                  {book.genre}
                                </span>
                              )}
                              {book.condition && (
                                <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md">
                                  {book.condition}
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold inline-flex items-center gap-1 ${
                                book.isAvailable !== false
                                  ? 'bg-teal-50 text-teal-600 border border-teal-100'
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${book.isAvailable !== false ? 'bg-teal-500' : 'bg-gray-400'}`} />
                                {book.isAvailable !== false ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && !loading && (
              wishlist.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-pink-400" size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Wishlist is empty</h3>
                  <p className="text-xs text-gray-400 mb-6 max-w-[200px] mx-auto leading-relaxed">Browse books and save ones you love</p>
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 bg-[#021a0f] hover:bg-teal-900 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Search size={13} />
                    Browse Books
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {wishlist.map(book => (
                    <div key={book._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200 group">
                      <div className="flex gap-0">
                        <div className="w-0.5 flex-shrink-0 bg-rose-400" />
                        <div className="flex-1 p-4 flex gap-4">
                          <Link to={`/book/${book._id}`} className="flex-shrink-0">
                            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shadow-sm" style={{ width: '3.5rem', height: '4.75rem' }}>
                              <img
                                src={getImageUrl(book.image, book.title)}
                                alt={book.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                              />
                            </div>
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <Link to={`/book/${book._id}`} className="font-semibold text-gray-900 hover:text-teal-600 transition-colors text-sm truncate block">
                                  {book.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveWishlist(book._id)}
                                className="p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                              >
                                <Heart size={13} className="text-rose-400 fill-rose-400" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {book.genre && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-md font-semibold uppercase tracking-wide">
                                  {book.genre}
                                </span>
                              )}
                              {book.condition && (
                                <span className="text-[10px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md">
                                  {book.condition}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/dashboard" className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={11} />
                </Link>
              </div>

              {recentSwaps.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="text-gray-300" size={18} />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">No activity yet</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Start swapping to see activity</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentSwaps.map(swap => (
                    <div key={swap._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0" style={{ width: '2.5rem', height: '3.25rem' }}>
                        <img
                          src={getImageUrl(swap.requestedBook?.image, swap.requestedBook?.title || 'Book')}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = getImageUrl(null, 'Book'); }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{swap.requestedBook?.title || 'Unknown'}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {swap.requester?._id === user._id ? 'You requested' : 'Incoming request'}
                        </p>
                      </div>
                      <SwapStatusBadge status={swap.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
              </div>
              <div className="p-3 space-y-1">
                <Link to="/browse" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search size={14} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Browse Books</p>
                    <p className="text-[10px] text-gray-400">Find books to swap</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
                <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Swap Dashboard</p>
                    <p className="text-[10px] text-gray-400">Manage exchanges</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Book Modal ── */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="bg-[#021a0f] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
                  <BookOpen size={17} className="text-teal-400" />
                </div>
                <div>
                  <h2 className="prof-display text-base font-bold text-white italic">Add a New Book</h2>
                  <p className="text-white/40 text-xs">Share with the community</p>
                </div>
              </div>
              <button onClick={() => setShowAddForm(false)} className="p-1.5 hover:bg-white/15 rounded-lg transition text-white/50 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(92vh-76px)] px-6 py-5">
              <form onSubmit={handleAddBook} className="space-y-6">

                {/* Cover Image */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5"><Image size={13} className="text-teal-600" /> Cover Image</p>
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-28 rounded-lg border border-gray-200 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <BookOpen size={20} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setImageFile(file);
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setImagePreview(reader.result);
                            reader.readAsDataURL(file);
                          } else setImagePreview(null);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-teal-400 hover:bg-teal-50/20 transition cursor-pointer">
                        <Upload size={18} className="text-teal-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600 font-medium">{imageFile ? imageFile.name : 'Click to upload'}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG — max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <FileText size={13} className="text-teal-600" /> Basic Information
                    <span className="ml-auto text-[10px] text-gray-400 font-normal">* Required</span>
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Title *</label>
                      <input name="title" value={formData.title} onChange={handleFormChange} className={inputCls} placeholder="Book title" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Author *</label>
                      <input name="author" value={formData.author} onChange={handleFormChange} className={inputCls} placeholder="Author name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Genre *</label>
                        <div className="relative">
                          <select name="genre" value={formData.genre} onChange={handleFormChange} className={`${inputCls} appearance-none pr-8`} required>
                            <option value="">Select genre</option>
                            {['Fiction','Non-Fiction','Thriller','Memoir','Self-Help','Classic','Dystopian','Sci-Fi','Fantasy','Mystery','Romance','Biography','Horror','Poetry','Other'].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">Condition *</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {['Like New', 'Good', 'Fair', 'Poor'].map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, condition: c })}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                                formData.condition === c
                                  ? 'bg-[#021a0f] text-white border-[#021a0f]'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:text-teal-700'
                              }`}
                            >{c}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleFormChange} className={inputCls} placeholder="What's this book about?" rows={3} required />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <Layers size={13} className="text-teal-600" /> Additional Details
                    <span className="ml-auto text-[10px] text-gray-400 font-normal">Optional</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Year</label>
                      <input name="publishedYear" type="number" value={formData.publishedYear} onChange={handleFormChange} className={inputCls} placeholder="2024" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Pages</label>
                      <input name="pages" type="number" value={formData.pages} onChange={handleFormChange} className={inputCls} placeholder="320" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Language</label>
                      <input name="language" value={formData.language} onChange={handleFormChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Format</label>
                      <div className="relative">
                        <select name="format" value={formData.format} onChange={handleFormChange} className={`${inputCls} appearance-none pr-8`}>
                          {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Location</label>
                      <input name="location" value={formData.location} onChange={handleFormChange} className={inputCls} placeholder="City, State" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Tags</label>
                      <input name="tags" value={formData.tags} onChange={handleFormChange} className={inputCls} placeholder="fiction, classic…" />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-center gap-2">
                    <X size={12} className="text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}

                {/* Footer actions */}
                <div className="flex gap-3 pt-2 pb-1 border-t border-gray-100 -mx-6 px-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-[#021a0f] text-white rounded-lg font-semibold hover:bg-teal-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2">
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding…</>
                    ) : (
                      <><Plus size={15} /> Add Book</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ── */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditProfile(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={16} /></button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} required minLength={2} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className={inputCls} required />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editSaving} className="flex-1 px-4 py-2.5 bg-[#021a0f] text-white rounded-lg text-sm font-semibold hover:bg-teal-900 disabled:bg-gray-300 transition">{editSaving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Book Modal ── */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingBook(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-900">Edit Book</h2>
              <button onClick={() => setEditingBook(null)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={16} /></button>
            </div>
            <form onSubmit={saveBook} className="space-y-3">
              {[
                { label: 'Title', key: 'title', type: 'text', required: true },
                { label: 'Author', key: 'author', type: 'text', required: true },
                { label: 'Genre', key: 'genre', type: 'text' },
                { label: 'Description', key: 'description', type: 'textarea' },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">{label}</label>
                  {type === 'textarea' ? (
                    <textarea value={editBookData[key]} onChange={e => setEditBookData({ ...editBookData, [key]: e.target.value })} className={inputCls} rows={3} />
                  ) : (
                    <input type={type} value={editBookData[key]} onChange={e => setEditBookData({ ...editBookData, [key]: e.target.value })} className={inputCls} required={required} />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Condition</label>
                <select value={editBookData.condition} onChange={e => setEditBookData({ ...editBookData, condition: e.target.value })} className={inputCls}>
                  {['Like New', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Year</label>
                  <input type="number" value={editBookData.publishedYear} onChange={e => setEditBookData({ ...editBookData, publishedYear: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Format</label>
                  <select value={editBookData.format} onChange={e => setEditBookData({ ...editBookData, format: e.target.value })} className={inputCls}>
                    {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Pages</label>
                  <input type="number" value={editBookData.pages} onChange={e => setEditBookData({ ...editBookData, pages: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-gray-600 mb-1">Language</label>
                  <input value={editBookData.language} onChange={e => setEditBookData({ ...editBookData, language: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">Location</label>
                <input value={editBookData.location} onChange={e => setEditBookData({ ...editBookData, location: e.target.value })} className={inputCls} />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingBook(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editBookSaving} className="flex-1 px-4 py-2.5 bg-[#021a0f] text-white rounded-lg text-sm font-semibold hover:bg-teal-900 disabled:bg-gray-300 transition">{editBookSaving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deletingBookId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeletingBookId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={20} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Delete Book?</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">This action cannot be undone. The book will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingBookId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => deleteBook(deletingBookId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;