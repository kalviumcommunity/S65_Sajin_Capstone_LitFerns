/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

const genres = ['All', 'Thriller', 'Memoir', 'Fiction', 'Self-Help', 'Classic', 'Dystopian', 'Sci-Fi'];

const BrowsePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get('/api/books');
        setBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    return books.filter((b) => {
      const matchesQuery = !lowered || b.title?.toLowerCase().includes(lowered) || b.author?.toLowerCase().includes(lowered);
      const matchesGenre = activeGenre === 'All' || (b.genre || '').toLowerCase() === activeGenre.toLowerCase();
      return matchesQuery && matchesGenre;
    });
  }, [books, query, activeGenre]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 space-y-6">
        <h3 className="text-xl font-bold">Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search by title or author..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <div>
          <h4 className="font-semibold mb-2">Genre</h4>
          <ul className="space-y-1">
            {genres.map(genre => (
              <li key={genre}>
                <button type="button" onClick={() => setActiveGenre(genre)} className={`text-left ${activeGenre === genre ? 'text-green-700 font-semibold' : 'text-gray-600 hover:text-green-600'}`}>{genre}</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="w-full md:w-3/4">
        <h2 className="text-3xl font-bold mb-6">Discover Your Next Read</h2>
        {loading && <p>Loading books...</p>}
        {error && <p className="text-red-600">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default BrowsePage;