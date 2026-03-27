import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw, Inbox, CheckCircle, Clock, Package, XCircle, ArrowRight, BookOpen, AlertCircle, Search, Trash2, ArrowLeftRight, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';

const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .dash-display { font-family: 'Playfair Display', Georgia, serif; }
  .dash-body    { font-family: 'DM Sans', system-ui, sans-serif; }
`;

const statusConfig = {
  Pending:      { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Pending' },
  Accepted:     { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-500',   label: 'Accepted' },
  Shipped:      { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400',   label: 'Shipped' },
  'In Transit': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-400', label: 'In Transit' },
  Completed:    { bg: 'bg-gray-100',  text: 'text-gray-500',   border: 'border-gray-200',   dot: 'bg-gray-400',   label: 'Completed' },
  Declined:     { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-400',    label: 'Declined' },
  Cancelled:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-400',    label: 'Cancelled' },
};

const accentBar = {
  Pending:      'bg-amber-400',
  Accepted:     'bg-teal-500',
  Shipped:      'bg-blue-500',
  'In Transit': 'bg-violet-500',
  Completed:    'bg-gray-300',
  Declined:     'bg-red-400',
  Cancelled:    'bg-red-400',
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.bg} ${cfg.text} border ${cfg.border} px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide uppercase`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ percent }) => {
  const p = Math.min(Math.max(percent || 0, 0), 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            p === 100 ? 'bg-teal-500' : p >= 50 ? 'bg-blue-500' : p > 0 ? 'bg-amber-400' : 'bg-gray-200'
          }`}
          style={{ width: `${p}%` }}
        />
      </div>
      <span className={`text-[11px] font-semibold tabular-nums w-8 text-right flex-shrink-0 ${
        p === 100 ? 'text-teal-600' : p >= 50 ? 'text-blue-600' : p > 0 ? 'text-amber-600' : 'text-gray-300'
      }`}>{p}%</span>
    </div>
  );
};

const StatCard = ({ value, label, icon: Icon, iconBg, iconColor, valueColor }) => (
  <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={18} className={iconColor} />
    </div>
    <div>
      <p className={`text-2xl font-bold leading-none ${valueColor}`}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{label}</p>
    </div>
  </div>
);

const SwapCard = ({ swap, userId, onAction, onDelete }) => {
  const isOwner     = swap.owner?._id === userId;
  const isRequester = swap.requester?._id === userId;
  const otherParty  = isOwner ? swap.requester : swap.owner;
  const book        = swap.requestedBook;
  const offeredBook = swap.offeredBook;
  const [actionLoading, setActionLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleAction = async (newStatus) => {
    setActionLoading(true);
    await onAction(swap._id, newStatus);
    setActionLoading(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="flex">
        <div className={`w-0.5 flex-shrink-0 ${accentBar[swap.status] || 'bg-gray-300'}`} />
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex gap-4">
            <Link to={`/book/${book?._id}`} className="flex-shrink-0 group/cover">
              <div className="overflow-hidden rounded-lg bg-gray-50 border border-gray-100 shadow-sm" style={{ width: '3.5rem', height: '4.75rem' }}>
                <img
                  src={getImageUrl(book?.image, book?.title || 'Book')}
                  alt={book?.title}
                  className="w-full h-full object-contain group-hover/cover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = getImageUrl(null, book?.title || 'Book'); }}
                />
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <Link to={`/book/${book?._id}`} className="font-semibold text-gray-900 hover:text-teal-600 transition-colors text-sm leading-tight block truncate">
                    {book?.title || 'Unknown Book'}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{book?.author}</p>
                </div>
                <StatusBadge status={swap.status} />
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs">
                {isOwner ? (
                  <span className="inline-flex items-center gap-1 text-amber-600 font-medium"><Inbox size={11} /> Incoming</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium"><Send size={11} /> Sent</span>
                )}
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">
                  {isOwner ? 'from' : 'to'} <span className="font-medium text-gray-700">{otherParty?.name || 'someone'}</span>
                </span>
              </div>

              {offeredBook && (
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                  <ArrowLeftRight size={10} className="text-teal-500 flex-shrink-0" />
                  <span>Offering:</span>
                  <span className="font-medium text-gray-700 truncate max-w-[140px]">{offeredBook.title}</span>
                </div>
              )}

              {swap.message && (
                <p className="mt-2 text-xs text-gray-400 italic leading-relaxed line-clamp-2">"{swap.message}"</p>
              )}

              <div className="mt-3">
                <ProgressBar percent={swap.trackingProgress} />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {isOwner && swap.status === 'Pending' && (
                  <>
                    <button onClick={() => handleAction('Accepted')} disabled={actionLoading}
                      className="px-3.5 py-1.5 text-xs bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                      <CheckCircle size={12} /> Accept
                    </button>
                    <button onClick={() => handleAction('Declined')} disabled={actionLoading}
                      className="px-3.5 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                      <XCircle size={12} /> Decline
                    </button>
                  </>
                )}
                {swap.status === 'Accepted' && (
                  <button onClick={() => handleAction('Shipped')} disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                    <Package size={12} /> Mark Shipped
                  </button>
                )}
                {swap.status === 'Shipped' && (
                  <button onClick={() => handleAction('In Transit')} disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                    <Package size={12} /> Mark In Transit
                  </button>
                )}
                {swap.status === 'In Transit' && (
                  <button onClick={() => handleAction('Completed')} disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                    <CheckCircle size={12} /> Mark Complete
                  </button>
                )}
                {isRequester && swap.status === 'Pending' && (
                  <button onClick={() => handleAction('Cancelled')} disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs border border-gray-200 text-gray-400 rounded-lg font-semibold hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                    <XCircle size={12} /> Cancel
                  </button>
                )}
                {['Accepted', 'Shipped', 'In Transit'].includes(swap.status) && (
                  <button onClick={() => handleAction('Cancelled')} disabled={actionLoading}
                    className="px-3.5 py-1.5 text-xs border border-gray-200 text-gray-400 rounded-lg font-semibold hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                    <XCircle size={12} /> Cancel
                  </button>
                )}
                {['Completed', 'Declined', 'Cancelled'].includes(swap.status) && onDelete && (
                  confirmDelete ? (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-red-600 font-medium">Remove?</span>
                      <button onClick={async () => { setActionLoading(true); await onDelete(swap._id); setActionLoading(false); }}
                        disabled={actionLoading}
                        className="px-2.5 py-1 text-xs bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
                        Yes
                      </button>
                      <button onClick={() => setConfirmDelete(false)}
                        className="px-2.5 py-1 text-xs text-gray-500 rounded-md font-medium hover:bg-gray-100 border border-gray-200 bg-white transition-colors">
                        No
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(true)}
                      className="px-3.5 py-1.5 text-xs border border-gray-200 text-gray-400 rounded-lg font-semibold hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5">
                      <Trash2 size={11} /> Remove
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ tab }) => {
  const states = {
    incoming:  { icon: Inbox,       iconBg: 'bg-amber-50', iconColor: 'text-amber-400', title: 'No incoming requests',  desc: 'When someone requests one of your books, it will appear here.' },
    ongoing:   { icon: RefreshCw,   iconBg: 'bg-blue-50',  iconColor: 'text-blue-400',  title: 'No active exchanges',   desc: 'Accept a swap request to begin an exchange.' },
    completed: { icon: CheckCircle, iconBg: 'bg-teal-50',  iconColor: 'text-teal-500',  title: 'No completed swaps',    desc: 'Your finished exchanges will be archived here.' },
  };
  const s = states[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div className={`w-12 h-12 ${s.iconBg} rounded-xl flex items-center justify-center mb-4`}>
        <s.icon size={22} className={s.iconColor} />
      </div>
      <h3 className="text-sm font-semibold text-gray-800 mb-1">{s.title}</h3>
      <p className="text-xs text-gray-400 mb-6 max-w-[220px] leading-relaxed">{s.desc}</p>
      <Link to="/browse" className="inline-flex items-center gap-2 bg-[#021a0f] hover:bg-teal-900 text-white px-5 py-2 rounded-lg text-xs font-semibold transition-colors">
        <Search size={13} /> Browse Books
      </Link>
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
      if (activeTab === 'ongoing') {
        const [a, s, t] = await Promise.all([
          axios.get('/api/swaps', { params: { status: 'Accepted' } }),
          axios.get('/api/swaps', { params: { status: 'Shipped' } }),
          axios.get('/api/swaps', { params: { status: 'In Transit' } }),
        ]);
        setSwaps([...(a.data || []), ...(s.data || []), ...(t.data || [])]);
        setLoading(false);
        return;
      }
      const params = activeTab === 'incoming' ? { role: 'incoming' } : { status: 'Completed' };
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

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    loadOverview();
  }, [user, navigate, loadOverview]);

  useEffect(() => { if (!user) return; fetchSwaps(); }, [fetchSwaps, user]);

  const handleSwapAction = async (swapId, newStatus) => {
    try {
      await axios.put(`/api/swaps/${swapId}`, { status: newStatus });
      await Promise.all([fetchSwaps(), loadOverview()]);
    } catch (err) { setError(err.response?.data?.message || 'Action failed'); }
  };

  const handleDeleteSwap = async (swapId) => {
    try {
      await axios.delete(`/api/swaps/${swapId}`);
      setSwaps(prev => prev.filter(s => s._id !== swapId));
      await loadOverview();
    } catch (err) { setError(err.response?.data?.message || 'Failed to remove swap'); }
  };

  if (!user) return null;

  const pendingCount    = allSwaps.filter(s => s.status === 'Pending').length;
  const activeCount     = allSwaps.filter(s => ['Accepted', 'Shipped', 'In Transit'].includes(s.status)).length;
  const completedCount  = allSwaps.filter(s => s.status === 'Completed').length;
  const incomingPending = allSwaps.filter(s => s.status === 'Pending' && s.owner?._id === user._id).length;

  const tabs = [
    { key: 'incoming',  label: 'Requests',  icon: Inbox,       count: incomingPending },
    { key: 'ongoing',   label: 'Active',    icon: RefreshCw,   count: activeCount },
    { key: 'completed', label: 'Completed', icon: CheckCircle, count: completedCount },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] dash-body">
      <style>{dashStyles}</style>

      {/* ── Header — deep dark, not green ── */}
      <div className="bg-[#021a0f]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-0">

          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-px bg-teal-500" />
                <p className="text-teal-500 text-[11px] font-medium tracking-[0.18em] uppercase">Dashboard</p>
              </div>
              <h1 className="dash-display text-3xl sm:text-4xl font-bold text-white leading-tight">
                My <span className="italic font-normal text-teal-300">Exchanges</span>
              </h1>
            </div>
            <Link to="/browse"
              className="border border-white/15 text-white/60 hover:text-white hover:border-white/30 px-4 py-2 rounded-lg text-xs font-medium transition-colors mb-0.5 inline-flex items-center gap-2">
              <Search size={13} /> Browse
            </Link>
          </div>

          {/* Stats — each with distinct colour */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard value={pendingCount}    label="Pending"      icon={Clock}        iconBg="bg-amber-100"  iconColor="text-amber-500"  valueColor="text-amber-600" />
            <StatCard value={activeCount}     label="Active"       icon={RefreshCw}    iconBg="bg-blue-100"   iconColor="text-blue-500"   valueColor="text-blue-600" />
            <StatCard value={completedCount}  label="Completed"    icon={CheckCircle}  iconBg="bg-teal-100"   iconColor="text-teal-600"   valueColor="text-teal-700" />
            <StatCard value={incomingPending} label="Needs Action" icon={AlertCircle}  iconBg="bg-rose-100"   iconColor="text-rose-500"   valueColor="text-rose-600" />
          </div>

          {/* Tabs */}
          <div className="flex -mb-px">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-150 inline-flex items-center gap-2 border-b-2 -mb-px ${
                  activeTab === key
                    ? 'border-teal-400 text-white'
                    : 'border-transparent text-white/40 hover:text-white/65 hover:border-white/20'
                }`}
              >
                <Icon size={13} />
                {label}
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                    activeTab === key ? 'bg-teal-500/20 text-teal-300' : 'bg-white/8 text-white/35'
                  }`}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-teal-600" />
            <p className="text-xs text-gray-400">Loading…</p>
          </div>
        ) : swaps.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="space-y-2.5">
            {swaps.map((swap, i) => (
              <SwapCard key={swap._id} swap={swap} userId={user._id} onAction={handleSwapAction} onDelete={handleDeleteSwap} index={i} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-[#021a0f] rounded-xl p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="dash-display text-lg sm:text-xl font-bold text-white mb-1">
              Ready for your next <span className="italic font-normal text-teal-300">swap?</span>
            </h3>
            <p className="text-white/40 text-sm">Discover books from our community and start a new exchange.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/browse"
              className="bg-white hover:bg-gray-50 text-[#021a0f] px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors inline-flex items-center gap-2">
              <BookOpen size={15} /> Browse
            </Link>
            <Link to="/profile"
              className="border border-white/20 text-white/65 hover:text-white hover:border-white/35 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors inline-flex items-center gap-2">
              <ArrowRight size={15} /> Add Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapDashboardPage;