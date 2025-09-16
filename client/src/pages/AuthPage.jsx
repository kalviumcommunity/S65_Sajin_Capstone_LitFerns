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

    const baseUrl = import.meta.env.VITE_API_URL;
    const url = isLogin ? `${baseUrl}/api/users/login` : `${baseUrl}/api/users`;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const { data } = await axios.post(url, payload);
      // NOTE: We will save user info to global state later
      console.log('Success:', data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4 relative">
      
      {/* Top Right Navigation */}
      <div className="absolute top-6 right-6 flex items-center space-x-4 z-20">
        <div className="flex items-center text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-400 rounded-full mr-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
          <span className="text-sm">English</span>
        </div>
        
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-lg text-sm"
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl flex bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center items-center mb-6">
                <div className="w-8 h-8 bg-orange-400 rounded-full mr-3"></div>
                <span className="text-xl font-semibold text-gray-800">BookSwap</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Agent Login' : 'Create Account'}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {isLogin 
                  ? 'Hey, Enter your details to get sign in to your account'
                  : 'Hey, Enter your details to create your new account'
                }
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name - Only for Signup */}
              {!isLogin && (
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Full Name"
                    required
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email / Phone No"
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passcode"
                  required
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-gray-800 placeholder-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Forgot Password - Only for Login */}
              {isLogin && (
                <div className="text-left">
                  <button
                    type="button"
                    className="text-gray-600 text-sm hover:text-orange-600 transition-colors"
                  >
                    Having trouble in sign in?
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg flex items-center justify-center"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin w-5 h-5" />
                ) : (
                  isLogin ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm">Or Sign in with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Google Sign In */}
            <button className="w-full flex items-center justify-center px-6 py-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors mb-6">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Google</span>
            </button>

            {/* Toggle Login/Signup */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-100 to-amber-100 items-center justify-center p-12 relative overflow-hidden">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200/30 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-amber-200/40 rounded-full"></div>
          <div className="absolute top-1/3 right-10 w-12 h-12 bg-orange-300/20 rounded-full"></div>
          
          {/* Wavy Lines */}
          <svg className="absolute top-20 right-1/4 w-32 h-16 text-orange-200" fill="currentColor" viewBox="0 0 100 20">
            <path d="M0,10 Q25,0 50,10 T100,10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M0,15 Q25,5 50,15 T100,15" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"/>
          </svg>

          {/* Main Illustration */}
          <div className="relative z-10">
            {/* Person Reading */}
            <div className="relative">
              {/* Sitting Surface */}
              <div className="w-64 h-32 bg-white rounded-2xl shadow-lg mb-8 relative">
                <div className="absolute -right-8 -top-4 w-24 h-24 bg-orange-300 rounded-2xl"></div>
                <div className="absolute -right-4 top-12 w-4 h-4 bg-gray-800 rounded-full"></div>
                <div className="absolute -right-2 top-16 w-3 h-3 bg-gray-800 rounded-full"></div>
                <div className="absolute right-2 top-20 w-2 h-2 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Person Figure */}
              <div className="absolute -top-16 left-12">
                {/* Head */}
                <div className="w-16 h-16 bg-gray-800 rounded-full mb-2 relative">
                  {/* Hair */}
                  <div className="absolute -top-2 -left-2 w-20 h-12 bg-gray-900 rounded-full"></div>
                </div>
                
                {/* Body */}
                <div className="w-12 h-20 bg-gray-800 rounded-t-lg mx-2"></div>
                
                {/* Arms */}
                <div className="absolute top-16 -left-4 w-8 h-3 bg-gray-800 rounded-full transform rotate-45"></div>
                <div className="absolute top-16 right-0 w-8 h-3 bg-gray-800 rounded-full transform -rotate-45"></div>
                
                {/* Legs */}
                <div className="flex justify-center mt-2 space-x-2">
                  <div className="w-3 h-12 bg-gray-800 rounded-full"></div>
                  <div className="w-3 h-12 bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Feet */}
                <div className="flex justify-center space-x-4 mt-1">
                  <div className="w-6 h-3 bg-gray-900 rounded-full"></div>
                  <div className="w-6 h-3 bg-gray-900 rounded-full"></div>
                </div>
              </div>
              
              {/* Book */}
              <div className="absolute -top-8 left-16 w-8 h-12 bg-orange-400 rounded transform rotate-12 shadow-lg"></div>
              
              {/* Floating Document */}
              <div className="absolute top-4 left-4 w-16 h-20 bg-white rounded-lg shadow-lg transform rotate-12">
                <div className="p-2 space-y-1">
                  <div className="h-1 bg-gray-300 rounded"></div>
                  <div className="h-1 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Decorative Elements */}
          <div className="absolute bottom-10 left-20 w-8 h-8 bg-orange-200/50 rounded-full"></div>
          <div className="absolute top-40 left-4 w-6 h-6 bg-amber-200/60 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;