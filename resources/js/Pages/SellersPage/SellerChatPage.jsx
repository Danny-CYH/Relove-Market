import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    MoreVertical,
    Paperclip,
    Send,
    Phone,
    Video,
    Info,
    ChevronLeft,
    Filter,
    MessageCircle,
} from "lucide-react";

import { SellerSidebar } from "@/Components/Seller/SellerSidebar";
import { LoadingProgress } from "@/Components/Admin/LoadingProgress";

import axios from "axios";

export default function SellerChatPage({ seller_storeInfo, conversations }) {
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Sample data - in a real app this would come from your API
    const [conversationsList, setConversationsList] = useState([
        {
            id: 1,
            customer_name: "Sarah Johnson",
            last_message: "Thanks for the information!",
            unread_count: 2,
            timestamp: "10:30 AM",
            product: "Wireless Headphones",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 2,
            customer_name: "Michael Chen",
            last_message: "When will this be back in stock?",
            unread_count: 0,
            timestamp: "Yesterday",
            product: "Smart Watch Series 5",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 3,
            customer_name: "Emma Wilson",
            last_message: "I'd like to return my purchase",
            unread_count: 5,
            timestamp: "Wednesday",
            product: "Bluetooth Speaker",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 4,
            customer_name: "Emma Wilson",
            last_message: "I'd like to return my purchase",
            unread_count: 5,
            timestamp: "Wednesday",
            product: "Bluetooth Speaker",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 5,
            customer_name: "Emma Wilson",
            last_message: "I'd like to return my purchase",
            unread_count: 5,
            timestamp: "Wednesday",
            product: "Bluetooth Speaker",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 6,
            customer_name: "Emma Wilson",
            last_message: "I'd like to return my purchase",
            unread_count: 5,
            timestamp: "Wednesday",
            product: "Bluetooth Speaker",
            product_image: "/api/placeholder/40/40",
        },
        {
            id: 7,
            customer_name: "Emma Wilson",
            last_message: "I'd like to return my purchase",
            unread_count: 5,
            timestamp: "Wednesday",
            product: "Bluetooth Speaker",
            product_image: "/api/placeholder/40/40",
        },
    ]);

    // Filter conversations based on search
    const filteredConversations = conversationsList.filter(
        (conv) =>
            conv.customer_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            conv.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Load messages when a conversation is selected
    useEffect(() => {
        if (activeConversation) {
            setLoading(true);
            // In a real app, you would fetch messages from your API
            setTimeout(() => {
                setMessages([
                    {
                        id: 1,
                        sender: "customer",
                        text: "Hello, I have a question about this product",
                        timestamp: "10:25 AM",
                    },
                    {
                        id: 2,
                        sender: "seller",
                        text: "Hi there! How can I help you?",
                        timestamp: "10:26 AM",
                    },
                    {
                        id: 3,
                        sender: "customer",
                        text: "Is this item available in blue?",
                        timestamp: "10:28 AM",
                    },
                    {
                        id: 4,
                        sender: "seller",
                        text: "Yes, we have it in blue, black, and red.",
                        timestamp: "10:29 AM",
                    },
                    {
                        id: 5,
                        sender: "customer",
                        text: "Great! Thanks for the information!",
                        timestamp: "10:30 AM",
                    },
                    {
                        id: 6,
                        sender: "customer",
                        text: "Great! Thanks for the information!",
                        timestamp: "10:30 AM",
                    },
                    {
                        id: 7,
                        sender: "customer",
                        text: "Great! Thanks for the information!",
                        timestamp: "10:30 AM",
                    },
                    {
                        id: 8,
                        sender: "customer",
                        text: "Great! Thanks for the information!",
                        timestamp: "10:30 AM",
                    },
                    {
                        id: 9,
                        sender: "customer",
                        text: "Great! Thanks for the information!",
                        timestamp: "10:30 AM",
                    },
                ]);
                setLoading(false);
            }, 500);
        }
    }, [activeConversation]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: messages.length + 1,
            sender: "seller",
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");
    };

    const markAsRead = (conversationId) => {
        setConversationsList(
            conversationsList.map((conv) =>
                conv.id === conversationId ? { ...conv, unread_count: 0 } : conv
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SellerSidebar
                shopName={seller_storeInfo[0].seller_store.store_name}
            />

            {/* Main content */}
            <main className="flex-1 p-4 md:p-6">
                <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-2rem)] flex">
                    {/* Conversations sidebar */}
                    <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-gray-900">
                                Messages
                            </h1>
                            <div className="relative mt-4">
                                <Search
                                    className="absolute left-3 top-2.5 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {filteredConversations.length === 0 ? (
                                <div className="text-center py-6 text-gray-500">
                                    No conversations found.
                                </div>
                            ) : (
                                filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                            activeConversation?.id ===
                                            conversation.id
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setActiveConversation(conversation);
                                            markAsRead(conversation.id);
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                                                <MessageCircle
                                                    size={20}
                                                    className="text-gray-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-gray-900 truncate">
                                                        {
                                                            conversation.customer_name
                                                        }
                                                    </h3>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                                        {conversation.timestamp}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {conversation.last_message}
                                                </p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                                        {conversation.product}
                                                    </span>
                                                    {conversation.unread_count >
                                                        0 && (
                                                        <span className="bg-indigo-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                                                            {
                                                                conversation.unread_count
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat interface - hidden on mobile when no conversation selected */}
                    <div
                        className={`hidden md:flex flex-col flex-1 ${
                            !activeConversation ? "md:flex" : "flex"
                        }`}
                    >
                        {!activeConversation ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                    <MessageCircle
                                        size={32}
                                        className="text-indigo-600"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Your messages
                                </h3>
                                <p className="text-gray-500 max-w-md">
                                    Select a conversation to view messages and
                                    chat with customers about your products.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Chat header */}
                                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() =>
                                                setActiveConversation(null)
                                            }
                                            className="md:hidden p-1 rounded hover:bg-gray-100"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div>
                                            <h2 className="font-semibold text-gray-900">
                                                {
                                                    activeConversation.customer_name
                                                }
                                            </h2>
                                            <p className="text-sm text-gray-500">
                                                Active 10 min ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                                            <Phone size={18} />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                                            <Video size={18} />
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                                            <Info size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages area */}
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    {loading ? (
                                        <div className="flex justify-center items-center h-full">
                                            <LoadingProgress
                                                modalType="loading"
                                                modalMessage="Loading messages..."
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        message.sender ===
                                                        "seller"
                                                            ? "justify-end"
                                                            : "justify-start"
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                                            message.sender ===
                                                            "seller"
                                                                ? "bg-indigo-600 text-white"
                                                                : "bg-white border border-gray-200 text-gray-900"
                                                        }`}
                                                    >
                                                        <p>{message.text}</p>
                                                        <p
                                                            className={`text-xs mt-1 ${
                                                                message.sender ===
                                                                "seller"
                                                                    ? "text-indigo-200"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {message.timestamp}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    )}
                                </div>

                                {/* Message input */}
                                <div className="p-4 border-t border-gray-200">
                                    <form
                                        onSubmit={handleSendMessage}
                                        className="flex items-center gap-2"
                                    >
                                        <button
                                            type="button"
                                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                        >
                                            <Paperclip size={20} />
                                        </button>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) =>
                                                setNewMessage(e.target.value)
                                            }
                                            placeholder="Type a message..."
                                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
