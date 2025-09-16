import { Link } from 'react-router-dom';
import { BookOpen, ShoppingCart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#f5f5eb] py-4 sticky top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="text-[#2a6049]" size={28} />
          <span className="text-2xl font-black text-[#2a6049]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            LITFERNS
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/browse" className="text-[#333] hover:text-[#2a6049] transition-colors font-medium">
            Browse
          </Link>
          <Link to="/dashboard" className="text-[#333] hover:text-[#2a6049] transition-colors font-medium">
            Dashboard
          </Link>
          <Link to="/profile" className="text-[#333] hover:text-[#2a6049] transition-colors font-medium">
            Profile
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link to="/login" className="bg-[#2a6049] text-white flex items-center gap-2 px-5 py-2 rounded-full hover:bg-[#1e4835] transition-colors font-bold">
            Login
          </Link>
          <Link to="/cart" className="bg-[#2a6049] h-12 w-12 rounded-full flex items-center justify-center text-white relative">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#f8b056] text-[#2a6049] text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;