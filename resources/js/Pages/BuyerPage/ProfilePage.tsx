import { useState, useEffect } from "react";
import {
    Camera,
    Shield,
    User,
    ShoppingBag,
    LogOut,
    CheckCircle,
} from "lucide-react";

import dayjs from "dayjs";
import Swal from "sweetalert2";

import { route } from "ziggy-js";

import { Link } from "@inertiajs/react";

import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";

import { OrdersTab } from "@/Components/BuyerPage/ProfilePage/OrdersTab";
import { SecurityTab } from "@/Components/BuyerPage/ProfilePage/SecurityTab";
import { ProfileTab } from "@/Components/BuyerPage/ProfilePage/ProfileTab";
import { ReceiptModal } from "@/Components/BuyerPage/ProfilePage/ReceiptModal";

import { useOrder } from "@/Features/Profile/Hooks/useOrder";
import { useProfile } from "@/Features/Profile/Hooks/useProfile";

export default function ProfilePage({
    show_order_success,
    order_id,
    payment_success,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // NEW: Separate state for image preview
    const [imagePreview, setImagePreview] = useState(null);

    // Order history state with pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const recentOrderId = order_id ?? null;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Hooks orders
    const {
        fetchPastOrder,
        orderReceiveConfirmation,
        recentOrder,
        orderPlaced,
        pastOrder,
        orderSuccessModal,
        isLoading: isOrdersLoading,
        activeTab,
        setActiveTab,
        latestOrderId,
    } = useOrder();
    // Hooks profile
    const {
        imgUpdate,
        imgPreviewUrl,
        infoUpdate,
        discardUpdate,
        imgPreview,
        formData,
        setFormData,
        userData,
        fileInputRef,
        isLoading: isProfileLoading,
    } = useProfile();

    // NEW: Function to show the order success modal
    const showOrderSuccessAlert = () => {
        Swal.fire({
            title: "Order Confirmed! 🎉",
            html: `
            <div class="text-center">
                <div class="text-green-500 text-6xl mb-4">✓</div>
                <p class="text-lg font-semibold text-gray-800 mb-3">
                    Your order has been successfully placed!
                </p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p class="text-sm text-blue-700">
                        <strong>Your order receipt is available in the Orders tab.</strong><br>
                        You can track your order status and view your order details here.
                    </p>
                </div>
            </div>
        `,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
            showCancelButton: false, // ❌ remove cancel button
            allowOutsideClick: false,
            allowEscapeKey: false,
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-6 py-3 rounded-lg font-medium",
            },
        }).then(() => {
            // When user clicks OK
            recentOrder(order_id);
            orderSuccessModal;
        });
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

    const triggerFileInput = () => {
        fileInputRef.current.click();
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
                        order.date,
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
                        `,
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

    // Fetch data on component mount
    useEffect(() => {
        fetchPastOrder();
        orderPlaced(show_order_success, payment_success);
    }, []);

    // FIXED: Set initial image preview when component mounts
    useEffect(() => {
        if (userData.profile_image) {
            const initialImageUrl = imgPreviewUrl(userData.profile_image);
            setImagePreview(initialImageUrl);
        } else {
            setImagePreview("/image/user.png");
        }
    }, [userData.profile_image]);

    useEffect(() => {
        if (orderSuccessModal) {
            showOrderSuccessAlert();
        }
    }, [orderSuccessModal, recentOrderId]);

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
                                        {/* FIXED: Simplified image source logic */}
                                        <img
                                            src={
                                                imgPreview ||
                                                imagePreview ||
                                                "/image/user.png"
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error(
                                                    "❌ Error loading image:",
                                                    e.currentTarget.src,
                                                );
                                                    e.currentTarget.src = "/image/user.png";
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
                                        onChange={imgUpdate}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 text-center">
                                    {userData.name}
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Member since{" "}
                                    {dayjs(userData.created_at).format(
                                        "MMMM YYYY",
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
                                        badge: pastOrder.length,
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

                                <Link href={route("logout")} method="post">
                                    <button className="flex items-center px-4 py-3.5 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all mt-4 group">
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
                                loading={isProfileLoading}
                                handleCancel={discardUpdate}
                                handleInputChange={handleInputChange}
                                handleSave={infoUpdate}
                            />
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <OrdersTab
                                orderHistory={pastOrder}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                paginate={paginate}
                                viewReceipt={viewReceipt}
                                loading={isOrdersLoading}
                                confirmOrderDelivery={orderReceiveConfirmation}
                                confirmingOrderId={latestOrderId}
                                recentOrderId={recentOrderId}
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
                                confirmOrderDelivery={orderReceiveConfirmation}
                                confirmingOrderId={latestOrderId}
                            />
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
