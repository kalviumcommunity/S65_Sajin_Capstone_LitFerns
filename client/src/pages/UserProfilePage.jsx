import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  User, Edit3, LogOut, Plus, BookOpen, Heart, Upload, X, Trash2,
  RefreshCw, MapPin, Clock, CheckCircle, ArrowRight, Search, Image,
  Tag, FileText, Bookmark, Hash, Globe, Layers, Calendar, ChevronDown,
  TrendingUp, Mail
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import { BookCoverUpload } from '../components/BookCoverUpload';

const profileStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,400&family=Geist:wght@300;400;500;600&display=swap');

  .pf-serif  { font-family: 'Fraunces', Georgia, serif; }
  .pf-sans   { font-family: 'Geist', system-ui, sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.1s; }
  .fade-up-3 { animation-delay: 0.15s; }

  .avatar-glow {
    box-shadow: 0 0 0 0 rgba(20, 184, 166, 0);
    transition: box-shadow 0.3s ease;
  }
  .avatar-glow:hover {
    box-shadow: 0 0 0 6px rgba(20, 184, 166, 0.15);
  }

  .tab-pill {
    position: relative;
    transition: color 0.2s ease;
  }
  .tab-pill::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0; right: 0;
    height: 2px;
    background: #14b8a6;
    border-radius: 2px 2px 0 0;
    transform: scaleX(0);
    transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .tab-pill.active::after { transform: scaleX(1); }

  .book-card {
    transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
  }
  .book-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0,0,0,0.07);
  }

  .action-btn {
    transition: opacity 0.15s ease, background 0.15s ease;
  }

  .stat-card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }
  .stat-card:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  }

  .sidebar-link {
    transition: background 0.15s ease;
  }
  .sidebar-link:hover { background: #f8f7f4; }

  .modal-overlay {
    backdrop-filter: blur(4px);
  }

  input, select, textarea {
    font-family: 'Geist', system-ui, sans-serif;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
`;

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition bg-white placeholder:text-gray-400';

const swapStatusConfig = {
  Pending:      { dot: 'bg-amber-400',  text: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  Accepted:     { dot: 'bg-teal-500',   text: 'text-teal-700',   bg: 'bg-teal-50',   border: 'border-teal-200' },
  Shipped:      { dot: 'bg-blue-400',   text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  'In Transit': { dot: 'bg-violet-400', text: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
  Completed:    { dot: 'bg-emerald-400',text: 'text-emerald-700',bg: 'bg-emerald-50',border: 'border-emerald-200' },
  Declined:     { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
  Cancelled:    { dot: 'bg-red-400',    text: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200' },
};

const SwapStatusBadge = ({ status }) => {
  const cfg = swapStatusConfig[status] || swapStatusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} border ${cfg.border} px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide`}>
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
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

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
      const imageUrl = uploadedImageUrl || '';
      await axios.post('/api/books', {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        image: imageUrl,
      });
      setFormData({ title: '', author: '', genre: '', condition: '', description: '', publishedYear: '', format: 'Paperback', pages: '', language: 'English', location: '', tags: '' });
      setImageFile(null);
      setImagePreview(null);
      setUploadedImageUrl('');
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
    { key: 'my-books', label: 'My Books',  icon: BookOpen, count: myBooks.length },
    { key: 'wishlist',  label: 'Wishlist',  icon: Heart,    count: wishlist.length },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4f0] pf-sans">
      <style>{profileStyles}</style>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 fade-up">
          <CheckCircle size={14} className="text-teal-400 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-[#0d1f17]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0">

          {/* Profile row */}
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-10 fade-up">

            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
              <div className="avatar-glow w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center cursor-default">
                <span className="pf-serif text-teal-300 text-3xl font-light italic leading-none select-none">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-teal-500/70 text-[10px] font-medium tracking-[0.2em] uppercase mb-2">Your Profile</p>
              <h1 className="pf-serif text-3xl sm:text-4xl font-light text-white leading-[1.1] tracking-tight mb-2">
                {user.name?.split(' ')[0]}{' '}
                <span className="italic text-teal-200/80">{user.name?.split(' ').slice(1).join(' ')}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                <span className="text-white/35 text-xs flex items-center gap-1.5">
                  <Mail size={11} className="text-white/20" />
                  {user.email}
                </span>
                <span className="text-white/20 text-xs flex items-center gap-1.5">
                  <Calendar size={11} className="text-white/20" />
                  Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-1 flex-shrink-0">
              <button
                onClick={openEditProfile}
                className="h-9 px-4 bg-white/6 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-2"
              >
                <Edit3 size={13} />
                Edit
              </button>
              <button
                onClick={handleLogout}
                className="h-9 w-9 flex items-center justify-center bg-white/5 hover:bg-red-500/15 border border-white/10 hover:border-red-400/30 text-white/30 hover:text-red-300 rounded-lg transition-all"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-7 fade-up fade-up-1">
            {[
              { icon: BookOpen, value: myBooks.length,    label: 'Books Listed', color: 'text-teal-400',   bg: 'bg-teal-500/10' },
              { icon: RefreshCw,value: completedSwaps,    label: 'Swaps Done',   color: 'text-blue-400',   bg: 'bg-blue-400/10' },
              { icon: Heart,    value: wishlist.length,   label: 'Wishlist',     color: 'text-rose-400',   bg: 'bg-rose-400/10' },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label} className="stat-card bg-white/5 border border-white/8 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={16} className={color} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${color} leading-none`}>{value}</p>
                  <p className="text-[11px] text-white/30 mt-1 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 -mb-px fade-up fade-up-2">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`tab-pill px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                  activeTab === key ? 'active text-white' : 'text-white/30 hover:text-white/55'
                }`}
              >
                <Icon size={13} />
                {label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    activeTab === key ? 'bg-teal-500/20 text-teal-300' : 'bg-white/8 text-white/25'
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left — Books / Wishlist */}
          <div className="lg:col-span-2 space-y-3 fade-up fade-up-2">

            {/* Toolbar */}
            {activeTab === 'my-books' && (
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400 font-medium">
                  {myBooks.length > 0 ? `${myBooks.length} book${myBooks.length !== 1 ? 's' : ''}` : ''}
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="h-8 px-3.5 bg-gray-900 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  Add Book
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
                <X size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin rounded-full h-7 w-7 border-2 border-gray-200 border-t-teal-500" />
                <p className="text-xs text-gray-400">Loading…</p>
              </div>
            )}

            {/* My Books */}
            {activeTab === 'my-books' && !loading && (
              myBooks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-teal-500" size={22} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1.5">No books yet</h3>
                  <p className="text-xs text-gray-400 mb-6 max-w-[180px] mx-auto leading-relaxed">Share your first book with the community</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus size={13} />
                    Add Your First Book
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {myBooks.map((book, i) => (
                    <div
                      key={book._id}
                      className="book-card bg-white rounded-xl border border-gray-100 overflow-hidden group"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="flex">
                        {/* Status stripe */}
                        <div className={`w-[3px] flex-shrink-0 ${book.isAvailable !== false ? 'bg-teal-400' : 'bg-gray-200'}`} />

                        <div className="flex-1 p-4 flex gap-4 min-w-0">
                          {/* Cover */}
                          <Link to={`/book/${book._id}`} className="flex-shrink-0">
                            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100" style={{ width: '56px', height: '76px' }}>
                              <img
                                src={getImageUrl(book.image, book.title)}
                                alt={book.title}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                              />
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <Link to={`/book/${book._id}`} className="font-semibold text-gray-900 hover:text-teal-600 transition-colors text-sm truncate block leading-snug">
                                  {book.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{book.author}</p>
                              </div>

                              {/* Actions — always visible but subtle */}
                              <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditBook(book)}
                                  className="action-btn p-1.5 hover:bg-gray-100 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit3 size={12} className="text-gray-400 hover:text-gray-600" />
                                </button>
                                <button
                                  onClick={() => setDeletingBookId(book._id)}
                                  className="action-btn p-1.5 hover:bg-red-50 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {book.genre && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                  {book.genre}
                                </span>
                              )}
                              {book.condition && (
                                <span className="text-[10px] bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md">
                                  {book.condition}
                                </span>
                              )}
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                                book.isAvailable !== false
                                  ? 'bg-teal-50 text-teal-600'
                                  : 'bg-gray-50 text-gray-400'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${book.isAvailable !== false ? 'bg-teal-400' : 'bg-gray-300'}`} />
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
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                  <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-rose-400" size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1.5">Wishlist is empty</h3>
                  <p className="text-xs text-gray-400 mb-6 max-w-[180px] mx-auto leading-relaxed">Browse books and save ones you love</p>
                  <Link
                    to="/browse"
                    className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Search size={13} />
                    Browse Books
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {wishlist.map(book => (
                    <div key={book._id} className="book-card bg-white rounded-xl border border-gray-100 overflow-hidden group">
                      <div className="flex">
                        <div className="w-[3px] flex-shrink-0 bg-rose-300" />
                        <div className="flex-1 p-4 flex gap-4 min-w-0">
                          <Link to={`/book/${book._id}`} className="flex-shrink-0">
                            <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100" style={{ width: '56px', height: '76px' }}>
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
                              <div className="min-w-0 flex-1">
                                <Link to={`/book/${book._id}`} className="font-semibold text-gray-900 hover:text-teal-600 transition-colors text-sm truncate block leading-snug">
                                  {book.title}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5 truncate">{book.author}</p>
                              </div>
                              <button
                                onClick={() => handleRemoveWishlist(book._id)}
                                className="action-btn p-1.5 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 flex-shrink-0"
                                title="Remove from wishlist"
                              >
                                <Heart size={12} className="text-rose-400 fill-rose-400" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {book.genre && (
                                <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                  {book.genre}
                                </span>
                              )}
                              {book.condition && (
                                <span className="text-[10px] bg-gray-50 text-gray-400 border border-gray-100 px-2 py-0.5 rounded-md">
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

          {/* ── Right Sidebar ── */}
          <div className="space-y-4 fade-up fade-up-3">

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
                <Link to="/dashboard" className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 transition-colors">
                  View All <ArrowRight size={11} />
                </Link>
              </div>

              {recentSwaps.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="text-gray-200" size={16} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">No activity yet</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">Start swapping to see activity</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentSwaps.map(swap => (
                    <div key={swap._id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/60 transition-colors">
                      <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0" style={{ width: '40px', height: '52px' }}>
                        <img
                          src={getImageUrl(swap.requestedBook?.image, swap.requestedBook?.title || 'Book')}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = getImageUrl(null, 'Book'); }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate leading-snug">{swap.requestedBook?.title || 'Unknown'}</p>
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
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Quick Links</h3>
              </div>
              <div className="p-2">
                <Link to="/browse" className="sidebar-link flex items-center gap-3 px-3 py-3 rounded-xl group">
                  <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search size={14} className="text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Browse Books</p>
                    <p className="text-[11px] text-gray-400">Find books to swap</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
                <Link to="/dashboard" className="sidebar-link flex items-center gap-3 px-3 py-3 rounded-xl group">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={14} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">Swap Dashboard</p>
                    <p className="text-[11px] text-gray-400">Manage exchanges</p>
                  </div>
                  <ArrowRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          Add Book Modal
      ══════════════════════════════════════ */}
      {showAddForm && (
        <div
          className="fixed inset-0 bg-black/40 modal-overlay flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddForm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden fade-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0d1f17] px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/8 rounded-xl flex items-center justify-center">
                  <BookOpen size={15} className="text-teal-400" />
                </div>
                <div>
                  <h2 className="pf-serif text-base font-light text-white italic tracking-tight">Add a New Book</h2>
                  <p className="text-white/30 text-[11px] mt-0.5">Share with the community</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/30 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(92vh-76px)] px-6 py-5">
              <form onSubmit={handleAddBook} className="space-y-6">

                {/* Cover Image */}
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Image size={12} className="text-teal-500" /> Cover Image
                  </p>
                  <BookCoverUpload
                    onUploadComplete={setUploadedImageUrl}
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={12} className="text-teal-500" /> Basic Information
                    </p>
                    <span className="text-[10px] text-gray-300">* Required</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Title *</label>
                      <input name="title" value={formData.title} onChange={handleFormChange} className={inputCls} placeholder="Book title" required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Author *</label>
                      <input name="author" value={formData.author} onChange={handleFormChange} className={inputCls} placeholder="Author name" required />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Genre *</label>
                        <div className="relative">
                          <select name="genre" value={formData.genre} onChange={handleFormChange} className={`${inputCls} appearance-none pr-8`} required>
                            <option value="">Select genre</option>
                            {['Fiction','Non-Fiction','Thriller','Memoir','Self-Help','Classic','Dystopian','Sci-Fi','Fantasy','Mystery','Romance','Biography','Horror','Poetry','Other'].map(g => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Condition *</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {['Like New', 'Good', 'Fair', 'Poor'].map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, condition: c })}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                                formData.condition === c
                                  ? 'bg-gray-900 text-white border-gray-900'
                                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                              }`}
                            >{c}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleFormChange} className={inputCls} placeholder="What's this book about?" rows={3} required />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={12} className="text-teal-500" /> Additional Details
                    </p>
                    <span className="text-[10px] text-gray-300">Optional</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Year', name: 'publishedYear', type: 'number', placeholder: '2024' },
                      { label: 'Pages', name: 'pages', type: 'number', placeholder: '320' },
                    ].map(f => (
                      <div key={f.name}>
                        <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{f.label}</label>
                        <input name={f.name} type={f.type} value={formData[f.name]} onChange={handleFormChange} className={inputCls} placeholder={f.placeholder} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Language</label>
                      <input name="language" value={formData.language} onChange={handleFormChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Format</label>
                      <div className="relative">
                        <select name="format" value={formData.format} onChange={handleFormChange} className={`${inputCls} appearance-none pr-8`}>
                          {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Location</label>
                      <input name="location" value={formData.location} onChange={handleFormChange} className={inputCls} placeholder="City, State" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Tags</label>
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

                {/* Footer */}
                <div className="flex gap-3 pt-3 border-t border-gray-100 -mx-6 px-6 sticky bottom-0 bg-white pb-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 h-10 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 h-10 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-200 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Adding…</>
                    ) : (
                      <><Plus size={14} />Add Book</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          Edit Profile Modal
      ══════════════════════════════════════ */}
      {showEditProfile && (
        <div
          className="fixed inset-0 bg-black/40 modal-overlay flex items-center justify-center z-50 p-4"
          onClick={() => setShowEditProfile(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 fade-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} required minLength={2} />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className={inputCls} required />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 h-10 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editSaving} className="flex-1 h-10 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 disabled:bg-gray-200 transition">{editSaving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          Edit Book Modal
      ══════════════════════════════════════ */}
      {editingBook && (
        <div
          className="fixed inset-0 bg-black/40 modal-overlay flex items-center justify-center z-50 p-4"
          onClick={() => setEditingBook(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto fade-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-900">Edit Book</h2>
              <button onClick={() => setEditingBook(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            <form onSubmit={saveBook} className="space-y-3">
              {[
                { label: 'Title',       key: 'title',       type: 'text',     required: true },
                { label: 'Author',      key: 'author',      type: 'text',     required: true },
                { label: 'Genre',       key: 'genre',       type: 'text' },
                { label: 'Description', key: 'description', type: 'textarea' },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{label}</label>
                  {type === 'textarea' ? (
                    <textarea value={editBookData[key]} onChange={e => setEditBookData({ ...editBookData, [key]: e.target.value })} className={inputCls} rows={3} />
                  ) : (
                    <input type={type} value={editBookData[key]} onChange={e => setEditBookData({ ...editBookData, [key]: e.target.value })} className={inputCls} required={required} />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Condition</label>
                <select value={editBookData.condition} onChange={e => setEditBookData({ ...editBookData, condition: e.target.value })} className={inputCls}>
                  {['Like New', 'Good', 'Fair', 'Poor'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Year',     key: 'publishedYear', type: 'number' },
                  { label: 'Pages',    key: 'pages',         type: 'number' },
                  { label: 'Language', key: 'language',      type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[11px] font-medium text-gray-500 mb-1.5">{f.label}</label>
                    <input type={f.type} value={editBookData[f.key]} onChange={e => setEditBookData({ ...editBookData, [f.key]: e.target.value })} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Format</label>
                  <select value={editBookData.format} onChange={e => setEditBookData({ ...editBookData, format: e.target.value })} className={inputCls}>
                    {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1.5">Location</label>
                <input value={editBookData.location} onChange={e => setEditBookData({ ...editBookData, location: e.target.value })} className={inputCls} />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingBook(null)} className="flex-1 h-10 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editBookSaving} className="flex-1 h-10 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 disabled:bg-gray-200 transition">{editBookSaving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          Delete Confirm Modal
      ══════════════════════════════════════ */}
      {deletingBookId && (
        <div
          className="fixed inset-0 bg-black/40 modal-overlay flex items-center justify-center z-50 p-4"
          onClick={() => setDeletingBookId(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center fade-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-11 h-11 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-400" size={18} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">Delete this book?</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">This action cannot be undone. The book will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingBookId(null)} className="flex-1 h-10 border border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => deleteBook(deletingBookId)} className="flex-1 h-10 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;