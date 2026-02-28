import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Menu, X, LogOut, BookOpen, RefreshCw, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Track scroll for glass effect
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close profile dropdown on route change
    useEffect(() => { setProfileOpen(false); setMobileOpen(false); }, [location.pathname]);

    const handleLogout = async () => {
        await logout();
        setMobileOpen(false);
        setProfileOpen(false);
        navigate('/');
    };

    const navLinks = user
        ? [
            { to: '/browse', label: 'Library', icon: BookOpen },
            { to: '/profile', label: 'My Books', icon: User },
            { to: '/dashboard', label: 'Swaps', icon: RefreshCw },
          ]
        : [];

    const isActive = (path) => location.pathname === path;

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50' : 'bg-white border-b border-gray-100'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-xl shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/30 group-hover:scale-105 transition-all duration-200">
                        <Leaf className="text-white" size={18} />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">LitFerns</span>
                </Link>

                {/* Desktop Nav */}
                {navLinks.length > 0 && (
                    <nav className="hidden md:flex items-center gap-0.5 bg-gray-100/70 rounded-xl p-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link key={to} to={to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 ${
                                    isActive(to)
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
                                }`}
                            >
                                <Icon size={15} />
                                {label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Desktop Right */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-200 ${profileOpen ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                                    <span className="text-white text-sm font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name?.split(' ')[0]}</span>
                                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown */}
                            {profileOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-xl shadow-gray-200/50 z-50 animate-fade-in overflow-hidden">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-1.5">
                                            <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                                                <User size={15} className="text-gray-400" /> My Profile
                                            </Link>
                                            <Link to="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                                                <RefreshCw size={15} className="text-gray-400" /> Swap Dashboard
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-100 py-1.5">
                                            <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full">
                                                <LogOut size={15} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition">Login</Link>
                            <Link to="/login" className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-2 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl animate-fade-in">
                    <nav className="px-4 py-4 space-y-1">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                                    isActive(to)
                                        ? 'text-emerald-700 bg-emerald-50'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon size={18} className={isActive(to) ? 'text-emerald-600' : 'text-gray-400'} />
                                {label}
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 pt-4 mt-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                                            <span className="text-white text-sm font-bold">{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium text-sm flex items-center gap-3">
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all font-semibold text-sm shadow-md">
                                        Get Started
                                    </Link>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-center border border-gray-200 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition font-medium text-sm">
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
