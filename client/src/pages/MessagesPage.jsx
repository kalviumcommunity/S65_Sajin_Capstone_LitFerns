import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get('/api/messages/inbox');
            setConversations(data);
        } catch (err) {
            setError('Failed to load conversations');
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/conversation/${userId}`);
            setMessages(data.messages);
            setSelectedConversation(data.otherUser);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        setLoading(true);
        try {
            const { data } = await axios.post('/api/messages', {
                recipientId: selectedConversation._id,
                content: newMessage,
            });
            setMessages([...messages, data]);
            setNewMessage('');
            fetchConversations(); // Refresh conversation list
        } catch (err) {
            setError('Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900">
            <div className="h-screen flex flex-col md:flex-row">
                {/* Conversations Sidebar */}
                <div className="md:w-1/4 bg-indigo-900 border-r border-indigo-700 overflow-y-auto">
                    <div className="p-4 border-b border-indigo-700">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MessageSquare size={24} /> Messages
                        </h2>
                    </div>

                    {conversations.length === 0 ? (
                        <div className="p-4 text-indigo-300 text-center">
                            No conversations yet
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.user._id}
                                onClick={() => fetchMessages(conv.user._id)}
                                className={`p-4 cursor-pointer border-b border-indigo-800 transition hover:bg-indigo-800/50 ${
                                    selectedConversation?._id === conv.user._id ? 'bg-indigo-800' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{conv.user.name}</h3>
                                        <p className="text-sm text-indigo-300 truncate">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-indigo-400 mt-2">
                                    {new Date(conv.lastMessageAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>

                {/* Messages Chat Area */}
                <div className="flex-1 md:w-3/4 flex flex-col bg-indigo-850">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="bg-indigo-800 border-b border-indigo-700 p-4 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        {selectedConversation.name}
                                    </h3>
                                    <p className="text-sm text-indigo-300">
                                        {selectedConversation.email}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedConversation(null);
                                        setMessages([]);
                                    }}
                                    className="md:hidden text-indigo-300 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${
                                            msg.sender._id === user._id ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                msg.sender._id === user._id
                                                    ? 'bg-indigo-500 text-white'
                                                    : 'bg-indigo-700 text-indigo-100'
                                            }`}
                                        >
                                            <p>{msg.content}</p>
                                            <p className="text-xs text-indigo-200 mt-1">
                                                {new Date(msg.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <form
                                onSubmit={handleSendMessage}
                                className="bg-indigo-800 border-t border-indigo-700 p-4"
                            >
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || loading}
                                        className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <MessageSquare size={64} className="text-indigo-600 mx-auto mb-4" />
                                <p className="text-indigo-300 text-xl">
                                    Select a conversation to start messaging
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
