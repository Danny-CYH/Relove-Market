import { useState, useRef, useEffect } from "react";
import {
    Camera,
    User,
    Shield,
    ShoppingBag,
    LogOut,
    CheckCircle,
    Package,
    Truck,
    CheckCircle2,
} from "lucide-react";

import { usePage, Link } from "@inertiajs/react";
import axios from "axios";
import dayjs from "dayjs";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";

import { OrdersTab } from "@/Components/BuyerPage/ProfilePage/OrdersTab";
import { SecurityTab } from "@/Components/BuyerPage/ProfilePage/SecurityTab";
import { ProfileTab } from "@/Components/BuyerPage/ProfilePage/ProfileTab";
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
    const [confirmingOrderId, setConfirmingOrderId] = useState(null);

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
            const response = await axios.get(route("order-history"), {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            setOrderHistory(response.data || []);
        } catch (error) {
            console.error("Error fetching order history:", error);
        } finally {
            setLoading(false);
        }
    };

    // NEW: Order Confirmation Function
    const confirmOrderDelivery = async (orderId) => {
        if (
            !confirm(
                "Are you sure you have received your order in good condition? This will release payment to the seller."
            )
        ) {
            return;
        }

        try {
            setConfirmingOrderId(orderId);

            const response = await axios.post(
                route("confirm-delivery", orderId)
            );

            if (response.data.success) {
                // Update the order in local state
                setOrderHistory((prevOrders) =>
                    prevOrders.map((order) =>
                        order.order_id === orderId
                            ? {
                                  ...order,
                                  order_status: "Completed",
                                  commission_amount:
                                      response.data.order?.commission_amount,
                                  seller_amount:
                                      response.data.order?.seller_amount,
                                  completed_at:
                                      response.data.order?.completed_at,
                              }
                            : order
                    )
                );

                alert(
                    "Delivery confirmed! Payment has been released to the seller."
                );
            }
        } catch (error) {
            console.error("Error confirming delivery:", error);
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to confirm delivery. Please try again.");
            }
        } finally {
            setConfirmingOrderId(null);
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
                route("update-profile"),
                formDataToSend
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
        const { name, value } = e.target;
        setPasswordData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSavePassword = () => {
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
                                <td>RM ${item.price * item.quantity}</td>
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

                                <Link href={route("logout")} method="POST">
                                    <button className="w-full flex items-center px-4 py-3.5 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all mt-4 group">
                                        <LogOut
                                            size={20}
                                            className="mr-3 flex-shrink-0"
                                        />
                                        <span className="flex-1">Logout</span>
                                    </button>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <ProfileTab
                                formData={formData}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                loading={loading}
                                handleCancel={handleCancel}
                                handleInputChange={handleInputChange}
                                handleSave={handleSave}
                            />
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
                                // NEW: Pass confirmation function
                                confirmOrderDelivery={confirmOrderDelivery}
                                confirmingOrderId={confirmingOrderId}
                            />
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <SecurityTab
                                showChangePassword={showChangePassword}
                                setShowChangePassword={setShowChangePassword}
                                passwordData={passwordData}
                                setPasswordData={setPasswordData}
                                handlePasswordChange={handlePasswordChange}
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
