import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw, Inbox, CheckCircle, Clock, Package, XCircle, ArrowRight, BookOpen, AlertCircle, Search, Trash2, Sparkles, TrendingUp, ArrowLeftRight, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const statusConfig = {
  Pending:      { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', icon: Clock, label: 'Pending' },
  Accepted:     { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400', icon: CheckCircle, label: 'Accepted' },
  Shipped:      { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400', icon: Package, label: 'Shipped' },
  'In Transit': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-400', icon: Package, label: 'In Transit' },
  Completed:    { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400', icon: CheckCircle, label: 'Completed' },
  Declined:     { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400', icon: XCircle, label: 'Declined' },
  Cancelled:    { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400', icon: XCircle, label: 'Cancelled' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 ${cfg.bg} ${cfg.text} border ${cfg.border} px-2.5 py-1 rounded-full text-xs font-semibold`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ percent }) => {
  const p = Math.min(Math.max(percent || 0, 0), 100);
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          p === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
          p >= 50 ? 'bg-gradient-to-r from-blue-500 to-indigo-400' :
          p > 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' : 'bg-gray-200'
        }`}
        style={{ width: `${p}%` }}
      />
    </div>
  );
};

const SwapCard = ({ swap, userId, onAction, onDelete }) => {
  const isOwner = swap.owner?._id === userId;
  const isRequester = swap.requester?._id === userId;
  const otherParty = isOwner ? swap.requester : swap.owner;
  const book = swap.requestedBook;
  const offeredBook = swap.offeredBook;
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAction = async (newStatus) => {
    setActionLoading(true);
    await onAction(swap._id, newStatus);
    setActionLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 hover:shadow-lg hover:shadow-emerald-50 hover:border-emerald-100/50 transition-all duration-300 shadow-sm group">
      <div className="flex gap-3 sm:gap-4">
        <Link to={`/book/${book?._id}`} className="flex-shrink-0">
          <div className="overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm group-hover:shadow-md transition-shadow" style={{ width: '3.75rem', height: '5rem' }}>
            <img
              src={getImageUrl(book?.image, book?.title || 'Book')}
              alt={book?.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => { e.target.src = getImageUrl(null, book?.title || 'Book'); }}
            />
          </div>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-2">
            <div className="min-w-0">
              <Link to={`/book/${book?._id}`} className="font-bold text-gray-900 hover:text-emerald-600 transition-colors truncate block text-[15px]">
                {book?.title || 'Unknown Book'}
              </Link>
              <p className="text-xs text-gray-500 mt-0.5">{book?.author}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                {isOwner ? (
                  <><span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full text-[10px] font-semibold"><Inbox size={9} /> Incoming</span> from <strong className="text-gray-600">{otherParty?.name || 'someone'}</strong></>
                ) : (
                  <><span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full text-[10px] font-semibold"><Send size={9} /> Sent</span> to <strong className="text-gray-600">{otherParty?.name || 'owner'}</strong></>
                )}
              </p>
            </div>
            <StatusBadge status={swap.status} />
          </div>

          {offeredBook && (
            <div className="mt-2.5 text-xs text-gray-600 bg-gradient-to-r from-gray-50 to-white rounded-lg px-3 py-2 inline-flex items-center gap-2 border border-gray-100">
              <ArrowLeftRight size={11} className="text-emerald-500" />
              Offering: <strong className="text-gray-800">{offeredBook.title}</strong>
            </div>
          )}

          {swap.message && (
            <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <span className="text-gray-400 not-italic">Message:</span> "{swap.message}"
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1">
              <ProgressBar percent={swap.trackingProgress} />
            </div>
            <span className={`text-xs font-bold whitespace-nowrap ${
              swap.trackingProgress === 100 ? 'text-emerald-600' :
              swap.trackingProgress >= 50 ? 'text-blue-600' :
              swap.trackingProgress > 0 ? 'text-amber-600' : 'text-gray-400'
            }`}>{swap.trackingProgress || 0}%</span>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex flex-wrap gap-2">
            {isOwner && swap.status === 'Pending' && (
              <>
                <button
                  onClick={() => handleAction('Accepted')}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-emerald-200/50 flex items-center gap-1.5"
                >
                  <CheckCircle size={13} />
                  Accept
                </button>
                <button
                  onClick={() => handleAction('Declined')}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs bg-white border border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 disabled:opacity-50 transition-all duration-200 flex items-center gap-1.5"
                >
                  <XCircle size={13} />
                  Decline
                </button>
              </>
            )}
            {swap.status === 'Accepted' && (
              <button
                onClick={() => handleAction('Shipped')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-blue-200/50 flex items-center gap-1.5"
              >
                <Package size={13} />
                Mark as Shipped
              </button>
            )}
            {swap.status === 'Shipped' && (
              <button
                onClick={() => handleAction('In Transit')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-indigo-200/50 flex items-center gap-1.5"
              >
                <Package size={13} />
                Mark In Transit
              </button>
            )}
            {swap.status === 'In Transit' && (
              <button
                onClick={() => handleAction('Completed')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-600 disabled:opacity-50 transition-all duration-200 shadow-sm shadow-emerald-200/50 flex items-center gap-1.5"
              >
                <CheckCircle size={13} />
                Mark Complete
              </button>
            )}
            {isRequester && swap.status === 'Pending' && (
              <button
                onClick={() => handleAction('Cancelled')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs bg-white border border-gray-200 text-gray-500 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 flex items-center gap-1.5"
              >
                <XCircle size={13} />
                Cancel Request
              </button>
            )}
            {['Accepted', 'Shipped', 'In Transit'].includes(swap.status) && (
              <button
                onClick={() => handleAction('Cancelled')}
                disabled={actionLoading}
                className="px-4 py-2 text-xs bg-white border border-gray-200 text-gray-500 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 flex items-center gap-1.5"
              >
                <XCircle size={13} />
                Cancel
              </button>
            )}
            {['Completed', 'Declined', 'Cancelled'].includes(swap.status) && onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 animate-fade-in">
                  <span className="text-xs text-red-600 font-medium">Remove this swap?</span>
                  <button
                    onClick={async () => { setActionLoading(true); await onDelete(swap._id); setActionLoading(false); }}
                    disabled={actionLoading}
                    className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1 text-xs bg-white text-gray-500 rounded-lg font-medium hover:bg-gray-100 transition border border-gray-200"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 text-xs bg-white border border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 disabled:opacity-50 transition-all duration-200 inline-flex items-center gap-1.5"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SwapDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('incoming');
  const [swaps, setSwaps] = useState([]);
  const [allSwaps, setAllSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSwaps = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError('');

      let params = {};
      if (activeTab === 'incoming') {
        params = { role: 'incoming' };
      } else if (activeTab === 'ongoing') {
        const [a, s, t] = await Promise.all([
          axios.get('/api/swaps', { params: { status: 'Accepted' } }),
          axios.get('/api/swaps', { params: { status: 'Shipped' } }),
          axios.get('/api/swaps', { params: { status: 'In Transit' } }),
        ]);
        const combined = [...(a.data || []), ...(s.data || []), ...(t.data || [])];
        setSwaps(combined);
        setLoading(false);
        return;
      } else if (activeTab === 'completed') {
        params = { status: 'Completed' };
      }

      const { data } = await axios.get('/api/swaps', { params });
      setSwaps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load swaps');
    } finally {
      setLoading(false);
    }
  }, [activeTab, user]);

  const loadOverview = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/swaps');
      setAllSwaps(Array.isArray(data) ? data : []);
    } catch { setAllSwaps([]); }
  }, []);

  // Load all swaps for overview stats
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadOverview();
  }, [user, navigate, loadOverview]);

  useEffect(() => {
    if (!user) return;
    fetchSwaps();
  }, [fetchSwaps, user]);

  const handleSwapAction = async (swapId, newStatus) => {
    try {
      await axios.put(`/api/swaps/${swapId}`, { status: newStatus });
      await fetchSwaps();
      // Refresh overview
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteSwap = async (swapId) => {
    try {
      await axios.delete(`/api/swaps/${swapId}`);
      setSwaps(prev => prev.filter(s => s._id !== swapId));
      await loadOverview();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove swap');
    }
  };

  if (!user) return null;

  const pendingCount = allSwaps.filter(s => s.status === 'Pending').length;
  const activeCount = allSwaps.filter(s => ['Accepted', 'Shipped', 'In Transit'].includes(s.status)).length;
  const completedCount = allSwaps.filter(s => s.status === 'Completed').length;
  const incomingPending = allSwaps.filter(s => s.status === 'Pending' && s.owner?._id === user._id).length;

  const tabs = [
    { key: 'incoming', label: 'Request Alerts', icon: Inbox, count: incomingPending },
    { key: 'ongoing', label: 'Active Exchanges', icon: RefreshCw, count: activeCount },
    { key: 'completed', label: 'Completed', icon: CheckCircle, count: completedCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/3 right-[15%] w-3 h-3 bg-emerald-300/40 rounded-full" />
        <div className="absolute bottom-1/4 left-[20%] w-2 h-2 bg-white/30 rounded-full" />
        <div className="absolute top-8 left-[45%] w-16 h-16 bg-white/5 rounded-full blur-xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1 mb-3">
                <Sparkles size={12} className="text-yellow-300" />
                <span className="text-white/90 text-[11px] font-medium tracking-wide">Track & manage all your swaps</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">Swap Dashboard</h1>
              <p className="text-emerald-100/80 text-sm mt-1.5">Manage requests, track shipments, and complete exchanges</p>
            </div>
            <Link
              to="/browse"
              className="bg-white text-emerald-700 px-5 py-2.5 rounded-xl hover:bg-emerald-50 transition-all duration-200 text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
              <Search size={16} />
              <span className="hidden sm:inline">Browse Books</span>
              <span className="sm:hidden">Browse</span>
            </Link>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { value: pendingCount, label: 'Pending', icon: Clock, gradient: 'from-amber-500 to-orange-400' },
              { value: activeCount, label: 'Active', icon: RefreshCw, gradient: 'from-blue-500 to-indigo-400' },
              { value: completedCount, label: 'Completed', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-400' },
              { value: incomingPending, label: 'Needs Action', icon: AlertCircle, gradient: 'from-rose-500 to-pink-400' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 hover:bg-white/15 transition-all duration-300 group cursor-default">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${s.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <s.icon size={18} className="text-white sm:hidden" />
                    <s.icon size={22} className="text-white hidden sm:block" />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white">{s.value}</p>
                    <p className="text-[10px] sm:text-xs text-emerald-200/70 font-medium">{s.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tabs */}
        <div className="mb-5 sm:mb-7">
          <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-1 w-full sm:w-auto sm:inline-flex">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 sm:flex-initial px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 ${
                  activeTab === key
                    ? 'bg-white text-gray-900 shadow-md shadow-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{key === 'incoming' ? 'Alerts' : key === 'ongoing' ? 'Active' : 'Done'}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === key
                      ? key === 'incoming' ? 'bg-amber-100 text-amber-700' : key === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle size={14} className="text-red-500" />
            </div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-emerald-200 border-t-emerald-600" />
            <p className="text-sm text-gray-400">Loading swaps...</p>
          </div>
        ) : swaps.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-200">
            {activeTab === 'incoming' ? (
              <>
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Inbox className="text-amber-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">No incoming requests</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">When someone requests one of your books, it will appear here</p>
              </>
            ) : activeTab === 'ongoing' ? (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="text-blue-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">No active exchanges</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Accept a swap request to start an exchange</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-emerald-400" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">No completed swaps yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">Your completed exchanges will be recorded here</p>
              </>
            )}
            <Link to="/browse" className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-2.5 rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-200 text-sm font-semibold shadow-md shadow-emerald-200/50">
              <Search size={16} />
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {swaps.map((swap) => (
              <SwapCard key={swap._id} swap={swap} userId={user._id} onAction={handleSwapAction} onDelete={handleDeleteSwap} />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-2xl p-8 sm:p-10 text-center shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-300/10 rounded-full translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
              <Sparkles size={14} className="text-yellow-300" />
              <span className="text-white/90 text-xs font-medium">Discover something new</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Ready for your next swap?</h3>
            <p className="text-emerald-100/80 text-sm mb-7 max-w-md mx-auto">
              Discover new books from our community and start your next exchange adventure.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/browse"
                className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-emerald-50 transition-all duration-200 shadow-lg shadow-emerald-700/20 inline-flex items-center gap-2"
              >
                <BookOpen size={16} />
                Browse Library
              </Link>
              <Link
                to="/profile"
                className="border-2 border-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white/10 hover:border-white/50 transition-all duration-200 inline-flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Add Your Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDashboardPage;
