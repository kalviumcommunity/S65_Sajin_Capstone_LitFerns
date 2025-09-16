import React from 'react';
import BookCard from '../components/BookCard';
import { Search } from 'lucide-react';

const mockAllBooks = [
    { _id: '1', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller' },
    { _id: '2', title: 'Educated', author: 'Tara Westover', genre: 'Memoir' },
    { _id: '3', title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Fiction' },
    { _id: '4', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help' },
    { _id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
    { _id: '6', title: '1984', author: 'George Orwell', genre: 'Dystopian' },
    { _id: '7', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction' },
    { _id: '8', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi' },
];
const genres = ['All', 'Thriller', 'Memoir', 'Fiction', 'Self-Help', 'Classic', 'Dystopian', 'Sci-Fi'];

const BrowsePage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-1/4 space-y-6">
        <h3 className="text-xl font-bold">Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search by title or author..." className="w-full pl-10 pr-4 py-2 border rounded-lg" />
        </div>
        <div>
          <h4 className="font-semibold mb-2">Genre</h4>
          <ul className="space-y-1">
            {genres.map(genre => (
              <li key={genre}>
                <a href="#" className="text-gray-600 hover:text-green-600">{genre}</a>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="w-full md:w-3/4">
        <h2 className="text-3xl font-bold mb-6">Discover Your Next Read</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAllBooks.map(book => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default BrowsePage;