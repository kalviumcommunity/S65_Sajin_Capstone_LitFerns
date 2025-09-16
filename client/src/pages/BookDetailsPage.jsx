import React from 'react';
import { User, MapPin } from 'lucide-react';
import BookCard from '../components/BookCard';

const mockBook = {
    _id: '1', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller',
    description: 'Alicia Berenson’s life is seemingly perfect...',
    owner: { name: 'Jane Doe', location: 'San Francisco, CA' },
    imageUrl: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1582132136l/40097951._SY475_.jpg'
};
const mockSimilarBooks = [
    { _id: '9', title: 'The Guest List', author: 'Lucy Fokley', genre: 'Thriller' },
    { _id: '10', title: 'The Woman in Cabin 10', author: 'Ruth Ware', genre: 'Thriller' },
    { _id: '11', title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller' },
];

const BookDetailsPage = () => {
  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img src={mockBook.imageUrl} alt={mockBook.title} className="w-full rounded-lg shadow-lg" />
        </div>
        <div className="md:col-span-2 space-y-4">
          <h1 className="text-4xl font-bold">{mockBook.title}</h1>
          <p className="text-xl text-gray-600">by {mockBook.author}</p>
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-2"> <User size={16} /> <span>{mockBook.owner.name}</span> </div>
            <div className="flex items-center gap-2"> <MapPin size={16} /> <span>{mockBook.owner.location}</span> </div>
          </div>
          <p className="text-lg leading-relaxed">{mockBook.description}</p>
          <button className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors text-lg">
            Request Swap
          </button>
        </div>
      </div>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockSimilarBooks.map(book => ( <BookCard key={book._id} book={book} /> ))}
        </div>
      </section>
    </div>
  );
};

export default BookDetailsPage;