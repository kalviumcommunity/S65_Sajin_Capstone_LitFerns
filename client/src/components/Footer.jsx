import { Leaf, Mail, BookOpen, RefreshCw, Heart, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-950 text-gray-400 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="bg-emerald-500 p-2 rounded-xl group-hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                <Leaf className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">LitFerns</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs mb-6">
              A community-driven platform for book lovers to swap, discover, and share stories — sustainably and for free.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Eco-friendly reading
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {user ? (
                <>
                  <li>
                    <Link to="/browse" className="text-sm hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group">
                      <BookOpen size={13} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      Browse Library
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-sm hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group">
                      <RefreshCw size={13} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      Swap Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-sm hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group">
                      <Heart size={13} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      My Books &amp; Wishlist
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="text-sm hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group">
                      <BookOpen size={13} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-sm hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group">
                      <ArrowUpRight size={13} className="text-gray-600 group-hover:text-emerald-400 transition-colors" />
                      Sign In / Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">About</h4>
            <ul className="space-y-2.5">
              <li className="text-sm">A capstone project built with the MERN stack.</li>
              <li className="text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">⚛</span>
                React + Tailwind
              </li>
              <li className="text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center text-[10px] text-gray-500">🍃</span>
                Express + MongoDB
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-gray-500 mb-4">Get notified about new books and community updates.</p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {subscribed ? (
                  <><span className="text-emerald-200">✓</span> Subscribed!</>
                ) : (
                  <><Send size={14} /> Subscribe</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/80 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} LitFerns. Made with <span className="text-red-400">♥</span> for book lovers.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Leaf size={12} className="text-emerald-600" />
            <span>Swap more, waste less.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
