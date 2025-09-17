import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError('');
        const { data } = await axios.get(`/api/books/${id}`);
        setBook(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load book');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    if (!book) return;
    // naive similar: same genre
    const fetchSimilar = async () => {
      try {
        const { data } = await axios.get('/api/books');
        const sims = (Array.isArray(data) ? data : []).filter((b) => b._id !== book._id && b.genre === book.genre).slice(0, 6);
        setSimilar(sims);
      } catch (_) {
        setSimilar([]);
      }
    };
    fetchSimilar();
  }, [book]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return null;

  const normalize = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = import.meta.env.VITE_API_URL || '';
    if (base) {
      const trimmed = url.startsWith('/') ? url : `/${url}`;
      return `${base}${trimmed}`;
    }
    return url.startsWith('/') ? url : `/${url}`;
  };
  const imageSrc = normalize(book?.image) || normalize(book?.imageUrl) || `https://placehold.co/600x900/f8b056/ffffff?text=${(book?.title || 'Book').replace(/\s/g, '+')}`;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img src={imageSrc} alt={book.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{book.title}</h1>
          <p className="text-xl text-gray-600">by {book.author}</p>
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2"> <User size={16} /> <span>{book.owner?.name || 'Owner'}</span> </div>
            <div className="flex items-center gap-2"> <MapPin size={16} /> <span>{book.owner?.location || 'Unknown'}</span> </div>
          </div>
          <p className="text-lg leading-relaxed">{book.description || 'No description provided.'}</p>
          <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-lg">
            Request Swap
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {similar.map(book => ( <BookCard key={book._id} book={book} /> ))}
        </div>
      </section>
    </div>
  );
};

export default BookDetailsPage;