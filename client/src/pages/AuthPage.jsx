import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, ArrowRight, BookOpen, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  .auth-display { font-family: 'Playfair Display', Georgia, serif; }
  .auth-body    { font-family: 'DM Sans', system-ui, sans-serif; }

  @keyframes authFadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes authSlide {
    from { opacity: 0; transform: translateX(12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .auth-fade-up  { animation: authFadeUp 0.55s cubic-bezier(.22,1,.36,1) both; }
  .auth-slide    { animation: authSlide  0.3s cubic-bezier(.22,1,.36,1) both; }
  .auth-float-1  { animation: float 4s ease-in-out infinite; }
  .auth-float-2  { animation: float 5.5s ease-in-out infinite 0.8s; }
  .auth-float-3  { animation: float 3.8s ease-in-out infinite 1.6s; }

  .auth-marquee-track { animation: marquee 22s linear infinite; }
  .auth-marquee-wrap:hover .auth-marquee-track { animation-play-state: paused; }

  .auth-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(20,184,166,0.25); border-color: #14b8a6; }

  /* Grain overlay on left panel */
  .auth-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }
`;

const genres = ['Fiction', 'Mystery', 'Sci-Fi', 'Fantasy', 'Memoir', 'Thriller', 'Classic', 'Poetry', 'Romance', 'Biography', 'Non-Fiction', 'Horror'];

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] auth-body flex">
      <style>{authStyles}</style>

      {/* ── Left panel — dark editorial ── */}
      <div className="auth-panel hidden lg:flex lg:w-[52%] bg-[#021a0f] flex-col relative overflow-hidden">

        {/* Background library photo */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80')" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#021a0f]/95 via-[#021a0f]/80 to-teal-900/60" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-12 py-10">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
              <Leaf size={16} className="text-teal-400" />
            </div>
            <span className="auth-display text-white text-lg font-bold tracking-tight">LitFerns</span>
          </div>

          {/* Hero copy */}
          <div className="mt-auto mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-teal-500" />
              <p className="text-teal-500 text-[11px] font-medium tracking-[0.2em] uppercase">The Community Library</p>
            </div>
            <h2 className="auth-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Where books<br />
              find new<br />
              <span className="italic font-normal text-teal-300">readers.</span>
            </h2>
            <p className="text-white/45 text-sm leading-relaxed max-w-xs">
              Join thousands of readers swapping books they love with people who'll love them next.
            </p>
          </div>

          {/* Floating stat cards */}
          <div className="flex gap-3 mb-10">
            <div className="auth-float-1 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-teal-500/20 rounded-xl flex items-center justify-center">
                <BookOpen size={16} className="text-teal-400" />
              </div>
              <div>
                <p className="text-white text-lg font-bold leading-none">12k+</p>
                <p className="text-white/40 text-[10px] mt-0.5">Books listed</p>
              </div>
            </div>
            <div className="auth-float-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <RefreshCw size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white text-lg font-bold leading-none">8k+</p>
                <p className="text-white/40 text-[10px] mt-0.5">Swaps done</p>
              </div>
            </div>
          </div>

          {/* Genre ticker */}
          <div className="auth-marquee-wrap overflow-hidden -mx-12 mb-0">
            <div className="auth-marquee-track flex gap-3 whitespace-nowrap w-max">
              {[...genres, ...genres].map((g, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 bg-white/6 border border-white/8 text-white/40 text-[11px] font-medium px-3 py-1.5 rounded-full">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — auth form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 lg:px-16">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-[#021a0f] rounded-xl flex items-center justify-center">
            <Leaf size={14} className="text-teal-400" />
          </div>
          <span className="auth-display text-[#021a0f] text-lg font-bold tracking-tight">LitFerns</span>
        </div>

        <div className="w-full max-w-sm auth-fade-up">

          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-px bg-teal-500" />
              <p className="text-teal-600 text-[11px] font-medium tracking-[0.18em] uppercase">
                {isLogin ? 'Welcome back' : 'Get started'}
              </p>
            </div>
            <h1 className="auth-display text-3xl font-bold text-[#021a0f] leading-tight">
              {isLogin ? (
                <>Sign <span className="italic font-normal text-teal-600">in</span></>
              ) : (
                <>Create<br /><span className="italic font-normal text-teal-600">account</span></>
              )}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              {isLogin
                ? 'Enter your details to continue.'
                : 'Join the community in seconds.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="auth-slide">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-400 transition"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-400 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-sm text-gray-900 placeholder-gray-400 transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-[11px] text-gray-400 mt-1.5 ml-0.5">Minimum 6 characters</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#021a0f] hover:bg-teal-900 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait…
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {/* Trust note */}
          <p className="text-center text-[11px] text-gray-400 mt-6 leading-relaxed">
            By continuing, you agree to LitFerns'<br />
            <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">Terms</span>
            {' '}and{' '}
            <span className="underline underline-offset-2 cursor-pointer hover:text-gray-600 transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;