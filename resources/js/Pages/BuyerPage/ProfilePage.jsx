import { useState, useRef } from "react";
import {
    Camera,
    Edit3,
    Save,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    CreditCard,
    Heart,
    ShoppingBag,
    Settings,
    LogOut,
    Upload,
    CheckCircle,
    Eye,
    EyeOff,
    ChevronRight,
    ArrowLeft,
    Bell,
    Lock,
    Globe,
    CreditCardIcon,
} from "lucide-react";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const fileInputRef = useRef(null);

    // Sample user data
    const [userData, setUserData] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main Street, Kuala Lumpur, 50480",
        joinDate: "January 15, 2023",
        profileImage: null,
    });

    const [formData, setFormData] = useState({ ...userData });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData({ ...formData, profileImage: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setUserData({ ...formData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({ ...userData });
        setIsEditing(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSavePassword = () => {
        // Add password change logic here
        console.log("Password change requested", passwordData);
        setShowChangePassword(false);
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Sample order history
    const orderHistory = [
        {
            id: 1,
            date: "2023-10-15",
            items: 3,
            total: "RM 245.99",
            status: "Delivered",
            image: "https://via.placeholder.com/60",
        },
        {
            id: 2,
            date: "2023-09-22",
            items: 1,
            total: "RM 89.99",
            status: "Delivered",
            image: "https://via.placeholder.com/60",
        },
        {
            id: 3,
            date: "2023-09-10",
            items: 2,
            total: "RM 152.50",
            status: "Processing",
            image: "https://via.placeholder.com/60",
        },
    ];

    // Sample wishlist items
    const wishlistItems = [
        {
            id: 1,
            name: "Wireless Headphones with Noise Cancellation",
            price: "RM 129.99",
            image: "https://via.placeholder.com/80",
        },
        {
            id: 2,
            name: "Smart Watch Series 5",
            price: "RM 199.99",
            image: "https://via.placeholder.com/80",
        },
        {
            id: 3,
            name: "Premium Leather Phone Case",
            price: "RM 24.99",
            image: "https://via.placeholder.com/80",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 mt-16">
                {/* Breadcrumb */}
                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <a
                        href="/"
                        className="hover:text-blue-600 transition-colors"
                    >
                        Home
                    </a>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-900 font-medium">
                        My Account
                    </span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative mb-4 group">
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
                                        {formData.profileImage ? (
                                            <img
                                                src={formData.profileImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User
                                                size={48}
                                                className="text-gray-400"
                                            />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={triggerFileInput}
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-md hover:bg-blue-700 transition-all transform group-hover:scale-105"
                                        >
                                            <Camera size={18} />
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    {userData.name}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Member since {userData.joinDate}
                                </p>
                            </div>

                            <nav className="space-y-1">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all ${
                                        activeTab === "profile"
                                            ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <User size={20} className="mr-3" />
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all ${
                                        activeTab === "orders"
                                            ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <ShoppingBag size={20} className="mr-3" />
                                    Order History
                                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {orderHistory.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("wishlist")}
                                    className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all ${
                                        activeTab === "wishlist"
                                            ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Heart size={20} className="mr-3" />
                                    My Wishlist
                                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                        {wishlistItems.length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab("security")}
                                    className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all ${
                                        activeTab === "security"
                                            ? "bg-blue-50 text-blue-600 font-semibold shadow-sm"
                                            : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Shield size={20} className="mr-3" />
                                    Security
                                </button>
                                <button className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-gray-700 hover:bg-gray-50 transition-all">
                                    <Bell size={20} className="mr-3" />
                                    Notifications
                                </button>
                                <button className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-gray-700 hover:bg-gray-50 transition-all">
                                    <CreditCardIcon
                                        size={20}
                                        className="mr-3"
                                    />
                                    Payment Methods
                                </button>
                                <button className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all mt-4">
                                    <LogOut size={20} className="mr-3" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Mobile Tab Navigation */}
                        <div className="lg:hidden mb-6">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="profile">
                                    Profile Information
                                </option>
                                <option value="orders">Order History</option>
                                <option value="wishlist">My Wishlist</option>
                                <option value="security">Security</option>
                            </select>
                        </div>

                        {activeTab === "profile" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-5">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Profile Information
                                        </h2>
                                        {!isEditing ? (
                                            <button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-blue-50"
                                            >
                                                <Edit3
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={handleSave}
                                                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    <Save
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <X
                                                        size={18}
                                                        className="mr-2"
                                                    />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                                Personal Information
                                            </h3>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                    <User
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900">
                                                        {userData.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your email"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                    <Mail
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900">
                                                        {userData.email}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your phone number"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                    <Phone
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900">
                                                        {userData.phone}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Member Since
                                            </label>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl">
                                                <Calendar
                                                    size={20}
                                                    className="text-gray-400 mr-3"
                                                />
                                                <span className="text-gray-900">
                                                    {userData.joinDate}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your address"
                                                />
                                            ) : (
                                                <div className="flex items-start p-3 bg-gray-50 rounded-xl">
                                                    <MapPin
                                                        size={20}
                                                        className="text-gray-400 mr-3 mt-0.5"
                                                    />
                                                    <span className="text-gray-900">
                                                        {userData.address}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "orders" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-5">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Order History
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Your recent purchases
                                    </p>
                                </div>

                                <div className="p-6">
                                    {orderHistory.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingBag
                                                size={64}
                                                className="mx-auto text-gray-300 mb-4"
                                            />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No orders yet
                                            </h3>
                                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                Your order history will appear
                                                here once you make your first
                                                purchase
                                            </p>
                                            <a
                                                href="/products"
                                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Start Shopping
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orderHistory.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                        <img
                                                            src={order.image}
                                                            alt={`Order ${order.id}`}
                                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                                                                <div>
                                                                    <h3 className="font-semibold text-gray-900">
                                                                        Order #{" "}
                                                                        {order.id
                                                                            .toString()
                                                                            .padStart(
                                                                                4,
                                                                                "0"
                                                                            )}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        Placed
                                                                        on{" "}
                                                                        {
                                                                            order.date
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 self-start ${
                                                                        order.status ===
                                                                        "Delivered"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                                >
                                                                    {
                                                                        order.status
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        order.items
                                                                    }{" "}
                                                                    {order.items ===
                                                                    1
                                                                        ? "item"
                                                                        : "items"}
                                                                </p>
                                                                <p className="font-semibold text-gray-900">
                                                                    {
                                                                        order.total
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                                                                    View Order
                                                                    Details
                                                                    <ChevronRight
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "wishlist" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-5">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        My Wishlist
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        {wishlistItems.length} items saved for
                                        later
                                    </p>
                                </div>

                                <div className="p-6">
                                    {wishlistItems.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Heart
                                                size={64}
                                                className="mx-auto text-gray-300 mb-4"
                                            />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                Your wishlist is empty
                                            </h3>
                                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                                Save items you love for later by
                                                clicking the heart icon
                                            </p>
                                            <a
                                                href="/products"
                                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                            >
                                                Browse Products
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {wishlistItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                                                >
                                                    <div className="flex">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                                                                {item.name}
                                                            </h3>
                                                            <p className="text-blue-600 font-semibold">
                                                                {item.price}
                                                            </p>
                                                            <div className="mt-4 flex space-x-2">
                                                                <button className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors font-medium">
                                                                    Add to Cart
                                                                </button>
                                                                <button className="p-2.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                                                    <X
                                                                        size={
                                                                            18
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-5">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Security Settings
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        Manage your account security
                                    </p>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-start">
                                            <div className="bg-blue-100 p-3 rounded-lg mr-4">
                                                <Lock
                                                    size={24}
                                                    className="text-blue-600"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    Password
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Last changed: 3 months ago
                                                </p>
                                                <button
                                                    onClick={() =>
                                                        setShowChangePassword(
                                                            true
                                                        )
                                                    }
                                                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    Change Password
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-start">
                                            <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                                <Shield
                                                    size={24}
                                                    className="text-purple-600"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    Two-Factor Authentication
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Add an extra layer of
                                                    security to your account
                                                </p>
                                                <button className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                                    Enable 2FA
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-xl p-6">
                                        <div className="flex items-start">
                                            <div className="bg-green-100 p-3 rounded-lg mr-4">
                                                <Globe
                                                    size={24}
                                                    className="text-green-600"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    Login Activity
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    Last login: Today at 2:30 PM
                                                    from Kuala Lumpur, Malaysia
                                                </p>
                                                <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
                                                    View all login activity
                                                    <ChevronRight
                                                        size={16}
                                                        className="ml-1"
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Change Password Modal */}
                                {showChangePassword && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
                                            <div className="flex justify-between items-center mb-5">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Change Password
                                                </h3>
                                                <button
                                                    onClick={() =>
                                                        setShowChangePassword(
                                                            false
                                                        )
                                                    }
                                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Current Password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                showPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            name="currentPassword"
                                                            value={
                                                                passwordData.currentPassword
                                                            }
                                                            onChange={
                                                                handlePasswordChange
                                                            }
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                                                            placeholder="Enter current password"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setShowPassword(
                                                                    !showPassword
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff
                                                                    size={20}
                                                                />
                                                            ) : (
                                                                <Eye
                                                                    size={20}
                                                                />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={
                                                            passwordData.newPassword
                                                        }
                                                        onChange={
                                                            handlePasswordChange
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter new password"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Confirm New Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="confirmPassword"
                                                        value={
                                                            passwordData.confirmPassword
                                                        }
                                                        onChange={
                                                            handlePasswordChange
                                                        }
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Confirm new password"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-6 flex space-x-3">
                                                <button
                                                    onClick={handleSavePassword}
                                                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                                                >
                                                    Update Password
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        setShowChangePassword(
                                                            false
                                                        )
                                                    }
                                                    className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
