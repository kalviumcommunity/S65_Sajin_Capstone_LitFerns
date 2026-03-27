import { Leaf, Mail, BookOpen, RefreshCw, Heart, ArrowUpRight, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .ftr-display { font-family: 'Playfair Display', Georgia, serif; }
  .ftr-body    { font-family: 'DM Sans', system-ui, sans-serif; }
`;

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
    <footer className="bg-[#021a0f] text-white/40 ftr-body relative overflow-hidden">
      <style>{footerStyles}</style>

      {/* Subtle grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top rule */}
        <div className="flex items-center gap-4 pt-12 pb-10 sm:pt-14 sm:pb-12 border-b border-white/6">
          <div className="w-8 h-px bg-teal-500" />
          <p className="text-teal-500 text-[11px] font-medium tracking-[0.2em] uppercase">The Community Library</p>
        </div>

        {/* Main grid */}
        <div className="py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-5">
              <div className="w-9 h-9 bg-white/8 border border-white/12 rounded-xl flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <Leaf size={16} className="text-teal-400" />
              </div>
              <span className="ftr-display text-white text-lg font-bold tracking-tight">LitFerns</span>
            </Link>
            <p className="text-sm leading-relaxed text-white/35 max-w-xs mb-6">
              A community-driven platform where book lovers swap, discover, and share stories — sustainably and for free.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-white/25">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              Eco-friendly reading
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.15em] mb-5">Explore</h4>
            <ul className="space-y-3">
              {user ? (
                <>
                  <li>
                    <Link to="/browse" className="text-sm text-white/35 hover:text-white transition-colors inline-flex items-center gap-2 group">
                      <BookOpen size={12} className="text-white/20 group-hover:text-teal-400 transition-colors" />
                      Browse Library
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-sm text-white/35 hover:text-white transition-colors inline-flex items-center gap-2 group">
                      <RefreshCw size={12} className="text-white/20 group-hover:text-teal-400 transition-colors" />
                      Swap Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-sm text-white/35 hover:text-white transition-colors inline-flex items-center gap-2 group">
                      <Heart size={12} className="text-white/20 group-hover:text-teal-400 transition-colors" />
                      My Books &amp; Wishlist
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" className="text-sm text-white/35 hover:text-white transition-colors inline-flex items-center gap-2 group">
                      <BookOpen size={12} className="text-white/20 group-hover:text-teal-400 transition-colors" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-sm text-white/35 hover:text-white transition-colors inline-flex items-center gap-2 group">
                      <ArrowUpRight size={12} className="text-white/20 group-hover:text-teal-400 transition-colors" />
                      Sign In / Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.15em] mb-5">About</h4>
            <ul className="space-y-3">
              <li className="text-sm text-white/35 leading-relaxed">
                A capstone project built with the MERN stack.
              </li>
              <li className="text-sm text-white/35 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[11px]">⚛</span>
                React + Tailwind
              </li>
              <li className="text-sm text-white/35 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center text-[11px]">🍃</span>
                Express + MongoDB
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.15em] mb-5">Stay Updated</h4>
            <p className="text-sm text-white/30 mb-4 leading-relaxed">
              Get notified about new books and community updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/40 transition"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/18 border border-white/10 hover:border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  <><span className="text-teal-400">✓</span> Subscribed!</>
                ) : (
                  <><Send size={13} /> Subscribe</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} LitFerns. Made with <span className="text-rose-400/60">♥</span> for book lovers.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <Leaf size={11} className="text-teal-600" />
            <span>Swap more, waste less.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;