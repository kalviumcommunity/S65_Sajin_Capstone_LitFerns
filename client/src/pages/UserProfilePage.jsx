/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { User, Edit3, LogOut, Plus, BookOpen, Heart, Upload, Loader2 } from 'lucide-react';

const UserProfilePage = () => {
    const [activeTab, setActiveTab] = useState('my-books');
    const [profile, setProfile] = useState(null);
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [condition, setCondition] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [wishlist, _setWishlist] = useState(() => {
        try {
            const raw = localStorage.getItem('wishlist');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const loadMyBooks = async () => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.get('/api/books/mybooks', { withCredentials: true });
            setMyBooks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load your books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axios.get('/api/users/profile', { withCredentials: true });
                setProfile(data);
            } catch {}
            await loadMyBooks();
        };
        load();
    }, []);

    const handleAddBook = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            let imagePath = '';
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await axios.post('/api/uploads', formData, {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imagePath = uploadRes.data?.image || '';
            }

            await axios.post('/api/books', {
                title,
                author,
                genre,
                condition,
                image: imagePath,
            }, { withCredentials: true });

            setTitle('');
            setAuthor('');
            setGenre('');
            setCondition('');
            setImageFile(null);
            setShowAddForm(false);
            await loadMyBooks();
            setActiveTab('my-books');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add book');
        } finally {
            setSubmitting(false);
        }
    };

    const wishlistBooks = useMemo(() => wishlist, [wishlist]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Enhanced Sidebar */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <User className="text-white" size={28} />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Profile</h2>
                                        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-1"></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="bg-gray-50/50 rounded-2xl p-4 backdrop-blur-sm">
                                        <p className="text-sm text-gray-500 mb-1">Name</p>
                                        <p className="font-semibold text-gray-800">{profile?.name}</p>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-2xl p-4 backdrop-blur-sm">
                                        <p className="text-sm text-gray-500 mb-1">Email</p>
                                        <p className="font-medium text-gray-700">{profile?.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={async () => {
                                            const newName = prompt('Update name', profile?.name || '') || profile?.name;
                                            if (!newName) return;
                                            try {
                                                const { data } = await axios.put('/api/users/profile', { name: newName }, { withCredentials: true });
                                                setProfile(data);
                                            } catch (e) { alert(e.response?.data?.message || 'Update failed'); }
                                        }} 
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button 
                                        onClick={async () => {
                                            try {
                                                await axios.post('/api/users/logout', {}, { withCredentials: true });
                                                window.location.href = '/';
                                            } catch (e) { alert(e.response?.data?.message || 'Logout failed'); }
                                        }} 
                                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Add Book Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                            <div className="relative z-10">
                                <button 
                                    onClick={() => setShowAddForm(!showAddForm)} 
                                    className="w-full p-6 text-left group hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                                            <Plus className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">Add a Book</h3>
                                            <p className="text-sm text-gray-500">Share your collection</p>
                                        </div>
                                    </div>
                                </button>
                                
                                {showAddForm && (
                                    <div className="px-6 pb-6 border-t border-gray-100/50">
                                        <form onSubmit={handleAddBook} className="space-y-4 mt-4">
                                            <div className="group">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                                                <input 
                                                    value={title} 
                                                    onChange={(e) => setTitle(e.target.value)} 
                                                    className="w-full border border-gray-200/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md" 
                                                    placeholder="Enter book title" 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div className="group">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                                                <input 
                                                    value={author} 
                                                    onChange={(e) => setAuthor(e.target.value)} 
                                                    className="w-full border border-gray-200/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md" 
                                                    placeholder="Author name" 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div className="group">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                                                <input 
                                                    value={genre} 
                                                    onChange={(e) => setGenre(e.target.value)} 
                                                    className="w-full border border-gray-200/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md" 
                                                    placeholder="Book genre" 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div className="group">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                                                <select 
                                                    value={condition} 
                                                    onChange={(e) => setCondition(e.target.value)} 
                                                    className="w-full border border-gray-200/50 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md" 
                                                    required
                                                >
                                                    <option value="">Select condition</option>
                                                    <option value="New">New</option>
                                                    <option value="Like New">Like New</option>
                                                    <option value="Good">Good</option>
                                                    <option value="Fair">Fair</option>
                                                    <option value="Poor">Poor</option>
                                                </select>
                                            </div>
                                            
                                            <div className="group">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Book Image</label>
                                                <div className="relative">
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)} 
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                    />
                                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-green-400 hover:bg-green-50/30 transition-all duration-300 cursor-pointer">
                                                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                                        <p className="text-sm text-gray-500">
                                                            {imageFile ? imageFile.name : 'Click to upload image'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {error && (
                                                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-3 animate-fadeIn">
                                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                                </div>
                                            )}
                                            
                                            <button 
                                                type="submit" 
                                                disabled={submitting} 
                                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl py-3 font-semibold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="animate-spin" size={16} />
                                                        Adding Book...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={16} />
                                                        Add Book
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Enhanced Main Content */}
                    <main className="lg:col-span-3">
                        {/* Enhanced Tab Navigation */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 mb-8 overflow-hidden">
                            <nav className="flex" aria-label="Tabs">
                                <button 
                                    onClick={() => setActiveTab('my-books')} 
                                    className={`flex-1 py-6 px-8 text-center font-semibold transition-all duration-300 relative group ${
                                        activeTab === 'my-books' 
                                            ? 'text-blue-600 bg-gradient-to-r from-blue-50/80 to-purple-50/80' 
                                            : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/30'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <BookOpen size={20} />
                                        <span>My Books</span>
                                        {myBooks.length > 0 && (
                                            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                                {myBooks.length}
                                            </span>
                                        )}
                                    </div>
                                    {activeTab === 'my-books' && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                    )}
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab('wishlist')} 
                                    className={`flex-1 py-6 px-8 text-center font-semibold transition-all duration-300 relative group ${
                                        activeTab === 'wishlist' 
                                            ? 'text-pink-600 bg-gradient-to-r from-pink-50/80 to-rose-50/80' 
                                            : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50/30'
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-3">
                                        <Heart size={20} />
                                        <span>Wishlist</span>
                                        {wishlistBooks.length > 0 && (
                                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-1 rounded-full">
                                                {wishlistBooks.length}
                                            </span>
                                        )}
                                    </div>
                                    {activeTab === 'wishlist' && (
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500"></div>
                                    )}
                                </button>
                            </nav>
                        </div>

                        {/* Enhanced Content Area */}
                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 min-h-[600px]">
                            {activeTab === 'my-books' && (
                                <>
                                    {loading && (
                                        <div className="flex items-center justify-center py-20">
                                            <div className="text-center">
                                                <Loader2 className="animate-spin mx-auto mb-4 text-blue-500" size={32} />
                                                <p className="text-gray-600">Loading your amazing book collection...</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {error && (
                                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 mb-6">
                                            <p className="text-red-600 font-medium">{error}</p>
                                        </div>
                                    )}
                                    
                                    {!loading && myBooks.length === 0 && !error && (
                                        <div className="text-center py-20">
                                            <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No books yet</h3>
                                            <p className="text-gray-500 mb-6">Start building your collection by adding your first book!</p>
                                            <button 
                                                onClick={() => setShowAddForm(true)}
                                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                Add Your First Book
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {myBooks.map(book => (
                                            <div key={book._id} className="relative group">
                                                <BookCard book={book} />
                                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
                                                    <button 
                                                        onClick={async () => {
                                                            const newTitle = prompt('Update title', book.title) || book.title;
                                                            const newAuthor = prompt('Update author', book.author) || book.author;
                                                            try {
                                                                await axios.put(`/api/books/${book._id}`, { title: newTitle, author: newAuthor }, { withCredentials: true });
                                                                await loadMyBooks();
                                                            } catch (e) { alert(e.response?.data?.message || 'Update failed'); }
                                                        }} 
                                                        className="px-3 py-2 text-xs bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200"
                                                    >
                                                        <Edit3 size={12} />
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (!confirm('Delete this book?')) return;
                                                            try {
                                                                await axios.delete(`/api/books/${book._id}`, { withCredentials: true });
                                                                await loadMyBooks();
                                                            } catch (e) { alert(e.response?.data?.message || 'Delete failed'); }
                                                        }} 
                                                        className="px-3 py-2 text-xs bg-red-500/90 backdrop-blur-sm text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium hover:bg-red-600/90"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {activeTab === 'wishlist' && (
                                <>
                                    {wishlistBooks.length === 0 ? (
                                        <div className="text-center py-20">
                                            <Heart className="mx-auto mb-4 text-gray-400" size={48} />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                                            <p className="text-gray-500">Start exploring books and add them to your wishlist!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {wishlistBooks.map(book => (
                                                <BookCard key={book._id} book={book} />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserProfilePage;