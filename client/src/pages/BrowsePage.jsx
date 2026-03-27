import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookOpen, Filter, X } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';

const genres = ['Fiction', 'Non-Fiction', 'Thriller', 'Memoir', 'Self-Help', 'Classic', 'Dystopian', 'Sci-Fi', 'Fantasy', 'Mystery'];
const conditions = ['Like New', 'Good', 'Fair', 'Poor'];
const formats = ['Hardcover', 'Paperback', 'Ebook', 'Audiobook', 'Other'];

const browseStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .browse-display { font-family: 'Playfair Display', Georgia, serif; }
  .browse-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes bFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .b-fade-up { animation: bFadeUp 0.5s cubic-bezier(.22,1,.36,1) both; }
  .b-delay-1 { animation-delay: 60ms; }
  .b-delay-2 { animation-delay: 120ms; }
  .b-delay-3 { animation-delay: 180ms; }
  .b-delay-4 { animation-delay: 240ms; }

  .book-shine { opacity: 0; transform: translateX(-100%) skewX(-12deg); transition: opacity 0.3s, transform 0.4s; }
  .book-card:hover .book-shine { opacity: 1; transform: translateX(200%) skewX(-12deg); }
`;

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

  const activeFilterCount = selectedGenres.length + (condition ? 1 : 0) + (format ? 1 : 0) + (availableOnly ? 1 : 0);

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

  useEffect(() => { fetchBooks(1); }, [selectedGenres, condition, format, availableOnly, sort]);

  const debouncedFetch = useMemo(() => {
    let handle;
    return () => { clearTimeout(handle); handle = setTimeout(() => fetchBooks(1), 350); };
  }, []);

  useEffect(() => { debouncedFetch(); }, [query, debouncedFetch]);

  const handlePageChange = (next) => {
    const target = Math.min(Math.max(next, 1), pages);
    if (target !== page) fetchBooks(target);
  };

  const toggleGenre = (g) => {
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const clearAll = () => {
    setSelectedGenres([]);
    setCondition('');
    setFormat('');
    setAvailableOnly(false);
  };

  return (
    <div className="browse-body min-h-screen bg-[#f8f7f4]">
      <style>{browseStyles}</style>

      {/* ── Page Header ── */}
      <div className="relative overflow-hidden">
        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80')" }}
        />
        {/* Dark overlay — heavier on left so text is legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#021a0f]/88 via-[#021a0f]/65 to-[#021a0f]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#021a0f]/50 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-5 h-px bg-emerald-400" />
              <p className="text-emerald-400 text-xs font-medium tracking-[0.18em] uppercase">The Library</p>
            </div>
            <h1 className="browse-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Discover Your<br />
              <span className="italic font-normal text-emerald-300">Next Great Read</span>
            </h1>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
              Browse {total > 0 ? `${total} books` : 'our collection'} available for swap from readers in the community.
            </p>

            {/* Search */}
            <form onSubmit={(e) => { e.preventDefault(); fetchBooks(1); }} className="flex max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Title, author, genre…"
                  className="w-full pl-11 pr-4 py-3.5 border-0 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 rounded-r-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8">

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-medium text-gray-700 mb-5 w-full hover:bg-gray-50 transition-colors"
        >
          {showFilters ? <X size={15} /> : <Filter size={15} />}
          {showFilters ? 'Hide Filters' : 'Filters'}
          {activeFilterCount > 0 && (
            <span className="bg-[#021a0f] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">

          {/* ── Sidebar ── */}
          <aside className={`w-full md:w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5 sticky top-24">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll} className="text-[11px] text-gray-400 hover:text-red-500 font-medium transition-colors">
                    Clear
                  </button>
                )}
              </div>

              <div className="h-px bg-gray-100" />

              {/* Genre */}
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Genre</h4>
                <div className="flex flex-wrap gap-1.5">
                  {genres.map(g => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors duration-150 ${
                        selectedGenres.includes(g)
                          ? 'bg-[#021a0f] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Condition */}
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Condition</h4>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-700"
                >
                  <option value="">Any condition</option>
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Format */}
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Format</h4>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-700"
                >
                  <option value="">Any format</option>
                  {formats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Sort */}
              <div>
                <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Sort By</h4>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition text-gray-700"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Top Rated</option>
                  <option value="title">Title A–Z</option>
                </select>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Available only */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">Available only</span>
              </label>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {total} book{total !== 1 ? 's' : ''} found
                </h2>
              </div>
              {/* Active filter chips */}
              {(selectedGenres.length > 0 || condition || format) && (
                <div className="hidden md:flex items-center gap-2 flex-wrap justify-end">
                  {selectedGenres.map(g => (
                    <span key={g} className="inline-flex items-center gap-1.5 bg-[#021a0f] text-white text-[10px] font-medium px-2.5 py-1 rounded-lg">
                      {g}
                      <button onClick={() => toggleGenre(g)} className="hover:text-white/70 transition-colors"><X size={10} /></button>
                    </span>
                  ))}
                  {condition && (
                    <span className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg">
                      {condition}
                      <button onClick={() => setCondition('')} className="hover:text-white/70"><X size={10} /></button>
                    </span>
                  )}
                  {format && (
                    <span className="inline-flex items-center gap-1.5 bg-gray-800 text-white text-[10px] font-medium px-2.5 py-1 rounded-lg">
                      {format}
                      <button onClick={() => setFormat('')} className="hover:text-white/70"><X size={10} /></button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-[#021a0f]" />
                <p className="text-xs text-gray-400">Loading books…</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && books.length === 0 && !error && (
              <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-gray-400" size={22} />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">No books found</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">Try adjusting your filters or search terms</p>
              </div>
            )}

            {/* Grid */}
            {!loading && books.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {books.map((book, i) => (
                  <Link
                    key={book._id}
                    to={`/book/${book._id}`}
                    className={`group book-card b-fade-up b-delay-${Math.min((i % 4) + 1, 4)}`}
                  >
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-250">
                      {/* Cover */}
                      <div className="aspect-[2/3] overflow-hidden bg-[#f8f7f4] relative">
                        <img
                          src={getImageUrl(book.image, book.title)}
                          alt={book.title}
                          className="w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-400"
                          onError={(e) => { e.target.src = getImageUrl(null, book.title); }}
                        />
                        {/* Shine sweep */}
                        <div className="book-shine absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                        {/* Available badge */}
                        {book.available !== false && (
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-emerald-700 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                            Available
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div className="p-3">
                        <h3 className="text-[13px] font-semibold text-gray-900 truncate leading-snug group-hover:text-emerald-700 transition-colors duration-150">
                          {book.title}
                        </h3>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{book.author}</p>
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-50">
                          {book.genre ? (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                              {book.genre}
                            </span>
                          ) : <span />}
                          {book.condition && (
                            <span className="text-[10px] text-gray-400">{book.condition}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-2.5 rounded-lg border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={15} className="text-gray-600" />
                </button>

                {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-[#021a0f] text-white'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="p-2.5 rounded-lg border border-gray-200 bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={15} className="text-gray-600" />
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