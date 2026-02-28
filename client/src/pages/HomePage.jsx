import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, RefreshCw, Users, ArrowRight, Leaf, Star, Quote, Shield, Sparkles, Globe, Heart, ChevronRight, BookMarked } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import axios from 'axios';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, completedSwaps: 0 });
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, booksRes] = await Promise.all([
          axios.get('/api/swaps/stats').catch(() => ({ data: {} })),
          axios.get('/api/books', { params: { limit: 8, sort: 'newest' } }).catch(() => ({ data: { books: [] } })),
        ]);
        setStats(statsRes.data || {});
        const books = booksRes.data?.books || (Array.isArray(booksRes.data) ? booksRes.data : []);
        setFeaturedBooks(books.slice(0, 8));
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    navigate(searchQuery.trim() ? `/browse?q=${encodeURIComponent(searchQuery.trim())}` : '/browse');
  };

  const testimonials = [
    { name: 'Sarah M.', text: 'LitFerns is absolutely amazing. I\'ve discovered so many new books through this platform that I never would have found otherwise.', avatar: 'S', role: 'Avid Reader' },
    { name: 'James K.', text: 'The swapping process is so smooth and the community is incredibly friendly. I\'ve made real connections with fellow book lovers.', avatar: 'J', role: 'Book Collector' },
    { name: 'Emily R.', text: 'I love how sustainable this is. Instead of buying new books, I swap ones I\'ve read for fresh stories. It\'s a win-win!', avatar: 'E', role: 'Eco Reader' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] sm:min-h-[80vh] flex items-center bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-95">
            <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-emerald-800/60 to-teal-700/55" />
          {/* Decorative floating shapes */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-300/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-cyan-300/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-400/15 border border-emerald-300/25 rounded-full px-4 py-1.5 mb-6">
                <Sparkles size={14} className="text-emerald-200" />
                <span className="text-emerald-100 text-xs sm:text-sm font-medium">Free Book Swapping Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Share Stories,
                <span className="block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                  Exchange Dreams
                </span>
              </h1>
              <p className="text-base sm:text-lg text-emerald-100/80 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join a growing community of book lovers. Swap books you have read for ones you have been craving — it is free, simple, and sustainable.
              </p>

              {/* Search bar for logged-in users */}
              {user ? (
                <form onSubmit={handleSearch} className="flex max-w-md mx-auto lg:mx-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search by title, author, genre..."
                      className="w-full py-3.5 pl-11 pr-4 rounded-l-xl border-0 text-sm focus:ring-2 focus:ring-emerald-400 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="bg-emerald-600 text-white px-6 py-3.5 rounded-r-xl hover:bg-emerald-500 transition text-sm font-semibold whitespace-nowrap">
                    Search
                  </button>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link to="/login" className="group bg-white text-emerald-700 px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30">
                    Get Started Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="border-2 border-white/25 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all font-semibold text-sm inline-flex items-center justify-center gap-2">
                    Sign In
                  </Link>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8 justify-center lg:justify-start">
                <div className="flex items-center gap-1.5 text-emerald-200/70">
                  <Shield size={14} />
                  <span className="text-xs">Secure & Private</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-200/70">
                  <Leaf size={14} />
                  <span className="text-xs">Eco Friendly</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-200/70">
                  <Heart size={14} />
                  <span className="text-xs">100% Free</span>
                </div>
              </div>
            </div>

            {/* Right: Visual element - floating book cards */}
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-80 h-96">
                {/* Background card */}
                <div className="absolute top-4 left-8 w-52 h-72 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-2xl border border-emerald-400/20 backdrop-blur-sm rotate-6" />
                {/* Middle card */}
                <div className="absolute top-0 left-4 w-52 h-72 bg-gradient-to-br from-emerald-500/25 to-teal-500/15 rounded-2xl border border-emerald-400/25 backdrop-blur-sm -rotate-3" />
                {/* Front card */}
                <div className="absolute top-2 left-12 w-52 h-72 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md p-5 flex flex-col items-center justify-center text-center rotate-2 shadow-2xl">
                  <div className="w-16 h-16 bg-emerald-400/20 rounded-2xl flex items-center justify-center mb-4">
                    <BookMarked size={32} className="text-emerald-200" />
                  </div>
                  <p className="text-white font-bold text-lg mb-1">Swap Books</p>
                  <p className="text-emerald-200/70 text-xs leading-relaxed">Give your books a new home and discover your next favorite read</p>
                </div>
                {/* Floating stat bubbles */}
                <div className="absolute -top-2 -right-4 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2.5 shadow-lg">
                  <p className="text-white font-bold text-lg">{stats.totalBooks || '50'}+</p>
                  <p className="text-emerald-200/70 text-[10px]">Books Listed</p>
                </div>
                <div className="absolute -bottom-2 -left-4 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 px-4 py-2.5 shadow-lg">
                  <p className="text-white font-bold text-lg">{stats.totalUsers || '25'}+</p>
                  <p className="text-emerald-200/70 text-[10px]">Active Readers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 mb-4">
              <RefreshCw size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Simple Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">Three simple steps to start swapping books with readers around you</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {[
              { icon: BookOpen, title: 'List Your Book', desc: 'Add books you are willing to swap with photos and details', color: 'from-emerald-500 to-emerald-600', step: '01' },
              { icon: Search, title: 'Discover & Request', desc: 'Browse available books and send swap requests to owners', color: 'from-teal-500 to-teal-600', step: '02' },
              { icon: Users, title: 'Connect & Share', desc: 'Complete the exchange and enjoy your new read', color: 'from-cyan-500 to-cyan-600', step: '03' },
            ].map(({ icon: Icon, title, desc, color, step }, i) => (
              <div key={i} className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 text-center">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">{step}</span>
                </div>
                <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED BOOKS (Only for logged-in users) ===== */}
      {user && featuredBooks.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Books</h2>
                <p className="text-gray-500 text-sm mt-1">Recently added by the community</p>
              </div>
              <Link to="/browse" className="text-emerald-600 text-sm font-medium hover:text-emerald-700 transition flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredBooks.map(book => (
                <Link key={book._id} to={`/book/${book._id}`} className="group">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={getImageUrl(book.image, book.title)}
                        alt={book.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{book.title}</h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{book.genre}</span>
                        {book.condition && <span className="text-[10px] text-gray-400">{book.condition}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/browse" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm font-medium">
                Browse All Books <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== BOOK PREVIEW (for guests — show a teaser) ===== */}
      {!user && featuredBooks.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Books Waiting For You</h2>
              <p className="text-gray-500 text-sm sm:text-base">Sign up to discover and swap these amazing reads</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredBooks.slice(0, 4).map(book => (
                <div key={book._id} className="group relative">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 relative flex items-center justify-center">
                      <img
                        src={getImageUrl(book.image, book.title)}
                        alt={book.title}
                        className="w-full h-full object-contain blur-[2px] group-hover:blur-[1px] transition-all duration-300"
                        onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{book.title}</h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/login" className="group inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition text-sm font-semibold shadow-lg shadow-emerald-600/25">
                Sign Up to Browse All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== COMMUNITY STATS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Our Vibrant Community</h2>
            <p className="text-gray-500 text-sm sm:text-base">Readers sharing the love of books every day</p>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
            {[
              { value: stats.totalBooks || 0, label: 'Books Listed', icon: BookOpen },
              { value: stats.totalUsers || 0, label: 'Active Readers', icon: Users },
              { value: stats.completedSwaps || 0, label: 'Swaps Done', icon: RefreshCw },
            ].map(({ value, label, icon: Icon }, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 border border-emerald-100">
                  <Icon size={20} className="text-emerald-600 sm:hidden" />
                  <span className="text-xl sm:text-2xl font-bold text-emerald-700 hidden sm:block">{value}</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-gray-900 sm:hidden">{value}</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY LITFERNS ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-1.5 mb-4">
              <Leaf size={14} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Why LitFerns?</h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">More than just a book exchange — a community built on the love of reading</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {[
              { icon: Search, title: 'Discover New Reads', desc: 'Find books you would never have discovered from fellow readers.', accent: 'border-emerald-200 hover:border-emerald-400' },
              { icon: Leaf, title: 'Sustainable Reading', desc: 'Reduce waste by sharing. Give your books a second life.', accent: 'border-teal-200 hover:border-teal-400' },
              { icon: Globe, title: 'Global Community', desc: 'Connect with book lovers from all around the world.', accent: 'border-cyan-200 hover:border-cyan-400' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Your data is protected. Swap with confidence and peace of mind.', accent: 'border-blue-200 hover:border-blue-400' },
            ].map(({ icon: Icon, title, desc, accent }, i) => (
              <div key={i} className={`bg-white p-5 sm:p-6 rounded-2xl border-2 ${accent} hover:shadow-lg transition-all duration-300 text-center group`}>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-100 transition-colors">
                  <Icon className="text-emerald-600" size={22} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What Our Readers Say</h2>
            <p className="text-gray-500 text-sm sm:text-base">Hear from our growing community of book lovers</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-2xl p-5 sm:p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
                <Quote className="text-emerald-400 mb-3" size={24} />
                <p className="text-sm text-gray-600 leading-relaxed mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} className="text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 py-16 sm:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Next Chapter?
          </h2>
          <p className="text-emerald-100/80 mb-8 sm:mb-10 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Join our community and start swapping books with readers near you. It is completely free and takes only a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {user ? (
              <Link to="/browse" className="group bg-white text-emerald-700 px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg">
                Browse Books <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="group bg-white text-emerald-700 px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all font-bold text-sm inline-flex items-center justify-center gap-2 shadow-lg">
                  Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="border-2 border-white/30 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all font-semibold text-sm inline-flex items-center justify-center">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
