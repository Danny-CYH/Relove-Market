import React, { useState, useEffect, useRef } from "react";
import {
    FiMessageSquare,
    FiSearch,
    FiPaperclip,
    FiSend,
    FiImage,
    FiMic,
    FiMoreVertical,
    FiArrowLeft,
    FiCheckCircle,
    FiCheck,
    FiUser,
    FiShoppingBag,
} from "react-icons/fi";

const BuyerChatPage = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi, is this item still available?",
            sender: "buyer",
            timestamp: new Date(Date.now() - 3600000),
            read: true,
        },
        {
            id: 2,
            text: "Yes, it's available! Are you interested?",
            sender: "seller",
            timestamp: new Date(Date.now() - 3500000),
            read: true,
        },
        {
            id: 3,
            text: "Could you send me more pictures of the item?",
            sender: "buyer",
            timestamp: new Date(Date.now() - 3400000),
            read: true,
        },
        {
            id: 4,
            text: "Sure, here are some additional photos:",
            sender: "seller",
            timestamp: new Date(Date.now() - 3300000),
            read: true,
            hasMedia: true,
        },
        {
            id: 5,
            text: "Thanks! What's your best price?",
            sender: "buyer",
            timestamp: new Date(Date.now() - 3200000),
            read: true,
        },
        {
            id: 6,
            text: "I can do 10% off if you can pick it up today.",
            sender: "seller",
            timestamp: new Date(Date.now() - 3100000),
            read: true,
        },
    ]);

    const [newMessage, setNewMessage] = useState("");
    const [conversations, setConversations] = useState([
        {
            id: 1,
            name: "Sarah Johnson",
            lastMessage: "I can do 10% off if you can pick it up today.",
            timestamp: new Date(Date.now() - 3100000),
            unread: 0,
            item: {
                name: "Vintage Leather Jacket",
                price: "$45",
                image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            },
        },
        {
            id: 2,
            name: "Michael Chen",
            lastMessage: "When are you available to meet?",
            timestamp: new Date(Date.now() - 86400000),
            unread: 2,
            item: {
                name: "Canon DSLR Camera",
                price: "$220",
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            },
        },
        {
            id: 3,
            name: "Emma Wilson",
            lastMessage: "I can offer $35 for the shoes",
            timestamp: new Date(Date.now() - 172800000),
            unread: 0,
            item: {
                name: "Running Shoes - Size 9",
                price: "$40",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
            },
        },
    ]);

    const [activeConversation, setActiveConversation] = useState(
        conversations[0]
    );
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showConversationList, setShowConversationList] = useState(true);
    const messagesEndRef = useRef(null);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobileView(mobile);
            if (!mobile) {
                setShowConversationList(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Scroll to bottom of messages
    useEffect(() => {
        scrollToBottom();
    }, [messages, activeConversation]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            id: messages.length + 1,
            text: newMessage,
            sender: "buyer",
            timestamp: new Date(),
            read: false,
        };

        setMessages([...messages, newMsg]);
        setNewMessage("");

        // Simulate seller reply after a delay
        setTimeout(() => {
            const reply = {
                id: messages.length + 2,
                text: "Thanks for your message! I'll get back to you shortly.",
                sender: "seller",
                timestamp: new Date(),
                read: true,
            };
            setMessages((prev) => [...prev, reply]);
        }, 2000);
    };

    const handleSelectConversation = (conversation) => {
        setActiveConversation(conversation);
        if (isMobileView) {
            setShowConversationList(false);
        }
    };

    const handleBackToConversations = () => {
        setShowConversationList(true);
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Conversation List */}
            <div
                className={`${
                    showConversationList ? "flex" : "hidden"
                } md:flex flex-col w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200`}
            >
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">
                        Messages
                    </h1>
                    <div className="relative mt-4">
                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                activeConversation.id === conversation.id
                                    ? "bg-blue-50"
                                    : ""
                            }`}
                            onClick={() =>
                                handleSelectConversation(conversation)
                            }
                        >
                            <div className="relative">
                                <img
                                    src={conversation.item.image}
                                    alt={conversation.item.name}
                                    className="w-14 h-14 rounded-lg object-cover"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FiUser className="text-white text-xs" />
                                </div>
                            </div>

                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800 truncate">
                                        {conversation.name}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {formatTime(conversation.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate">
                                    {conversation.lastMessage}
                                </p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-sm font-medium text-gray-800">
                                        {conversation.item.name} •{" "}
                                        {conversation.item.price}
                                    </span>
                                    {conversation.unread > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {conversation.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div
                className={`${
                    !showConversationList ? "flex" : "hidden"
                } md:flex flex-col w-full md:w-2/3 lg:w-3/4`}
            >
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                    {isMobileView && (
                        <button
                            onClick={handleBackToConversations}
                            className="mr-2"
                        >
                            <FiArrowLeft className="text-gray-600" />
                        </button>
                    )}

                    <div className="flex items-center">
                        <img
                            src={activeConversation.item.image}
                            alt={activeConversation.item.name}
                            className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-800">
                                {activeConversation.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {activeConversation.item.name} •{" "}
                                {activeConversation.item.price}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <FiMoreVertical />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <div className="max-w-3xl mx-auto">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex mb-4 ${
                                    message.sender === "buyer"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg p-3 ${
                                        message.sender === "buyer"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    <p>{message.text}</p>
                                    <div
                                        className={`flex items-center mt-1 text-xs ${
                                            message.sender === "buyer"
                                                ? "text-blue-200"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        <span>
                                            {formatTime(message.timestamp)}
                                        </span>
                                        {message.sender === "buyer" && (
                                            <span className="ml-1">
                                                {message.read ? (
                                                    <FiCheckCircle className="inline" />
                                                ) : (
                                                    <FiCheck className="inline" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-center">
                        <button className="p-2 text-gray-500 hover:text-gray-700 mr-1">
                            <FiPaperclip />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 mr-1">
                            <FiImage />
                        </button>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSendMessage()
                            }
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {newMessage ? (
                            <button
                                onClick={handleSendMessage}
                                className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                <FiSend />
                            </button>
                        ) : (
                            <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
                                <FiMic />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerChatPage;
