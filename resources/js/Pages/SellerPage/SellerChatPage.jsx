import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Search,
    Clock,
    MoreVertical,
    Paperclip,
    Send,
    Phone,
    Video,
    Info,
    ChevronLeft,
    Filter,
    MessageCircle,
    Store,
    User,
    RefreshCw,
    AlertCircle,
} from "lucide-react";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { LoadingProgress } from "@/Components/AdminPage/LoadingProgress";

import axios from "axios";

import Pusher from "pusher-js";

import { usePage } from "@inertiajs/react";

export default function SellerChatPage({ seller_storeInfo }) {
    const [activeConversation, setActiveConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [conversationsLoading, setConversationsLoading] = useState(true);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [messageLoading, setMessageLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [showChat, setShowChat] = useState(false);

    const [isMobile, setIsMobile] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const [imageLoading, setImageLoading] = useState({});

    const messagesEndRef = useRef(null);

    const pusher = useRef(null);

    const { auth } = usePage().props;

    const handleNewMessage = useCallback(
        (newMessageData) => {
            console.log("🔄 Handling new message:", newMessageData);

            const isFromCurrentSeller =
                newMessageData.sender_type === "seller" &&
                newMessageData.sender_id === auth.user.seller_id;

            // Auto-mark seller messages as read when received
            if (newMessageData.sender_type === "buyer" && activeConversation) {
                newMessageData.read = true;
            }

            if (isFromCurrentSeller && !newMessageData.isOptimistic) {
                return;
            }

            setMessages((prev) => {
                // Enhanced duplicate detection
                const messageExists = prev.some((msg) => {
                    // Check by ID
                    if (
                        msg.id &&
                        newMessageData.id &&
                        msg.id === newMessageData.id
                    ) {
                        return true;
                    }
                    // Check by tempId (for optimistic updates)
                    if (
                        msg.tempId &&
                        newMessageData.tempId &&
                        msg.tempId === newMessageData.tempId
                    ) {
                        return true;
                    }
                    // Check by content and sender (prevent Pusher duplicates)
                    if (
                        msg.message === newMessageData.message &&
                        msg.sender_id === newMessageData.sender_id &&
                        Math.abs(
                            new Date(msg.created_at) -
                                new Date(newMessageData.created_at)
                        ) < 5000
                    ) {
                        return true;
                    }
                    return false;
                });

                if (messageExists) {
                    return prev;
                }

                setTimeout(() => {
                    if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({
                            behavior: "smooth",
                            block: "end",
                        });
                    }
                }, 150);

                return [...prev, newMessageData];
            });

            // Update conversations list
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === newMessageData.conversation_id
                        ? {
                              ...conv,
                              last_message: newMessageData.message,
                              last_message_at: newMessageData.created_at,
                              timestamp: "Just now",
                              unread_count:
                                  newMessageData.sender_type === "buyer"
                                      ? activeConversation &&
                                        activeConversation.id ===
                                            newMessageData.conversation_id
                                          ? 0 // No unread count if this conversation is active
                                          : (conv.unread_count || 0) + 1
                                      : conv.unread_count || 0, // Keep existing count for buyer messages
                          }
                        : conv
                )
            );
        },
        [auth.user, activeConversation]
    ); // Make sure to wrap in useCallback

    // Filter conversations based on search
    const filteredConversations = conversations.filter(
        (conv) =>
            conv.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.product?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Check if mobile on component mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Fetch conversations on component mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Initialize component with proper data handling
    useEffect(() => {
        if (conversations && conversations.length > 0) {
            console.log("Setting conversations from props:", conversations);
            setConversations(conversations);

            // Set active conversation if provided
            if (activeConversation) {
                const foundConversation = conversations.find(
                    (conv) => conv.id == activeConversation
                );
                if (foundConversation) {
                    console.log(
                        "Setting active conversation:",
                        foundConversation
                    );
                    setActiveConversation(foundConversation);
                    // On mobile, hide sidebar when conversation is selected
                    if (isMobile) {
                        setShowMobileSidebar(false);
                    }
                }
            }
        }
    }, [activeConversation, isMobile]);

    // Auto-mark as read when new messages arrive and conversation is active
    useEffect(() => {
        if (!activeConversation || messages.length === 0) return;

        // Check if there are any unread messages from the seller
        const hasUnreadMessages = messages.some(
            (message) =>
                message.sender_type === "buyer" &&
                !message.read &&
                !message.isOptimistic
        );

        if (hasUnreadMessages) {
            console.log("📖 Auto-marking messages as read");
            markAsRead(activeConversation.id);

            // Also update local message state to show as read
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.sender_type === "buyer" &&
                    !msg.read &&
                    !msg.isOptimistic
                        ? { ...msg, read: true }
                        : msg
                )
            );
        }
    }, [messages, activeConversation]);

    // Fetch conversations from API
    const fetchConversations = async () => {
        try {
            setConversationsLoading(true);
            setError(null);

            const response = await axios.get("/conversations");
            console.log("API Response:", response);

            setConversations(response.data);
        } catch (error) {
            console.error("Error fetching conversations:", error);
            setError("Failed to load conversations. Please try again.");
        } finally {
            setConversationsLoading(false);
            setRefreshing(false);
        }
    };

    const markAsRead = async (conversationId) => {
        try {
            await axios.post(`/conversations/${conversationId}/mark-read`);

            // Update local state
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === conversationId
                        ? { ...conv, unread_count: 0 }
                        : conv
                )
            );

            // Update messages read status locally
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.conversation_id === conversationId &&
                    msg.sender_type === "buyer"
                        ? { ...msg, read: true }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    // Handle image loading
    const handleImageLoad = (imageId) => {
        setImageLoading((prev) => ({
            ...prev,
            [imageId]: false,
        }));
    };

    const handleImageError = (imageId) => {
        setImageLoading((prev) => ({
            ...prev,
            [imageId]: false,
        }));
    };

    // Format timestamp for conversation list display
    const formatConversationTimeForDisplay = (timestamp) => {
        if (!timestamp || timestamp === "No messages") return "No messages";

        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diffInMs = now - date;
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

            if (diffInMinutes < 1) return "Just now";
            if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
            if (diffInHours < 24) return `${diffInHours}h ago`;
            if (diffInDays < 7) return `${diffInDays}d ago`;

            return date.toLocaleDateString();
        } catch (error) {
            return "Recently";
        }
    };

    // Initialize Pusher for real-time messaging
    useEffect(() => {
        if (!auth.user) return;

        const isSeller = auth.user.user_id && auth.user.seller_id !== undefined;
        const roleSuffix = isSeller ? "seller" : "buyer";
        const userId = auth.user.seller_id;

        const initializePusher = async () => {
            try {
                pusher.current = new Pusher(
                    import.meta.env.VITE_PUSHER_APP_KEY,
                    {
                        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
                        forceTLS: true,
                        authEndpoint: "/broadcasting/auth",
                        // enabledTransports: ["ws", "wss"],
                    }
                );

                pusher.current.connection.bind("connected", () => {
                    console.log("Pusher connected successfully");
                });

                pusher.current.connection.bind("error", (err) => {
                    console.error("Pusher connection error:", err);
                });

                // Subscribe to user-wide channel for all conversations
                const sellerChannel = pusher.current.subscribe(
                    `private-user.${userId}.${roleSuffix}`
                );

                console.log("Subscribed to:", sellerChannel.name);
                console.log("Is subscribed:", sellerChannel.subscribed);

                sellerChannel.bind("MessageSent", (data) => {
                    console.log("🔔 New message notification received:", data);

                    // If this message is for the currently active conversation, add it to messages
                    if (
                        activeConversation?.id === data.message.conversation_id
                    ) {
                        // Auto-mark as read if it's a seller message
                        if (data.message.sender_type === "buyer") {
                            data.message.read = true;
                            markAsRead(activeConversation.id);
                        }
                    }
                    handleNewMessage(data.message);
                });

                return () => {
                    sellerChannel.unbind_all();
                    sellerChannel.unsubscribe();
                };
            } catch (error) {
                console.error("Pusher initialization error:", error);
            }
        };

        initializePusher();

        return () => {
            if (pusher.current) {
                pusher.current.disconnect();
            }
        };
    }, [auth.user, activeConversation]);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConversation) {
            loadMessages(activeConversation.id);
            markConversationAsRead(activeConversation.id);
        }
    }, [activeConversation, handleNewMessage]);

    const loadMessages = async (conversationId) => {
        setMessageLoading(true);
        setError(null);
        try {
            const response = await axios.get(`/messages/${conversationId}`);
            console.log("Messages API Response:", response.data);

            // Handle both response structures
            const messagesData =
                response.data.message ||
                response.data.messages ||
                response.data;
            setMessages(Array.isArray(messagesData) ? messagesData : []);
        } catch (error) {
            console.error("Error loading messages:", error);
            setError("Failed to load messages. Please try again.");
        } finally {
            setMessageLoading(false);
        }
    };

    const markConversationAsRead = async (conversationId) => {
        try {
            await axios.post(`/conversations/${conversationId}/mark-read`);
            // Update local state to reflect read status
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === conversationId
                        ? { ...conv, unread_count: 0 }
                        : conv
                )
            );

            // Update messages read status locally
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.conversation_id === conversationId &&
                    msg.sender_type === "buyer"
                        ? { ...msg, read: true }
                        : msg
                )
            );
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        const tempId = Date.now();
        const messageContent = newMessage.trim();

        try {
            // Create optimistic update
            const tempMessage = {
                id: tempId,
                conversation_id: activeConversation.id,
                sender_id: auth.user.user_id,
                sender_type: "seller",
                message: messageContent,
                created_at: new Date().toISOString(),
                read: false,
                isOptimistic: true,
                sender: {
                    id: auth.user.seller_id,
                    name: auth.user.name,
                },
            };

            setMessages((prev) => [...prev, tempMessage]);
            setNewMessage("");

            // Update conversations list locally
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === activeConversation.id
                        ? {
                              ...conv,
                              last_message: messageContent,
                              last_message_time: new Date().toISOString(),
                              timestamp: "Just now",
                              unread_count: 0,
                          }
                        : conv
                )
            );

            // Send to server
            const response = await axios.post("/send-message", {
                message: messageContent,
                conversation_id: activeConversation.id,
                sender_type: "seller",
                tempId: tempId.toString(),
            });

            console.log("Message sent successfully:", response.data);
        } catch (error) {
            console.error("Error sending message:", error);
            setError("Failed to send message. Please try again.");
        }
    };

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle back to conversations list on mobile
    const handleBackToConversations = () => {
        setShowChat(false);
        setTimeout(() => {
            setActiveConversation(null);
        }, 300);
    };

    // Handle conversation click
    const handleConversationClick = async (conversation) => {
        setActiveConversation(conversation);
        await markAsRead(conversation.id);
        if (isMobile) {
            setShowChat(true);
        }
    };

    // User Avatar Component with loading state
    const UserAvatar = ({ user, size = 8, className = "" }) => {
        const avatarId = `avatar-${user?.id || "default"}`;
        const isLoading = imageLoading[avatarId] !== false;

        return (
            <div className={`relative w-${size} h-${size} ${className}`}>
                {user?.avatar ? (
                    <>
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            </div>
                        )}
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className={`w-full h-full rounded-full object-cover ${
                                isLoading ? "opacity-0" : "opacity-100"
                            } transition-opacity`}
                            onLoad={() => handleImageLoad(avatarId)}
                            onError={() => handleImageError(avatarId)}
                        />
                    </>
                ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                            {user?.name?.charAt(0) || "U"}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    // MessageBubble component for seller
    const MessageBubble = ({ message }) => {
        const isBuyer = message.sender_type === "seller";
        const isOptimistic = message.isOptimistic;

        return (
            <div
                className={`flex gap-2 mb-4 ${
                    isBuyer ? "justify-end" : "justify-start"
                }`}
            >
                {!isBuyer && (
                    <UserAvatar
                        user={message.sender}
                        size={8}
                        className="flex-shrink-0"
                    />
                )}

                <div
                    className={`max-w-[70%] flex flex-col ${
                        isBuyer ? "items-end" : "items-start"
                    }`}
                >
                    {!isBuyer && (
                        <span className="text-xs text-gray-500 mb-1 ml-1">
                            {message.sender?.name}
                        </span>
                    )}
                    {message.unread_count > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {message.unread_count}
                        </span>
                    )}
                    <div
                        className={`px-4 py-3 rounded-2xl ${
                            isBuyer
                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                        } ${isOptimistic ? "opacity-80" : ""} shadow-sm`}
                    >
                        <p className="text-sm leading-relaxed">
                            {message.message}
                        </p>
                    </div>
                    <div
                        className={`flex items-center gap-2 mt-1 ${
                            isBuyer ? "flex-row-reverse" : ""
                        }`}
                    >
                        <span
                            className={`text-xs ${
                                isBuyer ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                            {formatConversationTimeForDisplay(
                                message.created_at
                            )}
                        </span>
                        {isBuyer && (
                            <span className="text-xs">
                                {isOptimistic ? (
                                    <Clock size={12} className="inline" />
                                ) : message.read ? (
                                    "✓✓"
                                ) : (
                                    "✓"
                                )}
                            </span>
                        )}
                        {/* Show read status for seller messages */}
                        {!isBuyer && message.read && (
                            <span className="text-xs text-gray-400">Read</span>
                        )}
                    </div>
                </div>

                {isBuyer && (
                    <UserAvatar
                        user={auth.user}
                        size={8}
                        className="flex-shrink-0"
                    />
                )}
            </div>
        );
    };

    // Error display component
    const ErrorDisplay = () => {
        if (!error) return null;

        return (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span className="text-sm">{error}</span>
                </div>
                <button
                    onClick={() => setError(null)}
                    className="text-red-600 hover:text-red-800"
                >
                    <span className="text-lg">×</span>
                </button>
            </div>
        );
    };

    // Render conversations sidebar
    const RenderConversationsSidebar = ({ conversations }) => (
        <div
            className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${
                isMobile && showChat ? "hidden" : "flex"
            }`}
        >
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                            <Store className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                Seller Messages
                            </h1>
                            <p className="text-sm text-gray-600">
                                Chat with your customers
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search customers or products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <LoadingProgress
                            modalType="loading"
                            modalMessage="Loading conversations..."
                        />
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <MessageCircle
                            size={48}
                            className="mx-auto mb-3 text-gray-300"
                        />
                        <p>No conversations found.</p>
                        <p className="text-sm mt-1">
                            {searchTerm
                                ? "Try adjusting your search terms"
                                : "When customers message you, they will appear here"}
                        </p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        return (
                            <div
                                key={conversation.id}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    activeConversation?.id === conversation.id
                                        ? "bg-blue-50 border-l-4 border-l-indigo-600"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleConversationClick(conversation)
                                }
                            >
                                <div className="flex items-start gap-3">
                                    <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center">
                                        <User
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {conversation.buyer_name ||
                                                    "Unknown Customer"}
                                            </h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                                {conversation.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 truncate mb-2">
                                            {conversation.last_message ||
                                                "No messages yet"}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full truncate max-w-[120px]">
                                                {conversation.product}
                                            </span>
                                            {conversation.unread_count > 0 && (
                                                <span className="bg-indigo-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                                                    {conversation.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );

    // Render chat interface
    const renderChatInterface = () => (
        <div
            className={`flex flex-col flex-1 ${
                isMobile && !showChat ? "hidden" : "flex"
            }`}
        >
            {!activeConversation ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                        <Store size={32} className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Seller Messages
                    </h3>
                    <p className="text-gray-500 max-w-md">
                        {conversationsLoading
                            ? "Loading your conversations..."
                            : "Select a conversation to chat with customers about your products."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleBackToConversations}
                                className="p-1 rounded text-black hover:bg-gray-100 md:hidden"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="bg-gray-200 rounded-full h-10 w-10 flex items-center justify-center">
                                <User size={20} className="text-gray-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    {activeConversation.buyer_name || "Customer"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Customer • {activeConversation.product}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
                                title="Conversation info"
                            >
                                <Info size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        <ErrorDisplay />

                        {messageLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <LoadingProgress
                                    modalType="loading"
                                    modalMessage="Loading messages..."
                                />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <MessageCircle
                                    size={48}
                                    className="mb-3 text-gray-300"
                                />
                                <p>No messages yet</p>
                                <p className="text-sm">
                                    Start the conversation with your customer
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <MessageBubble
                                        key={message.id || message.tempId}
                                        message={message}
                                    />
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-200 bg-white">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-center gap-2"
                        >
                            <button
                                type="button"
                                className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                                title="Attach file"
                            >
                                <Paperclip size={20} />
                            </button>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="text-black flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                disabled={messageLoading}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || messageLoading}
                                className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Send message"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar
                shopName={
                    seller_storeInfo?.[0]?.seller_store?.store_name ||
                    "My Store"
                }
            />

            <main className="flex-1 p-4 md:p-6">
                <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-2rem)] flex overflow-hidden">
                    <RenderConversationsSidebar
                        conversations={filteredConversations}
                    />
                    {renderChatInterface()}
                </div>
            </main>
        </div>
    );
}
