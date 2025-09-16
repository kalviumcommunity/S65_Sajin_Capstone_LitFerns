import React, { useState } from 'react';
import BookCard from '../components/BookCard';

const mockUser = {
    name: 'Sajin George', location: 'Kerala, India', memberSince: 'July 2025',
};
const myBooks = [
    { _id: '1', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller' },
    { _id: '5', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic' },
];

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('my-books');

    return (
        <div className="grid md:grid-cols-4 gap-8">
            <aside className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <div className="w-24 h-24 rounded-full bg-green-200 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold">{mockUser.name}</h2>
                    <p className="text-gray-600">{mockUser.location}</p>
                    <p className="text-sm text-gray-500 mt-2">Member since {mockUser.memberSince}</p>
                </div>
            </aside>

            <main className="md:col-span-3">
                <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex gap-6" aria-label="Tabs">
                         <button onClick={() => setActiveTab('my-books')} className={`${activeTab === 'my-books' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            My Books
                        </button>
                         <button onClick={() => setActiveTab('wishlist')} className={`${activeTab === 'wishlist' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            Wishlist
                        </button>
                    </nav>
                </div>
                <div>
                    {activeTab === 'my-books' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myBooks.map(book => ( <BookCard key={book._id} book={book} /> ))}
                        </div>
                    )}
                    {activeTab === 'wishlist' && (
                        <p>Your wishlist is empty.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserProfilePage;