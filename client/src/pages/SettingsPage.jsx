import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Bell, Mail, Heart, Book, User, LogOut } from 'lucide-react';

export default function SettingsPage() {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const [settings, setSettings] = useState({
        bio: '',
        location: '',
        preferences: {
            emailNotifications: true,
            swapNotifications: true,
            messageNotifications: true,
            favoriteGenres: [],
            preferredFormats: [],
        },
    });

    const genres = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy', 'Biography', 'History'];
    const formats = ['Hardcover', 'Paperback', 'Ebook', 'Audiobook'];

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await axios.get('/api/users/settings');
            setSettings(data);
        } catch (err) {
            setError('Failed to load settings');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await axios.put('/api/users/settings', settings);
            setSuccess('Settings updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const toggleGenre = (genre) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                favoriteGenres: prev.preferences.favoriteGenres.includes(genre)
                    ? prev.preferences.favoriteGenres.filter(g => g !== genre)
                    : [...prev.preferences.favoriteGenres, genre],
            },
        }));
    };

    const toggleFormat = (format) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                preferredFormats: prev.preferences.preferredFormats.includes(format)
                    ? prev.preferences.preferredFormats.filter(f => f !== format)
                    : [...prev.preferences.preferredFormats, format],
            },
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Settings & Preferences</h1>

                {success && (
                    <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Profile Section */}
                    <div className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <User size={24} /> Profile Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-indigo-200 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={settings.bio}
                                    onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                                    className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Tell other readers about yourself..."
                                    rows="4"
                                    maxLength="500"
                                />
                                <p className="text-xs text-indigo-400 mt-1">{settings.bio.length}/500</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-indigo-200 mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={settings.location}
                                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                    className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Your location"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Bell size={24} /> Notification Preferences
                        </h2>

                        <div className="space-y-3">
                            {[
                                { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                                { key: 'swapNotifications', label: 'Swap Updates', icon: Heart },
                                { key: 'messageNotifications', label: 'Message Alerts', icon: Mail },
                            ].map(({ key, label, icon: Icon }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.preferences[key]}
                                        onChange={(e) => setSettings(prev => ({
                                            ...prev,
                                            preferences: {
                                                ...prev.preferences,
                                                [key]: e.target.checked,
                                            },
                                        }))}
                                        className="w-4 h-4 rounded border-indigo-500"
                                    />
                                    <Icon size={18} className="text-indigo-300" />
                                    <span className="text-indigo-100">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Favorite Genres */}
                    <div className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <Book size={24} /> Favorite Genres
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        settings.preferences.favoriteGenres.includes(genre)
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-indigo-900/50 text-indigo-200 border border-indigo-600'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Preferred Formats */}
                    <div className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Preferred Formats</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {formats.map((format) => (
                                <button
                                    key={format}
                                    type="button"
                                    onClick={() => toggleFormat(format)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${
                                        settings.preferences.preferredFormats.includes(format)
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-indigo-900/50 text-indigo-200 border border-indigo-600'
                                    }`}
                                >
                                    {format}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            {loading ? 'Saving...' : 'Save Settings'}
                        </button>

                        <button
                            type="button"
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center gap-2"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
