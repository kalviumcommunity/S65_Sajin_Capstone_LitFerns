import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen, Sparkles, Filter, X, Star, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const genres = ['Fiction', 'Non-Fiction', 'Thriller', 'Memoir', 'Self-Help', 'Classic', 'Dystopian', 'Sci-Fi', 'Fantasy', 'Mystery'];
const conditions = ['Like New', 'Good', 'Fair', 'Poor'];
const formats = ['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'];

const BrowsePage = () => {
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [condition, setCondition] = useState('');
  const [format, setFormat] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const fetchBooks = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = { page: pageNum, limit: 12, sort };
      if (query.trim()) params.q = query.trim();
      if (selectedGenres.length === 1) params.genre = selectedGenres[0];
      if (condition) params.condition = condition;
      if (format) params.format = format;
      if (availableOnly) params.available = true;

      const { data } = await axios.get('/api/books', { params });
      const payload = Array.isArray(data) ? { books: data, page: 1, pages: 1, total: data.length } : data;
      let bookList = payload.books || [];
      // Client-side multi-genre filter
      if (selectedGenres.length > 1) {
        bookList = bookList.filter(b => selectedGenres.includes(b.genre));
      }
      setBooks(bookList);
      setPage(payload.page || 1);
      setPages(payload.pages || 1);
      setTotal(payload.total || bookList.length);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres, condition, format, availableOnly, sort]);

  const debouncedFetch = useMemo(() => {
    let handle;
    return () => { clearTimeout(handle); handle = setTimeout(() => fetchBooks(1), 350); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { debouncedFetch(); }, [query, debouncedFetch]);

  const handlePageChange = (next) => {
    const target = Math.min(Math.max(next, 1), pages);
    if (target !== page) fetchBooks(target);
  };

  const toggleGenre = (g) => {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 opacity-30">
          <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        {/* Decorative floating shapes */}
        <div className="absolute top-6 left-[10%] w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-4 right-[15%] w-32 h-32 bg-teal-300/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-[5%] w-2 h-2 bg-white/40 rounded-full" />
        <div className="absolute top-[30%] right-[8%] w-3 h-3 bg-emerald-300/50 rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-5">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-white/90 text-xs font-medium tracking-wide">Browse {total > 0 ? `${total}+` : ''} books available for swap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
            Discover Your Next
            <span className="block bg-gradient-to-r from-yellow-200 via-amber-200 to-yellow-300 bg-clip-text text-transparent mt-1">Great Read</span>
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto mb-8">
            Search through our community library and find the perfect book to swap
          </p>
          <form onSubmit={(e) => { e.preventDefault(); fetchBooks(1); }} className="max-w-xl mx-auto">
            <div className="relative flex bg-white rounded-2xl shadow-xl shadow-emerald-900/20 overflow-hidden">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search by title, author, or genre..."
                className="flex-1 pl-12 pr-4 py-3.5 sm:py-4 border-0 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder-gray-400"
              />
              <button type="submit" className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 sm:px-7 text-sm font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 flex items-center gap-2 whitespace-nowrap">
                <Search size={16} className="hidden sm:block" />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl px-5 py-3 text-sm font-semibold text-emerald-700 mb-5 shadow-sm w-full justify-center hover:from-emerald-100 hover:to-teal-100 transition-all duration-200"
        >
          {showFilters ? <X size={16} /> : <Filter size={16} />}
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {(selectedGenres.length > 0 || condition || format || availableOnly) && (
            <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-1">
              {selectedGenres.length + (condition ? 1 : 0) + (format ? 1 : 0) + (availableOnly ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className={`w-full md:w-60 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 sticky top-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <SlidersHorizontal className="text-emerald-600" size={15} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">Filters</h3>
                </div>
                {(selectedGenres.length > 0 || condition || format || availableOnly) && (
                  <button
                    onClick={() => { setSelectedGenres([]); setCondition(''); setFormat(''); setAvailableOnly(false); }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Genre</h4>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedGenres.includes(g)
                          ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Condition</h4>
                <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition">
                  <option value="">Any condition</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Format</h4>
                <select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition">
                  <option value="">Any format</option>
                  {formats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sort By</h4>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Top Rated</option>
                  <option value="title">Title A-Z</option>
                </select>
              </div>

              <div className="h-px bg-gray-100" />

              <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </div>
                <span className="group-hover:text-emerald-600 transition font-medium">Available only</span>
              </label>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Browse All Books
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{total} book{total !== 1 ? 's' : ''} available in the library</p>
              </div>
              {(selectedGenres.length > 0 || condition || format) && (
                <div className="hidden md:flex items-center gap-2 flex-wrap">
                  {selectedGenres.map(g => (
                    <span key={g} className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {g}
                      <button onClick={() => toggleGenre(g)} className="hover:text-emerald-900"><X size={12} /></button>
                    </span>
                  ))}
                  {condition && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {condition}
                      <button onClick={() => setCondition('')} className="hover:text-blue-900"><X size={12} /></button>
                    </span>
                  )}
                  {format && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {format}
                      <button onClick={() => setFormat('')} className="hover:text-purple-900"><X size={12} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="relative">
                  <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-emerald-200 border-t-emerald-600" />
                </div>
                <p className="text-sm text-gray-400">Loading books...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {!loading && books.length === 0 && !error && (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-gray-400" size={28} />
                </div>
                <p className="text-lg font-semibold text-gray-700 mb-1">No books found</p>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Try adjusting your filters or search terms to discover more books</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {books.map(book => (
                <Link key={book._id} to={`/book/${book._id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:shadow-emerald-100/50 hover:border-emerald-200/60 transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-[2/3] overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center relative">
                      <img
                        src={getImageUrl(book.image, book.title)}
                        alt={book.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                      />
                      {book.available !== false && (
                        <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                          Available
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">{book.title}</h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{book.author}</p>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-gray-50">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">{book.genre}</span>
                        {book.condition && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">{book.condition}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 mb-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-200"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        p === page
                          ? 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-200'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="p-2.5 rounded-xl border border-gray-200 bg-white disabled:opacity-40 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all duration-200"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;
