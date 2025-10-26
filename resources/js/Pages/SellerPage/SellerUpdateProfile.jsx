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
    Store,
    FileText,
    Shield,
    Bell,
    CreditCard,
    Package,
    Truck,
    CheckCircle2,
    LogOut,
} from "lucide-react";

import dayjs from "dayjs";
import axios from "axios";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { LoadingProgress } from "@/Components/AdminPage/LoadingProgress";

export default function SellerUpdateProfile({ seller_storeInfo, auth }) {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("");
    const [loadingProgress, setLoadingProgress] = useState(false);

    const fileInputRef = useRef(null);

    // Enhanced seller data
    const [sellerData, setSellerData] = useState({
        ...auth.user,
        store: seller_storeInfo[0]?.seller_store || {},
    });

    const [formData, setFormData] = useState({
        ...sellerData,
        store_name: sellerData.store?.store_name || "",
        store_description: sellerData.store?.store_description || "",
        store_address: sellerData.store?.store_address || "",
        store_phone: sellerData.store?.store_phone || "",
    });

    // Image preview state
    const [imagePreview, setImagePreview] = useState(null);
    const [storeImagePreview, setStoreImagePreview] = useState(null);

    // Fetch seller data on component mount
    useEffect(() => {
        fetchSellerData();
    }, []);

    // Set initial image previews when component mounts
    useEffect(() => {
        if (sellerData.profile_image) {
            setImagePreview(getProfileImageUrl(sellerData.profile_image));
        }
        if (sellerData.store?.store_image) {
            setStoreImagePreview(
                getProfileImageUrl(sellerData.store.store_image)
            );
        }
    }, [sellerData]);

    // Helper function to get proper image URL
    const getProfileImageUrl = (imagePath) => {
        if (!imagePath) return "/image/user.png";

        if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return imagePath;
        }

        if (imagePath.startsWith("/")) {
            return import.meta.env.VITE_BASE_URL + imagePath;
        }

        return `${import.meta.env.VITE_BASE_URL}${imagePath}`;
    };

    // Fetch seller data from API
    const fetchSellerData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/seller/profile", {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            if (response.data.success) {
                const updatedData = {
                    ...auth.user,
                    store: response.data.store || {},
                };
                setSellerData(updatedData);
                setFormData({
                    ...updatedData,
                    store_name: updatedData.store?.store_name || "",
                    store_description:
                        updatedData.store?.store_description || "",
                    store_address: updatedData.store?.store_address || "",
                    store_phone: updatedData.store?.store_phone || "",
                });
            }
        } catch (error) {
            console.error("Error fetching seller data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle profile image upload
    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                setFormData((prev) => ({
                    ...prev,
                    profileImageFile: file,
                    profile_image: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle store image upload
    const handleStoreImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select a valid image file");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setStoreImagePreview(e.target.result);
                setFormData((prev) => ({
                    ...prev,
                    storeImageFile: file,
                    store_image: e.target.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle save profile
    const handleSave = async () => {
        try {
            setLoading(true);
            setLoadingProgress(true);
            setModalMessage("Updating profile...");
            setModalType("loading");

            const formDataToSend = new FormData();

            // Personal information
            formDataToSend.append("name", formData.name || "");
            formDataToSend.append("email", formData.email || "");
            formDataToSend.append("phone", formData.phone || "");

            // Store information
            formDataToSend.append("store_name", formData.store_name || "");
            formDataToSend.append(
                "store_description",
                formData.store_description || ""
            );
            formDataToSend.append(
                "store_address",
                formData.store_address || ""
            );
            formDataToSend.append("store_phone", formData.store_phone || "");

            // Append profile image if exists
            if (formData.profileImageFile) {
                formDataToSend.append(
                    "profile_image",
                    formData.profileImageFile
                );
            }

            // Append store image if exists
            if (formData.storeImageFile) {
                formDataToSend.append("store_image", formData.storeImageFile);
            }

            const response = await axios.post(
                "/api/seller/profile-update",
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

            if (response.data.success) {
                const updatedData = response.data.seller;

                // Update states
                setSellerData(updatedData);
                setFormData({
                    ...updatedData,
                    store_name: updatedData.store?.store_name || "",
                    store_description:
                        updatedData.store?.store_description || "",
                    store_address: updatedData.store?.store_address || "",
                    store_phone: updatedData.store?.store_phone || "",
                });

                // Update image previews
                if (response.data.seller.profile_image) {
                    setImagePreview(
                        getProfileImageUrl(updatedData.profile_image)
                    );
                }
                if (response.data.seller.store?.store_image) {
                    setStoreImagePreview(
                        getProfileImageUrl(updatedData.store.store_image)
                    );
                }

                setIsEditing(false);

                setModalMessage("Profile updated successfully!");
                setModalType("success");

                setTimeout(() => {
                    setLoadingProgress(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setModalMessage(
                error.response?.data?.message || "Failed to update profile"
            );
            setModalType("error");
            setLoadingProgress(true);

            setTimeout(() => {
                setLoadingProgress(false);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel edit
    const handleCancel = () => {
        setFormData({
            ...sellerData,
            store_name: sellerData.store?.store_name || "",
            store_description: sellerData.store?.store_description || "",
            store_address: sellerData.store?.store_address || "",
            store_phone: sellerData.store?.store_phone || "",
        });
        setImagePreview(getProfileImageUrl(sellerData.profile_image));
        setStoreImagePreview(getProfileImageUrl(sellerData.store?.store_image));
        setIsEditing(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const triggerProfileFileInput = () => {
        document.getElementById("profile-image-input").click();
    };

    const triggerStoreFileInput = () => {
        document.getElementById("store-image-input").click();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Loading Progress */}
            {loadingProgress && (
                <LoadingProgress
                    modalType={modalType}
                    modalMessage={modalMessage}
                />
            )}

            {/* Sidebar */}
            <SellerSidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="max-w-6xl mx-auto">
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
                                                        sellerData.profile_image
                                                    ) ||
                                                    "/image/user.png"
                                                }
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "/image/user.png";
                                                }}
                                            />
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={
                                                    triggerProfileFileInput
                                                }
                                                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all transform group-hover:scale-110 border-2 border-white"
                                            >
                                                <Camera size={16} />
                                            </button>
                                        )}
                                        <input
                                            id="profile-image-input"
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleProfileImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 text-center">
                                        {formData.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {formData.store_name}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        Seller since{" "}
                                        {dayjs(auth.user.created_at).format(
                                            "MMMM YYYY"
                                        )}
                                    </p>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <CheckCircle2
                                            size={14}
                                            className="text-green-500 mr-1"
                                        />
                                        Verified Seller
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    {[
                                        {
                                            id: "profile",
                                            icon: User,
                                            label: "Profile & Store",
                                        },
                                        {
                                            id: "security",
                                            icon: Shield,
                                            label: "Security",
                                        },
                                        {
                                            id: "documents",
                                            icon: FileText,
                                            label: "Store Documents",
                                        },
                                        {
                                            id: "notifications",
                                            icon: Bell,
                                            label: "Notifications",
                                        },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() =>
                                                setActiveTab(item.id)
                                            }
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
                            {/* Profile & Store Tab */}
                            {activeTab === "profile" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="border-b border-gray-100 px-6 py-5">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">
                                                    Profile & Store Information
                                                </h2>
                                                <p className="text-gray-600 mt-1">
                                                    Manage your personal and
                                                    store information
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
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter your full name"
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
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter your email"
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
                                                        value={
                                                            formData.phone || ""
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter your phone number"
                                                    />
                                                ) : (
                                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <Phone
                                                            size={20}
                                                            className="text-gray-400 mr-3"
                                                        />
                                                        <span className="text-gray-900 font-medium">
                                                            {formData.phone ||
                                                                "Not provided"}
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
                                                        ).format(
                                                            "MMMM D, YYYY"
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Store Information */}
                                            <div className="lg:col-span-2 border-t pt-8 mt-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <Store
                                                        size={20}
                                                        className="mr-2 text-green-600"
                                                    />
                                                    Store Information
                                                </h3>
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Image
                                                </label>
                                                <div className="flex items-center space-x-6">
                                                    <div className="relative group">
                                                        <div className="w-32 h-32 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                                                            <img
                                                                src={
                                                                    storeImagePreview ||
                                                                    getProfileImageUrl(
                                                                        sellerData
                                                                            .store
                                                                            ?.store_image
                                                                    ) ||
                                                                    "/image/store-placeholder.png"
                                                                }
                                                                alt="Store"
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.src =
                                                                        "/image/store-placeholder.png";
                                                                }}
                                                            />
                                                        </div>
                                                        {isEditing && (
                                                            <button
                                                                onClick={
                                                                    triggerStoreFileInput
                                                                }
                                                                className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all transform group-hover:scale-110 border-2 border-white"
                                                            >
                                                                <Camera
                                                                    size={16}
                                                                />
                                                            </button>
                                                        )}
                                                        <input
                                                            id="store-image-input"
                                                            type="file"
                                                            onChange={
                                                                handleStoreImageUpload
                                                            }
                                                            accept="image/*"
                                                            className="hidden"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-gray-600">
                                                            Upload a clear image
                                                            of your store.
                                                            Recommended size:
                                                            500x500px
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Name
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        name="store_name"
                                                        value={
                                                            formData.store_name
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter your store name"
                                                    />
                                                ) : (
                                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <Store
                                                            size={20}
                                                            className="text-gray-400 mr-3"
                                                        />
                                                        <span className="text-gray-900 font-medium">
                                                            {
                                                                formData.store_name
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Description
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="store_description"
                                                        value={
                                                            formData.store_description ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        rows={4}
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Describe your store..."
                                                    />
                                                ) : (
                                                    <div className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <FileText
                                                            size={20}
                                                            className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                                        />
                                                        <span className="text-gray-900 font-medium">
                                                            {formData.store_description ||
                                                                "No description provided"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Address
                                                </label>
                                                {isEditing ? (
                                                    <textarea
                                                        name="store_address"
                                                        value={
                                                            formData.store_address ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        rows={3}
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter your store address"
                                                    />
                                                ) : (
                                                    <div className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <MapPin
                                                            size={20}
                                                            className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                                        />
                                                        <span className="text-gray-900 font-medium">
                                                            {formData.store_address ||
                                                                "No address provided"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Store Phone
                                                </label>
                                                {isEditing ? (
                                                    <input
                                                        type="tel"
                                                        name="store_phone"
                                                        value={
                                                            formData.store_phone ||
                                                            ""
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                        placeholder="Enter store phone number"
                                                    />
                                                ) : (
                                                    <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                                        <Phone
                                                            size={20}
                                                            className="text-gray-400 mr-3"
                                                        />
                                                        <span className="text-gray-900 font-medium">
                                                            {formData.store_phone ||
                                                                "Not provided"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Other tabs can be added similarly */}
                            {activeTab === "security" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Security Settings
                                    </h2>
                                    <p className="text-gray-600">
                                        Security features coming soon...
                                    </p>
                                </div>
                            )}

                            {activeTab === "documents" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Store Documents
                                    </h2>
                                    <p className="text-gray-600">
                                        Document management coming soon...
                                    </p>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Notification Settings
                                    </h2>
                                    <p className="text-gray-600">
                                        Notification preferences coming soon...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
