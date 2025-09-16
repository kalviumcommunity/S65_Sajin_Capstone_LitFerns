import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { Search, BookOpen, RefreshCw, Users, Leaf, Shield } from 'lucide-react';
import { useState } from 'react';

const mockFeaturedBooks = [
  {
    _id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    imageUrl: 'https://m.media-amazon.com/images/I/81tCtHFtOgL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '2',
    title: 'Poverty By Design',
    author: 'Jason Hickel',
    genre: 'Non-Fiction',
    imageUrl: 'https://m.media-amazon.com/images/I/71jvBsD4q0L._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '3',
    title: 'The Overstory',
    author: 'Richard Powers',
    genre: 'Fiction',
    imageUrl: 'https://m.media-amazon.com/images/I/71QUhm-AnIL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '4',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    imageUrl: 'https://m.media-amazon.com/images/I/81NwOj14S6L._AC_UF1000,1000_QL80_.jpg'
  }
];

const mockRecentBooks = [
  {
    _id: '5',
    title: 'A Gentleman in Moscow',
    author: 'Amor Towles',
    genre: 'Historical Fiction',
    imageUrl: 'https://m.media-amazon.com/images/I/91N40ybkCdL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '6',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Thriller',
    imageUrl: 'https://m.media-amazon.com/images/I/81yfsIOijJL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    imageUrl: 'https://m.media-amazon.com/images/I/81wgcld4wxL._AC_UF1000,1000_QL80_.jpg'
  },
  {
    _id: '8',
    title: 'Notebook',
    author: 'Journal',
    genre: 'Stationery',
    imageUrl: 'https://m.media-amazon.com/images/I/61ldULU7xnL._AC_UF1000,1000_QL80_.jpg'
  }
];

const communityMembers = [
  { id: 1, name: 'Alex Smith', books: 12, image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Maria Garcia', books: 8, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'John Wilson', books: 15, image: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-white">
      {/* Hero Section with Library Background */}
      <section 
        className="relative bg-cover bg-center py-32 text-white text-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000&auto=format&fit=crop)'
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Stories, Exchange Dreams</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join a community of book lovers. Swap books you've read for ones you crave.</p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search by title, author, or genre..."
              className="w-full py-3 px-5 pr-12 rounded-full text-gray-800 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
              <Search size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Books</h3>
              <p className="text-gray-600">Add books you're willing to swap to your collection</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request a Swap</h3>
              <p className="text-gray-600">Find a book you want and request to swap with the owner</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Exchange</h3>
              <p className="text-gray-600">Arrange the exchange and enjoy your new read</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Books</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockFeaturedBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added Books */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Recently Added</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockRecentBooks.map(book => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Vibrant Community</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {communityMembers.map(member => (
              <div key={member.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.books} books shared</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why LitFerns Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why LitFerns?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Leaf className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Sustainable Reading</h3>
                <p className="text-gray-600">Reduce waste and give books a second life by sharing with others in your community</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="text-green-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Trustworthy Swaps</h3>
                <p className="text-gray-600">Our community guidelines and rating system ensure quality exchanges every time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Readers Say */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Readers Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">"I've discovered so many amazing books I would have never found otherwise. The community is fantastic!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold">Sarah J.</p>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">"As a student, this platform has saved me so much money on textbooks and novels for my literature classes."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold">Michael T.</p>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="italic text-gray-600 mb-4">"I love the environmental aspect of reusing books. Plus, I've made friends with similar reading tastes!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-semibold">David R.</p>
                  <div className="flex text-yellow-400">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amber-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Next Chapter?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of readers who are already swapping books on our platform</p>
          
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Get Started
            </Link>
            <Link to="/browse" className="bg-white text-green-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;