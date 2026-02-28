import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Edit3, LogOut, Plus, BookOpen, Heart, Upload, X, Trash2, RefreshCw, MapPin, Clock, CheckCircle, ArrowRight, Search, Image, Tag, FileText, Bookmark, Hash, Globe, Layers, Calendar, ChevronDown, Sparkles, TrendingUp, Mail, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition';

/* Mini profile hover card component */
const ProfileHoverCard = ({ user, stats }) => (
  <div className="absolute left-0 top-full mt-2 z-50 opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible group-hover/avatar:translate-y-0 translate-y-2 transition-all duration-300 ease-out pointer-events-none group-hover/avatar:pointer-events-auto">
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 w-72 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-16 relative">
        <div className="absolute -bottom-5 left-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center ring-2 ring-white">
            <span className="text-emerald-600 text-lg font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
        </div>
      </div>
      <div className="pt-7 pb-4 px-4">
        <h4 className="font-bold text-gray-900 text-sm">{user.name}</h4>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Mail size={10} /> {user.email}</p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Calendar size={10} /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-gray-900">{stats[0]?.value || 0}</p>
            <p className="text-[10px] text-gray-400">Books</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-gray-900">{stats[1]?.value || 0}</p>
            <p className="text-[10px] text-gray-400">Swaps</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm font-bold text-gray-900">{stats[2]?.value || 0}</p>
            <p className="text-[10px] text-gray-400">Wishlist</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  // Profile edit modal
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Book edit modal
  const [editingBook, setEditingBook] = useState(null);
  const [editBookData, setEditBookData] = useState({});
  const [editBookSaving, setEditBookSaving] = useState(false);

  // Delete confirm
  const [deletingBookId, setDeletingBookId] = useState(null);

  // Add book form
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
      // Load recent swaps
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

  // Profile edit
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

  // Book edit
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

  const stats = [
    { label: 'Books Listed', value: myBooks.length, icon: BookOpen, gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50' },
    { label: 'Swaps Done', value: recentSwaps.filter(s => s.status === 'Completed').length, icon: RefreshCw, gradient: 'from-blue-500 to-indigo-400', bg: 'bg-blue-50' },
    { label: 'Wishlist', value: wishlist.length, icon: Heart, gradient: 'from-pink-500 to-rose-400', bg: 'bg-pink-50' },
  ];

  const swapStatusColor = {
    Pending: 'text-amber-700 bg-amber-50 border border-amber-100',
    Accepted: 'text-emerald-700 bg-emerald-50 border border-emerald-100',
    Shipped: 'text-blue-700 bg-blue-50 border border-blue-100',
    'In Transit': 'text-indigo-700 bg-indigo-50 border border-indigo-100',
    Completed: 'text-gray-700 bg-gray-100 border border-gray-200',
    Declined: 'text-red-700 bg-red-50 border border-red-100',
    Cancelled: 'text-red-700 bg-red-50 border border-red-100',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {successMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {successMsg}
        </div>
      )}

      {/* Profile Header */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-400/10 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/3 right-[20%] w-3 h-3 bg-emerald-300/40 rounded-full" />
        <div className="absolute bottom-1/4 left-[15%] w-2 h-2 bg-white/30 rounded-full" />
        <div className="absolute top-6 left-[40%] w-20 h-20 bg-white/5 rounded-full blur-xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            {/* Avatar with hover card */}
            <div className="relative group/avatar">
              <div className="w-18 h-18 sm:w-22 sm:h-22 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 ring-4 ring-white/20 shadow-lg shadow-emerald-900/20 cursor-pointer hover:ring-white/40 transition-all duration-300" style={{ width: '5rem', height: '5rem' }}>
                <span className="text-white text-3xl sm:text-4xl font-bold drop-shadow-sm">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-emerald-700 flex items-center justify-center">
                <Shield size={10} className="text-white" />
              </div>
              <ProfileHoverCard user={user} stats={stats} />
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">{user.name}</h1>
              </div>
              <p className="text-emerald-100 text-sm mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start"><Mail size={13} className="opacity-70" /> {user.email}</p>
              <div className="flex items-center gap-3 mt-2 justify-center sm:justify-start">
                <span className="text-emerald-200/60 text-xs flex items-center gap-1"><Calendar size={11} /> Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span className="inline-flex items-center gap-1 bg-white/15 text-white/90 text-[10px] font-medium px-2.5 py-0.5 rounded-full"><Sparkles size={10} className="text-yellow-300" /> Active Swapper</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={openEditProfile} className="px-4 py-2.5 bg-white/15 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/25 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm">
                <Edit3 size={14} />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </button>
              <button onClick={handleLogout} className="px-3 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-red-500/30 hover:border-red-400/30 transition-all duration-200 text-sm">
                <LogOut size={14} />
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center hover:bg-white/15 transition-all duration-300 group cursor-default">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <s.icon size={18} className="text-white sm:hidden" />
                  <s.icon size={22} className="text-white hidden sm:block" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-[10px] sm:text-xs text-emerald-200/70 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Books & Wishlist */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Tabs + Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1">
                <button
                  onClick={() => setActiveTab('my-books')}
                  className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'my-books'
                      ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <BookOpen size={15} />
                  My Books
                  {myBooks.length > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'my-books' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-500'
                    }`}>{myBooks.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'wishlist'
                      ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                >
                  <Heart size={15} />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'wishlist' ? 'bg-pink-100 text-pink-600' : 'bg-gray-200 text-gray-500'
                    }`}>{wishlist.length}</span>
                  )}
                </button>
              </div>
              {activeTab === 'my-books' && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 text-sm font-semibold flex items-center gap-2 shadow-md shadow-emerald-200/50"
                >
                  <Plus size={16} />
                  Add Book
                </button>
              )}
            </div>

            {/* Book List */}
            {activeTab === 'my-books' && (
              <div className="space-y-3">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-emerald-200 border-t-emerald-600" />
                    <p className="text-sm text-gray-400">Loading your books...</p>
                  </div>
                )}

                {!loading && error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X size={14} className="text-red-500" />
                    </div>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {!loading && myBooks.length === 0 && !error && (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="text-emerald-400" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">No books yet</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Start sharing by adding your first book to the community library</p>
                    <button onClick={() => setShowAddForm(true)} className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 text-sm font-semibold inline-flex items-center gap-2 shadow-md shadow-emerald-200/50">
                      <Plus size={16} />
                      Add Your First Book
                    </button>
                  </div>
                )}

                {!loading && myBooks.map(book => (
                  <div key={book._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-lg hover:shadow-emerald-50 hover:border-emerald-100 transition-all duration-300 group">
                    <div className="flex gap-4">
                      <Link to={`/book/${book._id}`} className="flex-shrink-0">
                        <div className="w-16 h-22 sm:w-18 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm" style={{ width: '4.5rem', height: '6rem' }}>
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
                            <Link to={`/book/${book._id}`} className="font-bold text-gray-900 hover:text-emerald-600 transition-colors truncate block text-[15px]">
                              {book.title}
                            </Link>
                            <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                          </div>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button onClick={() => openEditBook(book)} className="p-2 hover:bg-emerald-50 rounded-xl transition-colors" title="Edit">
                              <Edit3 size={14} className="text-gray-400 group-hover:text-emerald-500" />
                            </button>
                            <button onClick={() => setDeletingBookId(book._id)} className="p-2 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {book.genre && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-100">{book.genre}</span>}
                          {book.condition && <span className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-100">{book.condition}</span>}
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                            book.isAvailable !== false
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-red-50 text-red-500 border border-red-100'
                          }`}>
                            {book.isAvailable !== false ? '● Available' : '● Unavailable'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="space-y-3">
                {wishlist.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Heart className="text-pink-400" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Wishlist is empty</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Browse books and save ones you love to your wishlist!</p>
                    <Link to="/browse" className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 text-sm font-semibold inline-flex items-center gap-2 shadow-md shadow-emerald-200/50">
                      <Search size={16} />
                      Browse Books
                    </Link>
                  </div>
                ) : (
                  wishlist.map(book => (
                    <div key={book._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-lg hover:shadow-pink-50 hover:border-pink-100 transition-all duration-300 group">
                      <div className="flex gap-4">
                        <Link to={`/book/${book._id}`} className="flex-shrink-0">
                          <div className="rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm" style={{ width: '4.5rem', height: '6rem' }}>
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
                              <Link to={`/book/${book._id}`} className="font-bold text-gray-900 hover:text-emerald-600 transition-colors truncate block text-[15px]">
                                {book.title}
                              </Link>
                              <p className="text-sm text-gray-500 mt-0.5">{book.author}</p>
                            </div>
                            <button
                              onClick={() => handleRemoveWishlist(book._id)}
                              className="p-2 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                              title="Remove from wishlist"
                            >
                              <Heart size={14} className="text-pink-400 fill-pink-400" />
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                            {book.genre && <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-100">{book.genre}</span>}
                            {book.condition && <span className="text-[11px] bg-gray-50 text-gray-600 px-2.5 py-0.5 rounded-full border border-gray-100">{book.condition}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            {/* Recent Swap Activity */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-lg flex items-center justify-center">
                    <TrendingUp size={14} className="text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900">Recent Activity</h3>
                </div>
                <Link to="/dashboard" className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  View All <ArrowRight size={12} />
                </Link>
              </div>

              {recentSwaps.length === 0 ? (
                <div className="text-center py-10 px-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <RefreshCw className="text-gray-300" size={22} />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No swap activity yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Start swapping to see activity here</p>
                </div>
              ) : (
                <div className="p-3 pt-4 space-y-1">
                  {recentSwaps.map(swap => (
                    <div key={swap._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-default">
                      <div className="w-10 h-13 rounded-lg overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 flex-shrink-0 shadow-sm" style={{ height: '3.25rem' }}>
                        <img
                          src={getImageUrl(swap.requestedBook?.image, swap.requestedBook?.title || 'Book')}
                          alt=""
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.src = getImageUrl(null, 'Book'); }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-700 transition-colors">{swap.requestedBook?.title || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">
                          {swap.requester?._id === user._id ? 'You requested' : 'Requested by someone'}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${swapStatusColor[swap.status] || 'text-gray-600 bg-gray-100'}`}>
                        {swap.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/browse" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <Search size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">Browse Books</p>
                    <p className="text-xs text-gray-400">Find new books to swap</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/dashboard" className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all duration-200 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <RefreshCw size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">Swap Dashboard</p>
                    <p className="text-xs text-gray-400">Manage your exchanges</p>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Add a New Book</h2>
                    <p className="text-emerald-100 text-xs">Share a book with the community</p>
                  </div>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition text-white/80 hover:text-white">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body — Scrollable */}
            <div className="overflow-y-auto max-h-[calc(92vh-80px)] px-6 py-5">
              <form onSubmit={handleAddBook} className="space-y-6">

                {/* ── Section: Cover Image ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Image size={15} className="text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Cover Image</h3>
                  </div>
                  <div className="flex items-start gap-4">
                    {/* Preview Thumbnail */}
                    <div className="w-24 h-36 rounded-xl border-2 border-gray-100 bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center">
                          <BookOpen size={24} className="text-gray-300 mx-auto" />
                          <p className="text-[9px] text-gray-400 mt-1">Preview</p>
                        </div>
                      )}
                    </div>
                    {/* Upload Area */}
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
                          } else {
                            setImagePreview(null);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-emerald-400 hover:bg-emerald-50/30 transition cursor-pointer group">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 transition-colors">
                          <Upload size={18} className="text-emerald-500" />
                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                          {imageFile ? imageFile.name : 'Click to upload cover image'}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF — max 5 MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Section: Basic Info ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={15} className="text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Basic Information</h3>
                    <span className="text-[10px] text-gray-400 ml-auto">* Required</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                      <div className="relative">
                        <Bookmark size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="title" value={formData.title} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="Enter the book title" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Author *</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="author" value={formData.author} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="Author name" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Genre *</label>
                        <div className="relative">
                          <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select name="genre" value={formData.genre} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-none bg-white" required>
                            <option value="">Select genre</option>
                            {['Fiction','Non-Fiction','Thriller','Memoir','Self-Help','Classic','Dystopian','Sci-Fi','Fantasy','Mystery','Romance','Biography','Horror','Poetry','Other'].map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Condition *</label>
                        <div className="flex gap-1.5 flex-wrap">
                          {['Like New', 'Good', 'Fair', 'Poor'].map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, condition: c })}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                                formData.condition === c
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
                      <textarea name="description" value={formData.description} onChange={handleFormChange} className={inputCls} placeholder="Tell readers what this book is about (min 10 characters)" rows={3} required />
                    </div>
                  </div>
                </div>

                {/* ── Section: Details ── */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={15} className="text-emerald-600" />
                    <h3 className="text-sm font-semibold text-gray-800">Additional Details</h3>
                    <span className="text-[10px] text-gray-400 ml-auto">Optional</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="publishedYear" type="number" value={formData.publishedYear} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-2 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="2024" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Pages</label>
                      <div className="relative">
                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="pages" type="number" value={formData.pages} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-2 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="320" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Language</label>
                      <div className="relative">
                        <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="language" value={formData.language} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-2 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Format</label>
                      <div className="relative">
                        <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select name="format" value={formData.format} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition appearance-none bg-white">
                          {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="location" value={formData.location} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="City, State" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tags</label>
                      <div className="relative">
                        <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input name="tags" value={formData.tags} onChange={handleFormChange} className="w-full border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" placeholder="fiction, classic, adventure" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <X size={12} className="text-red-500" />
                    </div>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1 pb-1 border-t border-gray-100 -mx-6 px-6 sticky bottom-0 bg-white">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-200">
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                    ) : (
                      <><Plus size={16} /> Add Book</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowEditProfile(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)} className={inputCls} required minLength={2} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className={inputCls} required />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEditProfile(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editSaving} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-300 transition">{editSaving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {editingBook && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingBook(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Edit Book</h2>
              <button onClick={() => setEditingBook(null)} className="p-1 hover:bg-gray-100 rounded-lg transition"><X size={18} /></button>
            </div>
            <form onSubmit={saveBook} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input value={editBookData.title} onChange={e => setEditBookData({ ...editBookData, title: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Author</label>
                <input value={editBookData.author} onChange={e => setEditBookData({ ...editBookData, author: e.target.value })} className={inputCls} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Genre</label>
                <input value={editBookData.genre} onChange={e => setEditBookData({ ...editBookData, genre: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                <select value={editBookData.condition} onChange={e => setEditBookData({ ...editBookData, condition: e.target.value })} className={inputCls}>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editBookData.description} onChange={e => setEditBookData({ ...editBookData, description: e.target.value })} className={inputCls} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                  <input type="number" value={editBookData.publishedYear} onChange={e => setEditBookData({ ...editBookData, publishedYear: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Format</label>
                  <select value={editBookData.format} onChange={e => setEditBookData({ ...editBookData, format: e.target.value })} className={inputCls}>
                    {['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pages</label>
                  <input type="number" value={editBookData.pages} onChange={e => setEditBookData({ ...editBookData, pages: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Language</label>
                  <input value={editBookData.language} onChange={e => setEditBookData({ ...editBookData, language: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <input value={editBookData.location} onChange={e => setEditBookData({ ...editBookData, location: e.target.value })} className={inputCls} />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setEditingBook(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={editBookSaving} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-300 transition">{editBookSaving ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBookId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeletingBookId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-6 text-center animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-500" size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Book?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The book will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingBookId(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
              <button onClick={() => deleteBook(deletingBookId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
