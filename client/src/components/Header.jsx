import { Link } from 'react-router-dom';
import { BookOpen, User as UserIcon } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-white/95 via-blue-50/95 to-purple-50/95 backdrop-blur-lg border-b border-white/20 py-4 sticky top-0 z-50 shadow-lg">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -top-5 left-1/3 w-24 h-24 bg-gradient-to-br from-cyan-200/10 to-blue-200/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 flex justify-between items-center relative">
        {/* Enhanced Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur group-hover:blur-sm transition-all duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <BookOpen className="text-white" size={28} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
          </div>
          <span 
            className="text-2xl font-black bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-300" 
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            LITFERNS
          </span>
          <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-500"></div>
        </Link>
        
        {/* Enhanced Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: '/browse', label: 'Browse' },
            { to: '/dashboard', label: 'Swap Dashboard' },
            { to: '/profile', label: 'Profile' }
          ].map((item, index) => (
            <Link 
              key={item.to}
              to={item.to} 
              className="relative text-gray-700 hover:text-transparent hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:bg-clip-text transition-all duration-300 font-medium px-4 py-2 rounded-xl hover:bg-white/50 hover:backdrop-blur-sm hover:shadow-md group"
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-300"></div>
            </Link>
          ))}
        </nav>
        
        {/* Enhanced Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Login Button */}
          <Link 
            to="/login" 
            className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-2 px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10">Login</span>
          </Link>
          
          {/* Profile Button */}
          <Link 
            to="/profile" 
            aria-label="Profile" 
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur group-hover:blur-sm transition-all duration-300 scale-110"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3 border border-white/20">
              <UserIcon size={20} />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Animated border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent"></div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;