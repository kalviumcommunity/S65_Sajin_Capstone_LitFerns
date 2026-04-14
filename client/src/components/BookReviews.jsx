import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function BookReviews({ bookId }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        rating: 5,
        title: '',
        comment: '',
    });

    useEffect(() => {
        if (bookId) {
            fetchReviews();
        }
    }, [bookId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/reviews/book/${bookId}`, {
                params: { sort: 'newest', limit: 20 },
            });
            setReviews(data.reviews);
            
            // Check if user has already reviewed
            const existingReview = data.reviews.find(r => r.user._id === user?._id);
            setUserReview(existingReview);
        } catch (err) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim() || !formData.comment.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            if (userReview) {
                // Update existing review
                const { data } = await axios.put(`/api/reviews/${userReview._id}`, formData);
                setReviews(reviews.map(r => (r._id === data._id ? data : r)));
                setUserReview(data);
            } else {
                // Create new review
                const { data } = await axios.post('/api/reviews', {
                    bookId,
                    ...formData,
                });
                setReviews([data, ...reviews]);
                setUserReview(data);
            }
            
            setFormData({ rating: 5, title: '', comment: '' });
            setShowForm(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`/api/reviews/${reviewId}`);
            setReviews(reviews.filter(r => r._id !== reviewId));
            setUserReview(null);
        } catch (err) {
            setError('Failed to delete review');
        }
    };

    const handleMarkHelpful = async (reviewId) => {
        try {
            const { data } = await axios.put(`/api/reviews/${reviewId}/helpful`);
            setReviews(reviews.map(r => (r._id === data._id ? data : r)));
        } catch (err) {
            console.error('Failed to mark helpful:', err);
        }
    };

    if (loading) {
        return <div className="text-indigo-300">Loading reviews...</div>;
    }

    return (
        <div className="space-y-6">
            {/* User Review Form */}
            {user && (
                <div className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-xl p-6">
                    {!showForm && !userReview ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition"
                        >
                            Write a Review
                        </button>
                    ) : showForm ? (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <h3 className="text-lg font-bold text-white">
                                {userReview ? 'Edit Your Review' : 'Write Your Review'}
                            </h3>

                            {error && (
                                <p className="text-red-300 bg-red-500/20 p-2 rounded">{error}</p>
                            )}

                            <div>
                                <label className="block text-indigo-200 font-medium mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`text-3xl transition ${
                                                star <= formData.rating ? 'text-yellow-400' : 'text-indigo-600'
                                            }`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-indigo-200 font-medium mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Summarize your review"
                                    maxLength="150"
                                    className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-indigo-200 font-medium mb-2">Comment</label>
                                <textarea
                                    value={formData.comment}
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="Share your thoughts about this book..."
                                    rows="4"
                                    maxLength="2000"
                                    className="w-full px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition"
                                >
                                    {userReview ? 'Update Review' : 'Post Review'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormData({ rating: 5, title: '', comment: '' });
                                    }}
                                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : userReview ? (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-white">Your Review</h3>
                                    <div className="flex items-center gap-1 my-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < userReview.rating ? 'text-yellow-400 fill-yellow-400' : 'text-indigo-600'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="text-indigo-300 hover:text-white"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(userReview._id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h4 className="font-bold text-indigo-100">{userReview.title}</h4>
                            <p className="text-indigo-200">{userReview.comment}</p>
                        </div>
                    ) : null}
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                    Community Reviews ({reviews.length})
                </h3>

                {reviews.length === 0 ? (
                    <p className="text-indigo-300">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-indigo-800/30 border border-indigo-700 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-white">{review.title}</h4>
                                    <p className="text-sm text-indigo-300">{review.user.name}</p>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-indigo-600'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-indigo-100 mb-3">{review.comment}</p>
                            <div className="flex items-center gap-4 text-sm">
                                <button
                                    onClick={() => handleMarkHelpful(review._id)}
                                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition"
                                >
                                    <ThumbsUp size={16} /> Helpful ({review.helpful})
                                </button>
                                <p className="text-indigo-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
