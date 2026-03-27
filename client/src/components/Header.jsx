import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, BookOpen, RefreshCw, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const headerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
  .hdr-display { font-family: 'Playfair Display', Georgia, serif; }
  .hdr-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes drawerIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .hdr-dropdown { animation: dropIn 0.2s cubic-bezier(.22,1,.36,1) both; }
  .hdr-drawer   { animation: drawerIn 0.18s ease both; }

  .nav-pill {
    background: rgba(2, 26, 15, 0.82);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.06) inset;
  }

  .nav-pill-scrolled {
    background: rgba(2, 26, 15, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 12px 40px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.05) inset;
  }

  .nav-link-active {
    background: rgba(255,255,255,0.12);
  }

  /* Mobile drawer pill */
  .mobile-pill {
    background: rgba(2, 26, 15, 0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 16px 48px rgba(0,0,0,0.3);
  }
`;

const Header = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 20);
            setHidden(y > lastY && y > 80);
            lastY = y;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setProfileOpen(false);
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        setMobileOpen(false);
        setProfileOpen(false);
        navigate('/');
    };

    const navLinks = user ? [
        { to: '/browse',    label: 'Library',  icon: BookOpen },
        { to: '/profile',   label: 'My Books', icon: User },
        { to: '/dashboard', label: 'Swaps',    icon: RefreshCw },
    ] : [];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>{headerStyles}</style>

            {/* Floating header wrapper — fixed, centered */}
            <div className={`fixed top-0 left-0 right-0 z-50 hdr-body pointer-events-none transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 flex flex-col items-center gap-3">

                    {/* ── Desktop Pill ── */}
                    <div className={`hidden md:flex items-center gap-1 px-2 py-2 rounded-full pointer-events-auto transition-all duration-300 ${scrolled ? 'nav-pill-scrolled' : 'nav-pill'}`}>

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 pl-1 pr-3 group flex-shrink-0"
                            onClick={() => setMobileOpen(false)}
                        >
                            <div className="w-8 h-8 bg-white/15 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white/25 transition-colors duration-200 flex-shrink-0">
                                <Leaf size={14} className="text-emerald-400" />
                            </div>
                            <span className="hdr-display text-[15px] font-bold text-white tracking-tight">
                                LitFerns
                            </span>
                        </Link>

                        {/* Divider */}
                        {navLinks.length > 0 && (
                            <div className="w-px h-5 bg-white/15 mx-1" />
                        )}

                        {/* Nav links */}
                        {navLinks.map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                                    isActive(to)
                                        ? 'nav-link-active text-white'
                                        : 'text-white/60 hover:text-white hover:bg-white/8'
                                }`}
                            >
                                {label}
                            </Link>
                        ))}

                        {/* Right side */}
                        {user ? (
                            <>
                                {/* Divider */}
                                <div className="w-px h-5 bg-white/15 mx-1" />

                                {/* Profile button — pill inside pill */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-150 ${
                                            profileOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/18 border border-white/15'
                                        }`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                            <span className="hdr-display text-[#021a0f] text-[11px] font-bold italic">
                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-white max-w-[80px] truncate">
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <ChevronDown
                                            size={12}
                                            className={`text-white/50 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {profileOpen && (
                                        <>
                                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                            <div className="hdr-dropdown absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/12 z-50 overflow-hidden">
                                                <div className="px-4 py-3.5 border-b border-gray-100 bg-[#f8f7f4]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#021a0f] flex items-center justify-center flex-shrink-0">
                                                            <span className="hdr-display text-white text-sm font-bold italic">
                                                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                            <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="py-1.5">
                                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                                        <User size={14} className="text-gray-400" /> My Profile
                                                    </Link>
                                                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                                        <RefreshCw size={14} className="text-gray-400" /> Swap Dashboard
                                                    </Link>
                                                </div>
                                                <div className="border-t border-gray-100 py-1.5">
                                                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full">
                                                        <LogOut size={14} /> Sign Out
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-px h-5 bg-white/15 mx-1" />
                                <Link to="/login" className="px-4 py-2 rounded-full text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150">
                                    Sign In
                                </Link>
                                <Link to="/login" className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-[#021a0f] hover:bg-gray-100 transition-colors duration-150 ml-0.5">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── Mobile Bar ── */}
                    <div className={`md:hidden w-full flex items-center justify-between px-3 py-2.5 rounded-2xl pointer-events-auto transition-all duration-300 ${scrolled ? 'nav-pill-scrolled' : 'nav-pill'}`}>
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                            <div className="w-7 h-7 bg-white/15 border border-white/20 rounded-full flex items-center justify-center">
                                <Leaf size={13} className="text-emerald-400" />
                            </div>
                            <span className="hdr-display text-[15px] font-bold text-white tracking-tight">LitFerns</span>
                        </Link>

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>

                    {/* ── Mobile Drawer ── */}
                    {mobileOpen && (
                        <div className="hdr-drawer md:hidden w-full mobile-pill rounded-2xl overflow-hidden pointer-events-auto">
                            <div className="px-3 py-3 space-y-0.5">
                                {navLinks.map(({ to, label, icon: Icon }) => (
                                    <Link
                                        key={to}
                                        to={to}
                                        onClick={() => setMobileOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                                            isActive(to)
                                                ? 'bg-white/12 text-white'
                                                : 'text-white/60 hover:bg-white/8 hover:text-white'
                                        }`}
                                    >
                                        <Icon size={15} className={isActive(to) ? 'text-emerald-400' : 'text-white/40'} />
                                        {label}
                                        {isActive(to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                                    </Link>
                                ))}

                                <div className="pt-2 mt-1 border-t border-white/8">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-white/6 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                                    <span className="hdr-display text-[#021a0f] text-sm font-bold italic">
                                                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                                                    <p className="text-[11px] text-white/40 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <button onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium">
                                                <LogOut size={15} /> Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <div className="space-y-2 pt-1">
                                            <Link to="/login" onClick={() => setMobileOpen(false)}
                                                className="block text-center bg-white text-[#021a0f] px-4 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors">
                                                Get Started
                                            </Link>
                                            <Link to="/login" onClick={() => setMobileOpen(false)}
                                                className="block text-center border border-white/15 text-white/70 px-4 py-3 rounded-xl font-medium text-sm hover:bg-white/8 hover:text-white transition-colors">
                                                Sign In
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Spacer so page content doesn't hide under the floating nav */}
            
        </>
    );
};

export default Header;