import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, RefreshCw, Users, ArrowRight, Leaf, Star, Shield, Globe, Heart, ChevronRight, BookMarked, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import axios from 'axios';

/* ─── Inline styles for custom fonts + animations ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .font-display { font-family: 'Playfair Display', Georgia, serif; }
  .font-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes scrollMarquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .anim-fade-up   { animation: fadeUp  0.7s cubic-bezier(.22,1,.36,1) both; }
  .anim-fade-in   { animation: fadeIn  0.6s ease both; }
  .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(.22,1,.36,1) both; }
  .anim-float     { animation: float 4s ease-in-out infinite; }

  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .delay-400 { animation-delay: 400ms; }
  .delay-500 { animation-delay: 500ms; }
  .delay-600 { animation-delay: 600ms; }

  .marquee-track { animation: scrollMarquee 28s linear infinite; }
  .marquee-track:hover { animation-play-state: paused; }

  .shimmer-text {
    background: linear-gradient(90deg, #064e3b 0%, #10b981 40%, #064e3b 60%, #10b981 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 5s linear infinite;
  }

  .grain-overlay::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  .book-card:hover .book-shine {
    opacity: 1;
    transform: translateX(100%);
  }
  .book-shine {
    opacity: 0;
    transform: translateX(-100%);
    transition: opacity 0.4s, transform 0.5s;
  }

  .rule-divider {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .rule-divider::before,
  .rule-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.15;
  }

  .hero-bg-image {
    background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1800&q=85');
    background-size: cover;
    background-position: center 30%;
  }
`;

/* ─── Marquee genres ─── */
const GENRES = ['Fiction','Non-Fiction','Thriller','Memoir','Self-Help','Classic','Dystopian','Sci-Fi','Fantasy','Mystery','Romance','Biography','Horror','Poetry','Philosophy','History','Travel'];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { name: 'Sarah M.', text: 'I\'ve discovered so many incredible books through LitFerns. The community here is warm, generous, and genuinely passionate about reading.', avatar: 'S', role: 'Avid Reader', rating: 5 },
  { name: 'James K.', text: 'The swap process is seamless. In a matter of days, a book I\'d finished was replaced by something I\'d been craving for months.', avatar: 'J', role: 'Book Collector', rating: 5 },
  { name: 'Emily R.', text: 'Sustainable, free, and full of wonderful people. LitFerns changed how I think about owning — and sharing — books.', avatar: 'E', role: 'Eco Reader', rating: 5 },
];

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

  return (
    <div className="font-body overflow-hidden bg-white">
      <style>{globalStyles}</style>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center grain-overlay overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-bg-image" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#021a0f]/92 via-[#021a0f]/75 to-[#021a0f]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021a0f]/60 via-transparent to-transparent" />

        {/* Vertical rule decorations */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-white/5 hidden lg:block" />
        <div className="absolute left-16 top-0 bottom-0 w-px bg-white/3 hidden lg:block" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-32">
          <div className="max-w-3xl">

            {/* Eyebrow */}
            <div className="anim-fade-up flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-emerald-400" />
              <span className="text-emerald-400 text-xs font-medium tracking-[0.2em] uppercase">Free Book Swapping</span>
            </div>

            {/* Headline */}
            <h1 className="font-display anim-fade-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Every Book<br />
              <span className="italic font-normal text-emerald-300">Deserves</span><br />
              A New Reader.
            </h1>

            {/* Sub */}
            <p className="anim-fade-up delay-200 text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mb-10 font-light">
              A curated community where readers swap stories, discover hidden gems, and keep books alive — completely free.
            </p>

            {/* CTA area */}
            {user ? (
              <form onSubmit={handleSearch} className="anim-fade-up delay-300 flex max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search title, author, genre…"
                    className="w-full py-4 pl-11 pr-4 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/95 text-gray-900 placeholder-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-r-xl text-sm font-semibold transition-colors whitespace-nowrap">
                  Search
                </button>
              </form>
            ) : (
              <div className="anim-fade-up delay-300 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  className="group bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-900/30"
                >
                  Start Swapping Free
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border border-white/20 text-white/80 hover:text-white hover:border-white/40 px-8 py-4 rounded-xl font-medium text-sm inline-flex items-center justify-center transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Trust strip */}
            <div className="anim-fade-up delay-400 flex flex-wrap items-center gap-6 mt-10">
              {[
                { icon: Shield, label: 'Secure & Private' },
                { icon: Leaf,   label: 'Eco Friendly' },
                { icon: Heart,  label: '100% Free Forever' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-white/40">
                  <Icon size={13} />
                  <span className="text-xs tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat cards — right side */}
          
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════
          GENRE MARQUEE
      ═══════════════════════════════════════════ */}
      <section className="py-5 bg-[#021a0f] overflow-hidden">
        <div className="flex whitespace-nowrap marquee-track select-none">
          {[...GENRES, ...GENRES].map((g, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6">
              <span className="font-display italic text-white/40 text-sm">{g}</span>
              <span className="text-emerald-700 text-[10px]">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — editorial 3-col
      ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Section header */}
          <div className="mb-16 sm:mb-20">
            <div className="rule-divider text-gray-300 mb-8">
              <span className="font-display italic text-gray-400 text-sm px-4">How It Works</span>
            </div>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Three steps to your<br /><span className="italic font-normal text-emerald-600">next great read</span>
              </h2>
              <p className="text-gray-500 text-base leading-relaxed">No fees. No complicated process. Just books changing hands.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 md:gap-0 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-[calc(16.67%+1px)] right-[calc(16.67%+1px)] h-px bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200" />

            {[
              { icon: BookOpen, title: 'List Your Books', desc: 'Add books you\'ve finished with a photo and short description. Takes under two minutes.', step: '01', accent: 'text-emerald-600' },
              { icon: Search,   title: 'Discover & Request', desc: 'Browse the library, find something you love, and send the owner a swap request.', step: '02', accent: 'text-emerald-600' },
              { icon: Users,    title: 'Exchange & Enjoy', desc: 'Confirm the trade, ship the book, and dive into your new read.', step: '03', accent: 'text-emerald-600' },
            ].map(({ icon: Icon, title, desc, step, accent }, i) => (
              <div key={i} className="relative text-center px-6 sm:px-10 py-10 group">
                {/* Step circle */}
                <div className="relative inline-flex mb-8">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-emerald-200 group-hover:border-emerald-500 flex items-center justify-center transition-colors duration-300 relative z-10 shadow-sm">
                    <Icon size={22} className={`${accent} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#021a0f] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{step}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED BOOKS — logged-in
      ═══════════════════════════════════════════ */}
      {user && featuredBooks.length > 0 && (
        <section className="py-24 sm:py-32 bg-[#f8f7f4]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-emerald-600 text-xs font-medium tracking-[0.18em] uppercase mb-3">Fresh Additions</p>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                  Recently Listed
                </h2>
              </div>
              <Link to="/browse" className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
                Browse All
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {featuredBooks.map((book, i) => (
                <Link
                  key={book._id}
                  to={`/book/${book._id}`}
                  className="group book-card anim-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 relative">
                      <img
                        src={getImageUrl(book.image, book.title)}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                        onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                      />
                      {/* Shine effect */}
                      <div className="book-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-[13px] font-semibold text-gray-900 truncate leading-snug">{book.title}</h3>
                      <p className="text-[11px] text-gray-400 truncate mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        {book.genre && (
                          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            {book.genre}
                          </span>
                        )}
                        {book.condition && (
                          <span className="text-[10px] text-gray-400">{book.condition}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="sm:hidden text-center mt-8">
              <Link to="/browse" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors">
                Browse All Books <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          TEASER — guests only
      ═══════════════════════════════════════════ */}
      {!user && featuredBooks.length > 0 && (
        <section className="py-24 sm:py-32 bg-[#f8f7f4]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <p className="text-emerald-600 text-xs font-medium tracking-[0.18em] uppercase mb-3">The Library</p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Books Waiting For You</h2>
              <p className="text-gray-500 text-base max-w-md mx-auto">Sign up to unlock the full collection and start swapping.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {featuredBooks.slice(0, 4).map((book, i) => (
                <div key={book._id} className={`group relative anim-fade-up delay-${(i+1)*100}`}>
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                    <div className="aspect-[2/3] overflow-hidden bg-gray-50 relative">
                      <img
                        src={getImageUrl(book.image, book.title)}
                        alt={book.title}
                        className="w-full h-full object-contain blur-[3px] scale-105"
                      />
                      <div className="absolute inset-0 bg-[#021a0f]/40 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                          <Shield size={14} className="text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="h-3 bg-gray-200 rounded-full mb-1.5 w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 bg-[#021a0f] hover:bg-emerald-900 text-white px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-black/20"
              >
                Unlock the Library
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════
          STATS — editorial counter strip
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-[#021a0f] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {[
              { value: stats.totalBooks || 0,     suffix: '+', label: 'Books\nListed' },
              { value: stats.totalUsers || 0,     suffix: '+', label: 'Active\nReaders' },
              { value: stats.completedSwaps || 0, suffix: '+', label: 'Swaps\nCompleted' },
            ].map(({ value, suffix, label }, i) => (
              <div key={i} className="text-center px-6 py-4">
                <p className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-none">
                  {value}<span className="text-emerald-400">{suffix}</span>
                </p>
                <p className="text-white/40 text-xs sm:text-sm mt-3 font-light whitespace-pre-line leading-relaxed tracking-wide uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY LITFERNS — asymmetric feature cards
      ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-16 text-center">
            <div className="rule-divider text-gray-300 mb-8">
              <span className="font-display italic text-gray-400 text-sm px-4">Why LitFerns</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Built for readers,<br /><span className="italic font-normal text-emerald-600">by readers</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Search, title: 'Discover New Reads', desc: 'Curated by real readers who know what makes a great book.', bg: 'bg-emerald-50 border-emerald-100', iconBg: 'bg-emerald-600', hover: 'hover:border-emerald-300 hover:shadow-emerald-50' },
              { icon: Leaf,   title: 'Sustainable', desc: 'Every swap is one less book thrown away and one less tree cut down.', bg: 'bg-[#f0fdf4] border-green-100', iconBg: 'bg-green-700', hover: 'hover:border-green-300 hover:shadow-green-50' },
              { icon: Globe,  title: 'Global Community', desc: 'Connect with readers across cities, countries, and cultures.', bg: 'bg-teal-50 border-teal-100', iconBg: 'bg-teal-700', hover: 'hover:border-teal-300 hover:shadow-teal-50' },
              { icon: Shield, title: 'Safe & Trusted', desc: 'Your data and transactions are always secure and private.', bg: 'bg-slate-50 border-slate-100', iconBg: 'bg-slate-800', hover: 'hover:border-slate-300 hover:shadow-slate-50' },
            ].map(({ icon: Icon, title, desc, bg, iconBg, hover }, i) => (
              <div key={i} className={`${bg} border rounded-2xl p-6 sm:p-7 ${hover} hover:shadow-xl transition-all duration-300 group`}>
                <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={19} className="text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS — magazine pull-quote style
      ═══════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[#f8f7f4]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-14 text-center">
            <p className="text-emerald-600 text-xs font-medium tracking-[0.18em] uppercase mb-3">Reader Stories</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900">
              What readers <span className="italic font-normal">love</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className={`bg-white rounded-2xl p-7 sm:p-8 border border-gray-100 hover:shadow-lg transition-all duration-300 relative anim-fade-up delay-${(i+1)*100}`}>
                {/* Large opening quote */}
                <div className="font-display text-7xl text-emerald-100 leading-none select-none mb-2">"</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-7 -mt-5">{t.text}</p>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#021a0f] flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-white text-sm font-bold italic">{t.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.role}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA — full-bleed dark
      ═══════════════════════════════════════════ */}
      <section className="relative bg-[#021a0f] py-24 sm:py-32 overflow-hidden grain-overlay">
        {/* Decorative circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-white/8" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-emerald-500 text-xs font-medium tracking-[0.2em] uppercase mb-5">Ready?</p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6">
            Your next favourite<br /><span className="italic font-normal text-emerald-400">book is waiting.</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-md mx-auto leading-relaxed font-light">
            Join our community of readers today. Free forever, no catches, no credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {user ? (
              <Link
                to="/browse"
                className="group bg-emerald-500 hover:bg-emerald-400 text-white px-10 py-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all duration-200"
              >
                Browse Books <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group bg-white hover:bg-gray-50 text-[#021a0f] px-10 py-4 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-black/30"
                >
                  Create Free Account
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border border-white/15 hover:border-white/30 text-white/70 hover:text-white px-10 py-4 rounded-xl font-medium text-sm inline-flex items-center justify-center transition-all duration-200"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Bottom trust row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
            {[
              { icon: Shield, label: 'Secure & Private' },
              { icon: Leaf,   label: 'Eco Friendly' },
              { icon: Heart,  label: '100% Free' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/25">
                <Icon size={12} />
                <span className="text-xs tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;