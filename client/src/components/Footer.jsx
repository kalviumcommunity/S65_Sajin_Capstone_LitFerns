import { BookOpen, Instagram, Twitter, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#192c23] text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <BookOpen size={28} />
              <span className="text-2xl font-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                LITFERNS
              </span>
            </Link>
            <p className="text-sm opacity-80">
              Share stories, exchange dreams. Join our community of book lovers today.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/browse" className="hover:underline">Browse Books</Link></li>
              <li><Link to="/dashboard" className="hover:underline">Swap Dashboard</Link></li>
              <li><Link to="/profile" className="hover:underline">My Profile</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="bg-white text-[#2a6049] p-2 rounded-full hover:bg-[#f8b056] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white text-[#2a6049] p-2 rounded-full hover:bg-[#f8b056] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-white text-[#2a6049] p-2 rounded-full hover:bg-[#f8b056] transition-colors">
                <Facebook size={20} />
              </a>
            </div>
            <p className="text-sm opacity-80">Subscribe to our newsletter</p>
            <div className="mt-2 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 rounded-l-full text-gray-800 w-full"
              />
              <button className="bg-[#f8b056] text-[#2a6049] font-bold px-4 rounded-r-full">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} LitFerns. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;