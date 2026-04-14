import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpPage() {
    const [expandedFaq, setExpandedFaq] = useState(0);

    const faqs = [
        {
            question: 'What is LitFerns?',
            answer: 'LitFerns is a peer-to-peer platform where book enthusiasts can swap books with each other. Instead of buying new books, you can post the books you own and exchange them with other readers in your community.',
        },
        {
            question: 'How do I list a book?',
            answer: 'Go to your profile, click "Add Book", fill in the book details (title, author, condition, genre, etc.), upload a cover image, and click "Create Book". Your book will then be available for other members to swap.',
        },
        {
            question: 'How do I request a swap?',
            answer: 'Browse books in the catalog, click on a book you like, review the owner\'s profile and ratings, and click "Request Swap". You can include a message and optionally offer your own books in exchange.',
        },
        {
            question: 'What does swap status mean?',
            answer: 'Pendant: Your request is waiting for the owner to respond. Accepted: The owner agreed to swap. Shipped: Books are on the way. In Transit: Books are with the courier. Completed: Swap finished. Both parties can rate each other.',
        },
        {
            question: 'How is the rating system work?',
            answer: 'After a swap is completed, both parties can rate each other 1-5 stars and leave a review. Your average rating appears on your profile and helps build your reputation as a reliable swap partner.',
        },
        {
            question: 'Can I cancel a swap?',
            answer: 'Yes, you can cancel pending or accepted swaps. Once books are marked as shipped, cancellation requires communication with the other party. Completed or declined swaps cannot be cancelled.',
        },
        {
            question: 'How do I add books to my wishlist?',
            answer: 'Click on any book and then the "Add to Wishlist" button. Your wishlist is visible on your profile, and you can manage it anytime. This helps you remember books you want to find.',
        },
        {
            question: 'How do I write a review?',
            answer: 'After finishing a book swap, you can leave a detailed review with your rating, title, and thoughts on the book. Reviews help other readers decide if a book is worth swapping for.',
        },
        {
            question: 'Can I follow other users?',
            answer: 'Yes! You can follow your favorite readers to see all their books, get updates on new additions, and build connections in the LitFerns community.',
        },
        {
            question: 'How do I contact support?',
            answer: 'For technical issues or account problems, please email us at support@litferns.com. For general questions, check our community forums or search the help center.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Help & FAQ</h1>
                <p className="text-indigo-200 mb-8 text-lg">
                    Find answers to common questions about LitFerns and how to use our platform.
                </p>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[
                        { title: 'Getting Started', icon: '🚀' },
                        { title: 'Swapping Books', icon: '📚' },
                        { title: 'Account & Safety', icon: '🔒' },
                    ].map((link) => (
                        <div
                            key={link.title}
                            className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-lg p-6 text-center hover:border-indigo-500 transition"
                        >
                            <div className="text-4xl mb-3">{link.icon}</div>
                            <h3 className="text-lg font-bold text-white">{link.title}</h3>
                        </div>
                    ))}
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-indigo-800/50 backdrop-blur border border-indigo-700 rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-indigo-700/30 transition"
                            >
                                <h3 className="text-lg font-bold text-white text-left">{faq.question}</h3>
                                {expandedFaq === idx ? (
                                    <ChevronUp size={24} className="text-indigo-300" />
                                ) : (
                                    <ChevronDown size={24} className="text-indigo-400" />
                                )}
                            </button>

                            {expandedFaq === idx && (
                                <div className="px-6 py-4 border-t border-indigo-700 bg-indigo-900/30">
                                    <p className="text-indigo-100 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
                    <p className="text-indigo-100 mb-6">
                        Can't find what you're looking for? Contact our support team.
                    </p>
                    <a
                        href="mailto:support@litferns.com"
                        className="inline-block bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg hover:bg-indigo-50 transition"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
}
