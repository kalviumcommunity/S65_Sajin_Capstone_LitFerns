/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatusBadge = ({ status }) => {
  const map = {
    Shipped: 'bg-emerald-100 text-emerald-700',
    'In Transit': 'bg-blue-100 text-blue-700',
    'Pending Shipping': 'bg-amber-100 text-amber-700',
    Pending: 'bg-amber-100 text-amber-700',
    Accepted: 'bg-emerald-100 text-emerald-700',
    Completed: 'bg-gray-100 text-gray-700',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700';
  return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>;
};

const ProgressBar = ({ percent }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(Math.max(percent || 0, 0), 100)}%` }} />
  </div>
);

const SwapCard = ({ title, author, partner, status, percent, ctaText = 'Track Details' }) => (
  <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex gap-4">
    <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{author}</p>
          <p className="text-sm text-gray-500">{partner}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ProgressBar percent={percent} />
        <span className="text-xs text-gray-600 font-medium">{percent || 0}%</span>
      </div>
      <div className="mt-3">
        <button className="px-3 py-1.5 text-sm border rounded-lg font-medium hover:bg-gray-50">{ctaText}</button>
      </div>
    </div>
  </div>
);

const SwapDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [myBooks, setMyBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyBooks = async () => {
      try {
        setError('');
        const { data } = await axios.get('/api/books/mybooks');
        setMyBooks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your books');
      }
    };
    fetchMyBooks();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Active Exchanges</h1>
      <div className="mb-6 bg-gray-100 rounded-lg p-1 inline-flex">
        <button onClick={() => setActiveTab('ongoing')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'ongoing' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`}>Ongoing Swaps</button>
        <button onClick={() => setActiveTab('incoming')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'incoming' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`}>Pending Requests</button>
        <button onClick={() => setActiveTab('completed')} className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'completed' ? 'bg-white shadow text-emerald-700' : 'text-gray-600'}`}>Completed Swaps</button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {activeTab === 'ongoing' && (
        <div className="space-y-3">
          <SwapCard title="The Alchemist" author="Paulo Coelho" partner="↔ Alice B." status="Shipped" percent={75} />
          <SwapCard title="Sapiens: A Brief History of Humankind" author="Yuval Noah Harari" partner="↔ Bob C." status="In Transit" percent={50} />
          <SwapCard title="Where the Crawdads Sing" author="Delia Owens" partner="↔ Charlie D." status="Pending Shipping" percent={25} ctaText="Prepare for Ship" />
        </div>
      )}

      {activeTab === 'incoming' && (
        <div className="space-y-3">
          <SwapCard title="Dune" author="Frank Herbert" partner="Incoming from Alice" status="Pending" percent={0} ctaText="Review" />
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-3">
          <SwapCard title="The Hobbit" author="J.R.R. Tolkien" partner="↔ Bob" status="Completed" percent={100} ctaText="View" />
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Books</h2>
        <ul className="list-disc list-inside text-gray-700">
          {myBooks.map((b) => (
            <li key={b._id}>{b.title} — {b.author}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SwapDashboardPage;