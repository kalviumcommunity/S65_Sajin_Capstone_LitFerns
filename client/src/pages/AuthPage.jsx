import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const baseUrl = import.meta.env.VITE_API_URL || '';
    const url = isLogin ? `${baseUrl}/api/users/login` : `${baseUrl}/api/users`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const { data } = await axios.post(url, payload, { withCredentials: true });
      console.log('Success:', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-200/10 to-orange-200/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 relative">
          <div className="max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-6 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">LitFerns</span>
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-3">
                {isLogin ? 'Welcome Back!' : 'Join LitFerns'}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                {isLogin 
                  ? 'Enter your credentials to access your account and continue your reading journey'
                  : 'Create your account and start discovering amazing books with fellow readers'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name - Only for Signup */}
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="relative w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:shadow-md"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="relative w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:shadow-md"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="relative w-full px-5 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500 shadow-sm hover:shadow-md pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200 bg-white/50 px-2 py-1 rounded-lg hover:bg-white/80"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Forgot Password - Only for Login */}
              {isLogin && (
                <div className="text-left">
                  <button
                    type="button"
                    className="text-gray-600 text-sm hover:text-blue-600 transition-colors duration-200 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-4 animate-fadeIn">
                  <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {loading ? (
                  <LoaderCircle className="animate-spin w-5 h-5" />
                ) : (
                  <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <span className="px-6 text-gray-500 text-sm font-medium bg-white/50 rounded-full">Or continue with</span>
              <div className="flex-1 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
            </div>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center px-6 py-4 border border-gray-200/50 rounded-2xl hover:bg-white/80 hover:border-gray-300/50 transition-all duration-300 mb-6 shadow-sm hover:shadow-md backdrop-blur-sm group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <svg className="w-5 h-5 mr-3 relative z-10" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium relative z-10">Continue with Google</span>
            </button>

            {/* Toggle Login/Signup */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                {isLogin ? "New to LitFerns? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors duration-200 hover:underline"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 items-center justify-center p-12 relative overflow-hidden">
          
          {/* Enhanced Background Decorative Elements */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-br from-cyan-200/50 to-blue-200/50 rounded-full blur-lg animate-float-delayed"></div>
          <div className="absolute top-1/3 right-10 w-16 h-16 bg-gradient-to-br from-purple-300/30 to-pink-200/30 rounded-full blur-md animate-pulse"></div>
          
          {/* Enhanced Wavy Lines */}
          <svg className="absolute top-20 right-1/4 w-40 h-20 text-blue-200" fill="currentColor" viewBox="0 0 100 20">
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(147 197 253)" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="rgb(139 92 246)" stopOpacity="0.2"/>
                <stop offset="100%" stopColor="rgb(147 197 253)" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M0,10 Q25,0 50,10 T100,10" stroke="url(#waveGrad)" strokeWidth="3" fill="none" className="animate-pulse"/>
            <path d="M0,15 Q25,5 50,15 T100,15" stroke="url(#waveGrad)" strokeWidth="2" fill="none" className="animate-pulse delay-500"/>
          </svg>

          {/* Enhanced Main Illustration */}
          <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              {/* Enhanced Sitting Surface */}
              <div className="w-72 h-36 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl mb-8 relative border border-white/20">
                <div className="absolute -right-10 -top-6 w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl shadow-lg transform rotate-12 animate-float"></div>
                
                {/* Floating particles */}
                <div className="absolute -right-6 top-14 w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="absolute -right-3 top-18 w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                <div className="absolute right-1 top-22 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce delay-400"></div>
              </div>
              
              {/* Enhanced Person Figure */}
              <div className="absolute -top-20 left-14">
                {/* Head with gradient */}
                <div className="w-18 h-18 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mb-2 relative shadow-lg">
                  <div className="absolute -top-2 -left-2 w-22 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full"></div>
                  {/* Face features */}
                  <div className="absolute top-6 left-6 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-white/80 rounded-full"></div>
                </div>
                
                {/* Enhanced Body */}
                <div className="w-14 h-24 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-2xl mx-2 shadow-md"></div>
                
                {/* Enhanced Arms */}
                <div className="absolute top-18 -left-5 w-10 h-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transform rotate-45 shadow-sm"></div>
                <div className="absolute top-18 right-1 w-10 h-4 bg-gradient-to-l from-blue-600 to-blue-800 rounded-full transform -rotate-45 shadow-sm"></div>
                
                {/* Enhanced Legs */}
                <div className="flex justify-center mt-2 space-x-3">
                  <div className="w-4 h-14 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-sm"></div>
                  <div className="w-4 h-14 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-sm"></div>
                </div>
                
                {/* Enhanced Feet */}
                <div className="flex justify-center space-x-5 mt-1">
                  <div className="w-7 h-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-sm"></div>
                  <div className="w-7 h-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full shadow-sm"></div>
                </div>
              </div>
              
              {/* Enhanced Book */}
              <div className="absolute -top-10 left-18 w-10 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg transform rotate-12 shadow-xl border border-orange-300/50 animate-float">
                <div className="absolute inset-1 bg-gradient-to-br from-orange-300 to-red-400 rounded-md opacity-80"></div>
                <div className="absolute top-2 left-2 right-2 h-0.5 bg-white/60 rounded"></div>
                <div className="absolute top-4 left-2 right-2 h-0.5 bg-white/40 rounded"></div>
              </div>
              
              {/* Enhanced Floating Document */}
              <div className="absolute top-6 left-6 w-18 h-24 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl transform rotate-12 border border-white/30 animate-float-delayed">
                <div className="p-3 space-y-2">
                  <div className="h-1.5 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full"></div>
                  <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-4/5"></div>
                  <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-3/5"></div>
                  <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-4/5"></div>
                  <div className="h-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full w-2/3"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Enhanced Decorative Elements */}
          <div className="absolute bottom-12 left-24 w-10 h-10 bg-gradient-to-br from-cyan-200/60 to-blue-200/60 rounded-full animate-pulse"></div>
          <div className="absolute top-44 left-6 w-8 h-8 bg-gradient-to-br from-purple-200/70 to-pink-200/70 rounded-full animate-pulse delay-300"></div>
          
          {/* Floating books */}
          <div className="absolute top-16 left-16 w-6 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded transform rotate-45 shadow-md animate-float opacity-60"></div>
          <div className="absolute bottom-32 right-12 w-5 h-7 bg-gradient-to-br from-pink-400 to-rose-500 rounded transform -rotate-12 shadow-md animate-float-delayed opacity-60"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-8px) rotate(12deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;