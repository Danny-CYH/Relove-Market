import { useState, useRef, useEffect } from "react";
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
    Heart,
    ShoppingBag,
    Settings,
    LogOut,
    CheckCircle,
    Bell,
    CreditCard as CreditCardIcon,
    Package,
    Truck,
    CheckCircle2,
} from "lucide-react";

import dayjs from "dayjs";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";

import { OrdersTab } from "@/Components/BuyerPage/ProfilePage/OrdersTab";
import { SecurityTab } from "@/Components/BuyerPage/ProfilePage/SecurityTab";
import { NotificationsTab } from "@/Components/BuyerPage/ProfilePage/NotificationsTab";
import { WishlistTab } from "@/Components/BuyerPage/ProfilePage/WishlistTab";
import { PaymentsTab } from "@/Components/BuyerPage/ProfilePage/PaymentsTab";

import { usePage } from "@inertiajs/react";
import { ReceiptModal } from "@/Components/BuyerPage/ProfilePage/ReceiptModal";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        promotions: true,
    });
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef(null);

    const { auth } = usePage().props;

    // Enhanced user data
    const [userData, setUserData] = useState(auth.user);

    const [formData, setFormData] = useState({ ...userData });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // NEW: Separate state for image preview
    const [imagePreview, setImagePreview] = useState(null);

    // Order history state with pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const [orderHistory, setOrderHistory] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    // Fetch data on component mount
    useEffect(() => {
        fetchOrderHistory();
    }, []);

    // NEW: Set initial image preview when component mounts
    useEffect(() => {
        if (userData.profile_image) {
            setImagePreview(getProfileImageUrl(userData.profile_image));
        }
    }, [userData.profile_image]);

    // Helper function to get proper image URL
    const getProfileImageUrl = (imagePath) => {
        if (!imagePath) return "/image/user.png";

        // If it's already a full URL or data URL, return as is
        if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return imagePath;
        }

        // If it's a relative path, prepend base URL
        if (imagePath.startsWith("/")) {
            return import.meta.env.VITE_BASE_URL + imagePath;
        }

        // For storage paths
        return `${import.meta.env.VITE_BASE_URL}${auth.user.profile_image}`;
    };

    // Fetch order history from API
    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/orders-history", {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            console.log(response);

            setOrderHistory(response.data || []);
        } catch (error) {
            console.error("Error fetching order history:", error);
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Handle image upload with proper preview
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                // Set preview immediately
                setImagePreview(e.target.result);

                // Update form data with file for upload
                setFormData((prev) => ({
                    ...prev,
                    profileImageFile: file, // Store file for upload
                    profile_image: e.target.result, // Store preview URL
                }));
            };
            reader.onerror = () => {
                console.error("Error reading file");
                alert("Error reading image file");
            };
            reader.readAsDataURL(file);
        }
    };

    // FIXED: Handle save with proper image handling
    const handleSave = async () => {
        try {
            setLoading(true);

            // Create FormData for all fields
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name || "");
            formDataToSend.append("email", formData.email || "");
            formDataToSend.append("phone", formData.phone || "");
            formDataToSend.append("address", formData.address || "");
            formDataToSend.append("city", formData.city || "");
            formDataToSend.append("zip_code", formData.zip_code || "");

            // Append the actual file if it exists
            if (formData.profileImageFile) {
                formDataToSend.append(
                    "profile_image",
                    formData.profileImageFile
                );
                console.log(
                    "✅ File appended to FormData:",
                    formData.profileImageFile.name
                );
            } else {
                console.log("ℹ️ No new file selected, keeping existing image");
            }

            // Debug: Check FormData contents
            for (let [key, value] of formDataToSend.entries()) {
                console.log(
                    `📋 FormData: ${key} =`,
                    value instanceof File ? `File: ${value.name}` : value
                );
            }

            console.log("📤 Sending profile update request...");

            const response = await axios.post(
                "/api/profile-update",
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            console.log("✅ Response:", response.data);

            if (response.data.success) {
                const updatedUser = response.data.user;

                // FIXED: Properly update the image URL from response
                if (response.data.user.profile_image) {
                    // Use the path returned by the server
                    updatedUser.profile_image =
                        response.data.user.profile_image;

                    // Update preview with the new server path
                    setImagePreview(
                        getProfileImageUrl(updatedUser.profile_image)
                    );
                }

                // Update React states
                setUserData(updatedUser);
                setFormData(updatedUser);
                setIsEditing(false);

                // Clear the file object since it's been uploaded
                setFormData((prev) => ({
                    ...prev,
                    profileImageFile: null,
                }));

                console.log("🎉 Profile updated successfully!");

                // Show success message
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);
            if (error.response?.data) {
                console.error("Server response:", error.response.data);
                alert(
                    `Error: ${
                        error.response.data.message ||
                        "Failed to update profile"
                    }`
                );
            } else {
                alert("Error updating profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Handle cancel with proper image reset
    const handleCancel = () => {
        setFormData({ ...userData });
        setImagePreview(getProfileImageUrl(userData.profile_image)); // Reset to original image
        setIsEditing(false);

        // Clear any selected file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
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

    const handleNotificationToggle = (type) => {
        setNotifications((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "shipped":
                return "bg-blue-100 text-blue-800";
            case "processing":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "delivered":
                return <CheckCircle2 size={16} />;
            case "shipped":
                return <Truck size={16} />;
            case "processing":
                return <Package size={16} />;
            default:
                return <Package size={16} />;
        }
    };

    // View receipt function
    const viewReceipt = (order) => {
        setSelectedOrder(order);
        setShowReceiptModal(true);
    };

    // Print receipt function
    const printReceipt = (order) => {
        const receiptWindow = window.open("", "_blank");
        const receiptContent = generateReceiptContent(order);
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
        receiptWindow.print();
    };

    // Generate receipt HTML content
    const generateReceiptContent = (order) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Receipt - Order ${order.order_number}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .company-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                    .order-info { margin-bottom: 20px; }
                    .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    .items-table th { background-color: #f5f5f5; }
                    .total-section { text-align: right; margin-top: 20px; }
                    .thank-you { text-align: center; margin-top: 30px; font-style: italic; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">Relove Market</div>
                    <div>Order Receipt</div>
                </div>
                
                <div class="order-info">
                    <p><strong>Order Number:</strong> ${order.order_number}</p>
                    <p><strong>Order Date:</strong> ${new Date(
                        order.date
                    ).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.order_items
                            .map(
                                (item) => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>RM ${item.price}</td>
                                <td>RM ${(item.price * item.quantity)}</td>
                            </tr>
                        `
                            )
                            .join("")}
                    </tbody>
                </table>

                <div class="total-section">
                    <p><strong>Total Amount: RM ${order.total}</strong></p>
                </div>

                <div class="thank-you">
                    Thank you for your purchase!
                </div>
            </body>
            </html>
        `;
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = orderHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(orderHistory.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 mt-16">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Enhanced Sidebar Navigation */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                                <div className="relative mb-4 group">
                                    <div className="w-28 max-h-28 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                        <img
                                            src={
                                                imagePreview ||
                                                getProfileImageUrl(
                                                    userData.profile_image
                                                ) ||
                                                auth.user.profile_image
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error(
                                                    "Error loading image:",
                                                    e.target.src
                                                );
                                                e.target.src =
                                                    "/image/user.png";
                                            }}
                                        />
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={triggerFileInput}
                                            className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all transform group-hover:scale-110 border-2 border-white"
                                        >
                                            <Camera size={16} />
                                        </button>
                                    )}
                                    <input
                                        type="file"
                                        name="profile_image"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    {formData.name}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Member since{" "}
                                    {dayjs(auth.user.created_at).format(
                                        "MMMM YYYY"
                                    )}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <CheckCircle
                                        size={14}
                                        className="text-green-500 mr-1"
                                    />
                                    Verified Account
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {[
                                    {
                                        id: "profile",
                                        icon: User,
                                        label: "Profile Information",
                                        badge: null,
                                    },
                                    {
                                        id: "orders",
                                        icon: ShoppingBag,
                                        label: "Order History",
                                        badge: orderHistory.length,
                                    },
                                    {
                                        id: "security",
                                        icon: Shield,
                                        label: "Security",
                                        badge: null,
                                    },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left transition-all group ${
                                            activeTab === item.id
                                                ? "bg-blue-50 text-blue-600 font-semibold shadow-sm border border-blue-100"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                                        }`}
                                    >
                                        <item.icon
                                            size={20}
                                            className="mr-3 flex-shrink-0"
                                        />
                                        <span className="flex-1">
                                            {item.label}
                                        </span>
                                        {item.badge !== null && (
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    activeTab === item.id
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                                }`}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                <button className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all mt-4 group">
                                    <LogOut
                                        size={20}
                                        className="mr-3 flex-shrink-0"
                                    />
                                    <span className="flex-1">Logout</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="border-b border-gray-100 px-6 py-5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                Profile Information
                                            </h2>
                                            <p className="text-gray-600 mt-1">
                                                Manage your personal information
                                                and preferences
                                            </p>
                                        </div>
                                        {!isEditing ? (
                                            <button
                                                onClick={() =>
                                                    setIsEditing(true)
                                                }
                                                className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
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
                                                    disabled={loading}
                                                    className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    ) : (
                                                        <Save
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                    )}
                                                    {loading
                                                        ? "Saving..."
                                                        : "Save Changes"}
                                                </button>

                                                {/* Cancel Button */}
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex items-center bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium"
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
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Personal Information */}
                                        <div className="lg:col-span-2">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <User
                                                    size={20}
                                                    className="mr-2 text-blue-600"
                                                />
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
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <User
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.name}
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
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your email"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Mail
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.email}
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
                                                    value={formData.phone || ""}
                                                    onChange={handleInputChange}
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your phone number"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Phone
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.phone ||
                                                            "No update"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Member Since
                                            </label>
                                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                <Calendar
                                                    size={20}
                                                    className="text-gray-400 mr-3"
                                                />
                                                <span className="text-gray-900 font-medium">
                                                    {dayjs(
                                                        auth.user.created_at
                                                    ).format("MMMM YYYY")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            {isEditing ? (
                                                <textarea
                                                    name="address"
                                                    value={
                                                        formData.address || ""
                                                    }
                                                    onChange={handleInputChange}
                                                    rows={3}
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your address"
                                                />
                                            ) : (
                                                <div className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <MapPin
                                                        size={20}
                                                        className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.address ||
                                                            "No update"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city || ""}
                                                    onChange={handleInputChange}
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your city"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Mail
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.city ||
                                                            "No update"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Zip Code
                                            </label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    name="zip_code"
                                                    value={
                                                        formData.zip_code || ""
                                                    }
                                                    onChange={handleInputChange}
                                                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                    placeholder="Enter your zip code"
                                                    autoComplete="off"
                                                />
                                            ) : (
                                                <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                    <Mail
                                                        size={20}
                                                        className="text-gray-400 mr-3"
                                                    />
                                                    <span className="text-gray-900 font-medium">
                                                        {formData.zip_code ||
                                                            "No update"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Preferences Section */}
                                        <div className="lg:col-span-2 mt-6 pt-6 border-t border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                <Settings
                                                    size={20}
                                                    className="mr-2 text-purple-600"
                                                />
                                                Preferences
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            Newsletter
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Receive product
                                                            updates
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                            defaultChecked
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>

                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            SMS Notifications
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Order updates via
                                                            SMS
                                                        </p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <OrdersTab
                                orderHistory={orderHistory}
                                getStatusColor={getStatusColor}
                                getStatusIcon={getStatusIcon}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                totalPages={totalPages}
                                paginate={paginate}
                                viewReceipt={viewReceipt}
                                printReceipt={printReceipt}
                                loading={loading}
                            />
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <SecurityTab
                                showChangePassword={showChangePassword}
                                setShowChangePassword={setShowChangePassword}
                                passwordData={passwordData}
                                handlePasswordChange={handlePasswordChange}
                                handleSavePassword={handleSavePassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                            />
                        )}

                        {showReceiptModal && (
                            <ReceiptModal
                                order={selectedOrder}
                                isOpen={showReceiptModal}
                                onClose={() => setShowReceiptModal(false)}
                                onPrint={printReceipt}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
