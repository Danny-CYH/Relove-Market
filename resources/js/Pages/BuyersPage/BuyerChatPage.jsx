import { useState } from "react";
import { FaPaperPlane, FaPaperclip, FaHome } from "react-icons/fa";
import { usePage, Link } from "@inertiajs/react";

export default function ChatPage() {
    const { url } = usePage();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "seller",
            text: "Hello! How can I help you today?",
            time: "10:00 AM",
        },
        {
            id: 2,
            sender: "buyer",
            text: "Hi! I’m interested in the item you listed.",
            time: "10:02 AM",
        },
        {
            id: 3,
            sender: "seller",
            text: "Great! Do you want more details or pictures?",
            time: "10:03 AM",
        },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([
            ...messages,
            { id: Date.now(), sender: "buyer", text: input, time: "Now" },
        ]);
        setInput("");
    };

    const sellers = [
        {
            name: "Seller 1",
            online: true,
            lastMessage: "Sure! Here are the pictures...",
            time: "10:05 AM",
        },
        {
            name: "Seller 2",
            online: false,
            lastMessage: "I will check and update you.",
            time: "Yesterday",
        },
        {
            name: "Seller 3",
            online: true,
            lastMessage: "Item is available.",
            time: "08:30 AM",
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar for chat threads */}
            <aside className="w-80 bg-white shadow hidden md:flex flex-col justify-between">
                <div>
                    <div className="p-6 font-bold text-lg text-indigo-700 border-b flex items-center justify-between">
                        <span>Chats</span>
                        <Link
                            href={route("homepage")}
                            className="text-gray-500 hover:text-indigo-600"
                        >
                            <FaHome size={20} />
                        </Link>
                    </div>

                    <div className="px-4 py-2">
                        <input
                            type="text"
                            placeholder="Search sellers..."
                            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                        />
                        <ul className="space-y-2">
                            {sellers.map((seller, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between p-2 rounded hover:bg-indigo-50 cursor-pointer"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center text-white font-bold">
                                                {seller.name.split(" ")[1]}
                                            </div>
                                            {seller.online && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 font-semibold">
                                                {seller.name}
                                            </span>
                                            <span className="text-gray-400 text-sm truncate max-w-xs">
                                                {seller.lastMessage}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-xs">
                                        {seller.time}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Buyer account at the bottom */}
                <div className="border-t p-4 flex items-center space-x-3 hover:bg-gray-100 cursor-pointer">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">
                            [Buyer Name]
                        </span>
                        <span className="text-gray-400 text-sm">
                            View Profile
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main chat area */}
            <main className="flex-1 flex flex-col p-6 space-y-4">
                {/* Chat header with seller info */}
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                Seller 1
                            </h2>
                            <p className="text-sm text-gray-500">Online</p>
                        </div>
                    </div>
                    <div className="text-gray-500">Chat Room</div>
                </div>

                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto bg-white p-6 rounded-lg shadow space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.sender === "buyer"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div
                                className={`flex flex-col ${
                                    msg.sender === "buyer"
                                        ? "items-end"
                                        : "items-start"
                                }`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                                        msg.sender === "buyer"
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                <span className="text-xs text-gray-400 mt-1">
                                    {msg.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input area */}
                <div className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow">
                    <button className="p-2 rounded hover:bg-gray-100 transition">
                        <FaPaperclip className="text-gray-500" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition flex items-center space-x-2"
                    >
                        <FaPaperPlane /> <span>Send</span>
                    </button>
                </div>
            </main>
        </div>
    );
}