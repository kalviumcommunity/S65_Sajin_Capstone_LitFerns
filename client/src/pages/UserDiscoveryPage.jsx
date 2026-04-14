import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Heart, User, Mail, Star } from 'lucide-react';

export default function UserDiscoveryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [followStatus, setFollowStatus] = useState({});

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError('');
        try {
            const { data } = await axios.get('/api/follow/search', {
                params: { q: searchQuery, limit: 20 },
            });
            setUsers(data);
            
            // Track follow status for each user
            const statusMap = {};
            data.forEach(user => {
                statusMap[user._id] = user.isFollowing;
            });
            setFollowStatus(statusMap);
        } catch (err) {
            setError('Failed to search users');
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async (userId, isFollowing) => {
        try {
            if (isFollowing) {
                await axios.delete(`/api/follow/${userId}`);
            } else {
                await axios.post(`/api/follow/${userId}`);
            }
            
            setFollowStatus(prev => ({
                ...prev,
                [userId]: !isFollowing,
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update follow status');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Discover Readers</h1>
                <p className="text-indigo-200 mb-8">Find and follow your favorite book lovers in the community</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3 text-indigo-400" size={24} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </form>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Users Grid */}
                {loading ? (
                    <div className="text-center text-indigo-300">
                        <p>Searching...</p>
                    </div>
                ) : users.length === 0 && searchQuery ? (
                    <div className="text-center text-indigo-300">
                        <p>No users found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((userItem) => (
                            <div
                                key={userItem._id}
                                className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6 hover:border-indigo-500 transition"
                            >
                                {/* User Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{userItem.name}</h3>
                                        <p className="text-sm text-indigo-300 flex items-center gap-1">
                                            <Mail size={14} /> {userItem.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleFollow(userItem._id, followStatus[userItem._id])}
                                        className={`px-3 py-2 rounded-lg font-medium transition flex items-center gap-1 ${
                                            followStatus[userItem._id]
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-indigo-700/50 text-indigo-100 hover:bg-indigo-600'
                                        }`}
                                    >
                                        <Heart size={16} />
                                        {followStatus[userItem._id] ? 'Following' : 'Follow'}
                                    </button>
                                </div>

                                {/* User Info */}
                                <div className="space-y-2 mb-4">
                                    {userItem.location && (
                                        <p className="text-sm text-indigo-200">📍 {userItem.location}</p>
                                    )}
                                    {userItem.bio && (
                                        <p className="text-sm text-indigo-200 line-clamp-2">{userItem.bio}</p>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-indigo-700">
                                    <div>
                                        <p className="text-xs text-indigo-400">Rating</p>
                                        <p className="flex items-center gap-1 text-white font-bold">
                                            <Star size={14} className="text-yellow-400" />
                                            {userItem.averageRating.toFixed(1)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-400">Successful Swaps</p>
                                        <p className="text-white font-bold">{userItem.successfulSwaps}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!searchQuery && users.length === 0 && !loading && (
                    <div className="text-center">
                        <User size={64} className="text-indigo-600 mx-auto mb-4" />
                        <p className="text-indigo-300 text-xl mb-4">Start searching to discover amazing readers!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
