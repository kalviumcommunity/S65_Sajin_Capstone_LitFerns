import { useEffect, useState, useCallback, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw, Inbox, CheckCircle, Package, XCircle, ArrowLeftRight, Trash2, ArrowLeft, Book, User, Calendar, ChevronRight, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import { Dialog, Transition } from '@headlessui/react';

const dashboardStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
  .pf-serif { font-family: 'Playfair Display', Georgia, serif; }
  .pf-sans  { font-family: 'DM Sans', system-ui, sans-serif; }
  
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  
  .fade-up { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) forwards; opacity: 0; }
  .fade-up-1 { animation-delay: 60ms; }
  .fade-up-2 { animation-delay: 120ms; }
  .fade-up-3 { animation-delay: 180ms; }
  .stat-card { animation: fadeUp 0.5s cubic-bezier(.22,1,.36,1) forwards; opacity: 0; transition: all 0.3s ease; }
  .stat-card:hover { transform: translateY(-4px); }
  .swap-item { animation: fadeUp 0.5s ease-out forwards; opacity: 0; transition: all 0.3s ease; }
  .swap-item:hover { transform: translateX(4px) scale(1.01); background: rgba(16, 185, 129, 0.02); }
  .filter-btn.active { background: linear-gradient(135deg, #10b981, #14b8a6); color: white; }
  .status-badge { font-weight: 600; min-width: 80px; text-align: center; }
`;

const statusConfig = {
  Pending:      { bg: 'bg-amber-100',  text: 'text-amber-800',  label: 'Pending',         icon: '⏳' },
  Accepted:     { bg: 'bg-teal-100',   text: 'text-teal-800',   label: 'Accepted',        icon: '✓' },
  Shipped:      { bg: 'bg-blue-100',   text: 'text-blue-800',   label: 'Shipped',         icon: '📦' },
  'In Transit': { bg: 'bg-violet-100', text: 'text-violet-800', label: 'In Transit',      icon: '🚚' },
  Completed:    { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Completed',     icon: '✅' },
  Declined:     { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Declined',        icon: '✗' },
  Cancelled:    { bg: 'bg-red-100',    text: 'text-red-800',    label: 'Cancelled',       icon: '✗' },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`status-badge inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} px-3 py-1.5 rounded-full text-xs font-semibold`}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
};

const SwapDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedSwap, setSelectedSwap] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/swaps');
      setSwaps(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load swaps.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) navigate('/login');
    else fetchSwaps();
  }, [user, navigate, fetchSwaps]);

  const handleAction = async (swapId, newStatus) => {
    try {
      await axios.put(`/api/swaps/${swapId}`, { status: newStatus });
      setSuccessMsg(`Swap marked as ${newStatus.toLowerCase()}`);
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchSwaps();
      if(selectedSwap?._id === swapId) {
        setSelectedSwap(prev => prev ? {...prev, status: newStatus} : null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (swapId) => {
    try {
      await axios.delete(`/api/swaps/${swapId}`);
      setSuccessMsg('Swap removed from history');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchSwaps();
      setSelectedSwap(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete swap.');
    }
  };

  const filteredSwaps = swaps
    .filter(swap => {
      if (filter === 'all') return true;
      if (filter === 'incoming') return swap.owner?._id === user?._id;
      if (filter === 'outgoing') return swap.requester?._id === user?._id;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const stats = {
    incoming: swaps.filter(s => s.owner?._id === user?._id && s.status === 'Pending').length,
    active: swaps.filter(s => ['Accepted', 'Shipped', 'In Transit'].includes(s.status)).length,
    completed: swaps.filter(s => s.status === 'Completed').length,
  };

  return (
    <div className="bg-[#f5f4f0] pf-sans min-h-screen">
      <style>{dashboardStyles}</style>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2.5 fade-up">
          <CheckCircle size={14} className="text-teal-400 flex-shrink-0" />
          {successMsg}
        </div>
      )}

      {/* ── Header ── */}
      <div className="bg-[#0d1f17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
          
          {/* Back + Title */}
          <div className="flex items-center gap-4 mb-8 fade-up">
            <Link to="/profile" className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/6 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
              <p className="text-teal-500/70 text-[10px] font-medium tracking-[0.2em] uppercase mb-1">Exchange Center</p>
              <h1 className="pf-serif text-3xl sm:text-4xl font-light text-white leading-[1.1] tracking-tight italic">Swap Dashboard</h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 fade-up fade-up-1">
            {[
              { icon: Inbox,        value: stats.incoming,   label: 'Pending Requests',  color: 'text-amber-400',    bg: 'bg-amber-500/10' },
              { icon: RefreshCw,    value: stats.active,     label: 'Active Swaps',      color: 'text-blue-400',     bg: 'bg-blue-400/10' },
              { icon: CheckCircle,  value: stats.completed,  label: 'Completed',         color: 'text-emerald-400',  bg: 'bg-emerald-500/10' },
            ].map(({ icon: Icon, value, label, color, bg }) => (
              <div key={label} className="stat-card bg-white/5 border border-white/8 rounded-xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${color} leading-none`}>{value}</p>
                  <p className="text-[11px] text-white/30 mt-0.5 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 fade-up fade-up-2">
          <h2 className="text-lg font-semibold text-gray-800">Swap History</h2>
          <div className="flex items-center gap-1.5 bg-white/40 backdrop-blur-sm border border-gray-200/80 p-1.5 rounded-xl">
            {[
              { id: 'all', label: 'All',       count: swaps.length },
              { id: 'incoming', label: 'Incoming',  count: swaps.filter(s => s.owner?._id === user?._id).length },
              { id: 'outgoing', label: 'Outgoing',  count: swaps.filter(s => s.requester?._id === user?._id).length },
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`filter-btn px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === id
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 bg-transparent'
                }`}
              >
                {label} <span className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                  filter === id ? 'bg-white/20' : 'bg-gray-200'
                }`}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2.5 mb-6 text-xs text-red-600">
            <X size={13} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 fade-up">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-teal-500" />
            <p className="text-sm text-gray-400">Loading swaps…</p>
          </div>
        ) : filteredSwaps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 fade-up">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Book className="text-blue-500" size={22} />
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1.5">No swaps found</h3>
            <p className="text-xs text-gray-400 mb-6">Your swap activity will appear here</p>
            <Link to="/browse" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors">
              <Search size={13} />
              Browse Books
            </Link>
          </div>
        ) : (
          <ul className="space-y-2 fade-up fade-up-2">
            {filteredSwaps.map((swap, i) => (
              <SwapListItem 
                key={swap._id} 
                swap={swap} 
                userId={user?._id} 
                onClick={() => setSelectedSwap(swap)}
                style={{ animationDelay: `${i * 0.04}s` }}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      <SwapDetailModal isOpen={!!selectedSwap} swap={selectedSwap} userId={user?._id} onClose={() => setSelectedSwap(null)} onAction={handleAction} onDelete={handleDelete} />
    </div>
  );
};

const StatCard = ({ value, label, icon: Icon }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200/80 shadow-sm flex items-center gap-4">
    <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg">
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const FilterButton = ({ label, count, active, onClick }) => (
  <button onClick={onClick} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
    active ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:bg-gray-200/60'
  }`}>
    {label} <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>{count}</span>
  </button>
);

const SwapListItem = ({ swap, userId, onClick, style }) => {
  const isOwner = swap.owner?._id === userId;
  const otherParty = isOwner ? swap.requester : swap.owner;
  const offeredBook = isOwner ? swap.requesterBook : swap.ownerBook;
  const requestedBook = isOwner ? swap.ownerBook : swap.requesterBook;

  return (
    <li onClick={onClick} className="swap-item bg-white rounded-xl border border-gray-100 overflow-hidden cursor-pointer" style={style}>
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-5">
        
        {/* Requested Book */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0" style={{ width: '56px', height: '76px' }}>
            <img src={getImageUrl(requestedBook?.image, requestedBook?.title)} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 truncate leading-snug text-sm">{requestedBook?.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {isOwner ? `Requested by ${otherParty?.name}` : `Offered to ${otherParty?.name}`}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center px-3 text-gray-400 hidden sm:flex flex-shrink-0">
          <ArrowLeftRight size={16} />
        </div>

        {/* Offered Book */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0" style={{ width: '56px', height: '76px' }}>
            <img src={getImageUrl(offeredBook?.image, offeredBook?.title)} alt="" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 truncate leading-snug text-sm">{offeredBook?.title}</p>
            <p className="text-xs text-gray-500 mt-1">You offered</p>
          </div>
        </div>

        {/* Status & Arrow */}
        <div className="flex items-center justify-end gap-3 w-full sm:w-auto flex-shrink-0">
          <StatusBadge status={swap.status} />
          <ChevronRight size={16} className="text-gray-400 hidden sm:block" />
        </div>
      </div>
    </li>
  );
};

const SwapDetailModal = ({ isOpen, swap, userId, onClose, onAction, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!swap) return null;

  const isOwner = swap.owner?._id === userId;
  const otherParty = isOwner ? swap.requester : swap.owner;
  const offeredBook = isOwner ? swap.requesterBook : swap.ownerBook;
  const requestedBook = isOwner ? swap.ownerBook : swap.requesterBook;

  const handleAction = (status) => {
    onAction(swap._id, status);
  };

  const handleDeleteClick = () => {
    onDelete(swap._id);
    setConfirmDelete(false);
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                
                {/* Modal Header */}
                <div className="bg-[#0d1f17] px-6 py-5 flex items-center justify-between">
                  <h2 className="pf-serif text-lg font-light text-white italic tracking-tight">Swap Details</h2>
                  <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition text-white/30 hover:text-white">
                    <X size={15} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  
                  {/* Status & Date */}
                  <div className="flex justify-between items-center">
                    <StatusBadge status={swap.status} />
                    <p className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Books Exchange */}
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <BookDetail book={requestedBook} userLabel="You want" />
                      <ArrowLeftRight size={20} className="text-teal-600 hidden sm:block flex-shrink-0" />
                      <BookDetail book={offeredBook} userLabel="You offer" />
                    </div>
                  </div>

                  {/* Other Party */}
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2">Swap Partner</h4>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-teal-600" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{otherParty?.name}</p>
                    </div>
                  </div>

                  {/* Message */}
                  {swap.message && (
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <h4 className="font-semibold text-gray-800 text-sm mb-2">Message</h4>
                      <p className="text-sm text-gray-600 italic">"{swap.message}"</p>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Actions */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-2.5">
                  {isOwner && swap.status === 'Pending' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAction('Accepted')} 
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Accept Swap
                      </button>
                      <button 
                        onClick={() => handleAction('Declined')} 
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  
                  {['Accepted', 'Shipped', 'In Transit'].includes(swap.status) && (
                    <button 
                      onClick={() => handleAction(
                        swap.status === 'Accepted' ? 'Shipped' :
                        swap.status === 'Shipped' ? 'In Transit' : 'Completed'
                      )} 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Package size={16} /> 
                      Mark as {
                        swap.status === 'Accepted' ? 'Shipped' :
                        swap.status === 'Shipped' ? 'In Transit' : 'Completed'
                      }
                    </button>
                  )}
                  
                  {['Completed', 'Declined', 'Cancelled'].includes(swap.status) && !confirmDelete && (
                    <button 
                      onClick={() => setConfirmDelete(true)} 
                      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Remove from History
                    </button>
                  )}
                  
                  {confirmDelete && (
                    <div className="p-3.5 bg-red-50 rounded-lg border border-red-200 space-y-2.5">
                      <p className="text-sm font-semibold text-red-800">Remove this swap from history?</p>
                      <div className="flex gap-2.5">
                        <button 
                          onClick={handleDeleteClick} 
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(false)} 
                          className="flex-1 bg-white border border-red-200 text-red-700 text-xs font-semibold py-2 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={onClose} 
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const BookDetail = ({ book, userLabel }) => (
  <div className="flex-1 text-center">
    <div className="rounded-lg overflow-hidden bg-gray-100 border border-gray-200 mb-2 mx-auto" style={{ width: '60px', height: '80px' }}>
      <img src={getImageUrl(book?.image, book?.title)} alt={book?.title} className="w-full h-full object-contain" />
    </div>
    <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{book?.title}</p>
    <p className="text-[10px] text-gray-500 mt-0.5">{userLabel}</p>
  </div>
);

export default SwapDashboardPage;