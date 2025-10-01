import {
    X,
    Package,
    Ruler,
    Weight,
    Shield,
    CheckCircle,
    Truck,
    Sliders,
    Star,
    Box,
    List,
    ImageIcon,
    Video,
    Info,
    Calendar,
    Edit,
    Eye,
    Layers,
    Tag,
    ShoppingCart,
    BarChart3,
} from "lucide-react";
import { useState } from "react";

export function SellerViewProduct_Modal({ product, onClose }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // Helper functions
    const getConditionStyle = (condition) => {
        const styles = {
            new: "bg-green-100 text-green-800 border-green-200",
            like_new: "bg-blue-100 text-blue-800 border-blue-200",
            excellent: "bg-emerald-100 text-emerald-800 border-emerald-200",
            good: "bg-amber-100 text-amber-800 border-amber-200",
            fair: "bg-orange-100 text-orange-800 border-orange-200",
            poor: "bg-red-100 text-red-800 border-red-200",
        };
        return styles[condition] || styles.good;
    };

    const getConditionLabel = (condition) => {
        const labels = {
            new: "Brand New",
            like_new: "Like New",
            excellent: "Excellent",
            good: "Good",
            fair: "Fair",
            poor: "Poor",
        };
        return labels[condition] || condition;
    };

    const getStatusStyle = (status) => {
        const styles = {
            available: "bg-green-100 text-green-800",
            reserved: "bg-yellow-100 text-yellow-800",
            sold: "bg-gray-100 text-gray-800",
            draft: "bg-blue-100 text-blue-800",
        };
        return styles[status] || styles.draft;
    };

    const getStatusLabel = (status) => {
        const labels = {
            available: "Available",
            reserved: "Reserved",
            sold: "Sold",
            draft: "Draft",
        };
        return labels[status] || status;
    };

    const hasOptions = product?.product_option?.some(
        (option) => option.product_option_value?.length > 0
    );

    const hasFeatures = product?.product_feature?.length > 0;
    const hasIncludedItems = product?.product_include_item?.length > 0;
    const hasImages = product?.product_image?.length > 0;
    const hasVideos = product?.product_video?.length > 0;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const openImageModal = (index) => {
        setSelectedImageIndex(index);
        setIsImageModalOpen(true);
    };

    const nextImage = () => {
        setSelectedImageIndex(
            (prev) => (prev + 1) % product.product_image.length
        );
    };

    const prevImage = () => {
        setSelectedImageIndex(
            (prev) =>
                (prev - 1 + product.product_image.length) %
                product.product_image.length
        );
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white sticky top-0 z-10">
                        <div className="flex items-center space-x-4">
                            <div className="bg-indigo-100 p-3 rounded-lg">
                                <Package
                                    className="text-indigo-600"
                                    size={24}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">
                                    {product?.product_name}
                                </h2>
                                <p className="text-sm text-gray-600 flex items-center space-x-2 mt-1">
                                    <span>ID: {product?.product_id}</span>
                                    <span>•</span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                            product?.product_status
                                        )}`}
                                    >
                                        {getStatusLabel(
                                            product?.product_status
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="border-b bg-white sticky top-[84px] z-10">
                        <nav className="flex space-x-8 px-6 overflow-x-auto">
                            {[
                                {
                                    id: "overview",
                                    label: "Overview",
                                    icon: Eye,
                                },
                                {
                                    id: "features",
                                    label: "Features",
                                    icon: List,
                                },
                                {
                                    id: "options",
                                    label: "Options",
                                    icon: Sliders,
                                },
                                {
                                    id: "media",
                                    label: "Media",
                                    icon: ImageIcon,
                                },
                                {
                                    id: "stats",
                                    label: "Statistics",
                                    icon: BarChart3,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center ${
                                        activeTab === tab.id
                                            ? "border-indigo-500 text-indigo-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    <tab.icon size={18} className="mr-2" />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Overview Tab */}
                        {activeTab === "overview" && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                                {/* Media Section */}
                                <div className="space-y-4">
                                    {/* Main Image */}
                                    <div className="bg-gray-50 rounded-xl p-4 aspect-square flex items-center justify-center relative">
                                        {hasImages ? (
                                            <img
                                                src={`${BASE_URL}${product.product_image[0].image_path}`}
                                                alt={product.product_name}
                                                className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                onClick={() =>
                                                    openImageModal(0)
                                                }
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                                <ImageIcon size={48} />
                                                <span className="mt-2 text-sm">
                                                    No image available
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Thumbnails */}
                                    {hasImages &&
                                        product.product_image.length > 1 && (
                                            <div className="grid grid-cols-4 gap-2">
                                                {product.product_image
                                                    .slice(0, 4)
                                                    .map((img, index) => (
                                                        <div
                                                            key={index}
                                                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all"
                                                            onClick={() =>
                                                                openImageModal(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={`${BASE_URL}${img.image_path}`}
                                                                alt={`${
                                                                    product.product_name
                                                                } ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                {product.product_image.length >
                                                    4 && (
                                                    <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 text-sm">
                                                        +
                                                        {product.product_image
                                                            .length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {/* Product Details */}
                                <div className="space-y-6">
                                    {/* Price and Condition */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-3xl font-bold text-gray-900">
                                                RM{" "}
                                                {parseFloat(
                                                    product?.product_price || 0
                                                ).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Selling Price
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getConditionStyle(
                                                    product?.product_condition
                                                )}`}
                                            >
                                                {getConditionLabel(
                                                    product?.product_condition
                                                )}
                                            </span>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Condition
                                            </p>
                                        </div>
                                    </div>

                                    {/* Quick Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <div className="flex items-center justify-center space-x-1">
                                                <ShoppingCart
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {product?.product_quantity ||
                                                        0}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                In Stock
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <div className="flex items-center justify-center space-x-1">
                                                <Weight
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {product?.product_weight ||
                                                        "N/A"}{" "}
                                                    kg
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Weight
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <div className="flex items-center justify-center space-x-1">
                                                <Ruler
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {product?.product_size ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Size
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-white rounded-lg">
                                            <div className="flex items-center justify-center space-x-1">
                                                <Layers
                                                    size={18}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-lg font-semibold text-gray-900 capitalize">
                                                    {product?.category
                                                        ?.category_name ||
                                                        "N/A"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Category
                                            </p>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-white rounded-lg border p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Info
                                                size={18}
                                                className="mr-2 text-indigo-500"
                                            />
                                            Description
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">
                                            {product?.product_description ||
                                                "No description provided."}
                                        </p>
                                    </div>

                                    {/* Specifications */}
                                    <div className="bg-white rounded-lg border p-4">
                                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                            <Tag
                                                size={18}
                                                className="mr-2 text-indigo-500"
                                            />
                                            Specifications
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">
                                                    Brand:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {product?.product_brand ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">
                                                    Material:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {product?.product_material ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">
                                                    Manufacturer:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {product?.product_manufacturer ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">
                                                    Category:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {product?.category
                                                        ?.category_name ||
                                                        "Not specified"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Features Tab */}
                        {activeTab === "features" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Key Features */}
                                    <div className="bg-white rounded-xl border p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <Star
                                                size={20}
                                                className="text-yellow-500 mr-2"
                                            />
                                            Key Features
                                        </h3>
                                        {hasFeatures ? (
                                            <div className="space-y-3">
                                                {product.product_feature.map(
                                                    (feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start p-3 bg-blue-50 rounded-lg"
                                                        >
                                                            <CheckCircle
                                                                size={18}
                                                                className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                                                            />
                                                            <span className="text-gray-700">
                                                                {
                                                                    feature.feature_text
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Star
                                                    size={32}
                                                    className="mx-auto text-gray-300 mb-2"
                                                />
                                                <p>No key features specified</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Included Items */}
                                    <div className="bg-white rounded-xl border p-6">
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <Box
                                                size={20}
                                                className="text-green-500 mr-2"
                                            />
                                            What's Included
                                        </h3>
                                        {hasIncludedItems ? (
                                            <div className="space-y-3">
                                                {product.product_include_item.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start p-3 bg-green-50 rounded-lg"
                                                        >
                                                            <Truck
                                                                size={18}
                                                                className="text-green-500 mt-0.5 mr-3 flex-shrink-0"
                                                            />
                                                            <span className="text-gray-700">
                                                                {item.item_name}
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Box
                                                    size={32}
                                                    className="mx-auto text-gray-300 mb-2"
                                                />
                                                <p>No items included</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options Tab */}
                        {activeTab === "options" && (
                            <div className="p-6">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
                                        <Sliders
                                            size={20}
                                            className="text-purple-500 mr-2"
                                        />
                                        Product Options
                                    </h3>

                                    {hasOptions ? (
                                        <div className="space-y-6">
                                            {product.product_option.map(
                                                (option, optionIndex) =>
                                                    option.product_option_value
                                                        ?.length > 0 && (
                                                        <div
                                                            key={optionIndex}
                                                            className="border rounded-lg p-4 bg-gray-50"
                                                        >
                                                            <h4 className="font-medium text-gray-800 mb-3 capitalize">
                                                                {option.option_name ||
                                                                    `Option ${
                                                                        optionIndex +
                                                                        1
                                                                    }`}
                                                            </h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {option.product_option_value.map(
                                                                    (
                                                                        value,
                                                                        valueIndex
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                valueIndex
                                                                            }
                                                                            className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700"
                                                                        >
                                                                            {
                                                                                value.option_value
                                                                            }
                                                                        </span>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Sliders
                                                size={48}
                                                className="text-gray-300 mx-auto mb-4"
                                            />
                                            <p className="text-gray-500 text-lg font-medium">
                                                No product options available
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                This product doesn't have any
                                                variations or options
                                                configured.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Media Tab */}
                        {activeTab === "media" && (
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Images Section */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <ImageIcon
                                                size={20}
                                                className="text-indigo-500 mr-2"
                                            />
                                            Product Images (
                                            {hasImages
                                                ? product.product_image.length
                                                : 0}
                                            )
                                        </h3>
                                        {hasImages ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {product.product_image.map(
                                                    (img, index) => (
                                                        <div
                                                            key={index}
                                                            className="group relative cursor-pointer"
                                                            onClick={() =>
                                                                openImageModal(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={`${BASE_URL}${img.image_path}`}
                                                                alt={`Product image ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-indigo-400 transition-colors"
                                                            />
                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                                                <Eye
                                                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    size={20}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                                <ImageIcon
                                                    size={48}
                                                    className="mx-auto text-gray-300 mb-4"
                                                />
                                                <p className="text-gray-500">
                                                    No images available
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Videos Section */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                            <Video
                                                size={20}
                                                className="text-red-500 mr-2"
                                            />
                                            Product Videos (
                                            {hasVideos
                                                ? product.product_video.length
                                                : 0}
                                            )
                                        </h3>
                                        {hasVideos ? (
                                            <div className="space-y-4">
                                                {product.product_video.map(
                                                    (vid, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-gray-100 rounded-lg p-3"
                                                        >
                                                            <video
                                                                src={`${BASE_URL}${vid.video_path}`}
                                                                controls
                                                                className="w-full rounded-lg"
                                                            />
                                                            <p className="text-sm text-gray-600 mt-2 text-center">
                                                                Video{" "}
                                                                {index + 1}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                                <Video
                                                    size={48}
                                                    className="mx-auto text-gray-300 mb-4"
                                                />
                                                <p className="text-gray-500">
                                                    No videos available
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Statistics Tab */}
                        {activeTab === "stats" && (
                            <div className="p-6">
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
                                        <BarChart3
                                            size={20}
                                            className="text-indigo-500 mr-2"
                                        />
                                        Product Statistics
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Created Date
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {product?.created_at
                                                            ? formatDate(
                                                                  product.created_at
                                                              )
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <Calendar
                                                    className="text-gray-400"
                                                    size={20}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Last Updated
                                                    </p>
                                                    <p className="font-semibold text-gray-900">
                                                        {product?.updated_at
                                                            ? formatDate(
                                                                  product.updated_at
                                                              )
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <Edit
                                                    className="text-gray-400"
                                                    size={20}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-600 font-medium">
                                                    Product Status
                                                </p>
                                                <p
                                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusStyle(
                                                        product?.product_status
                                                    )}`}
                                                >
                                                    {getStatusLabel(
                                                        product?.product_status
                                                    )}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <p className="text-sm text-green-600 font-medium">
                                                    Stock Level
                                                </p>
                                                <p className="text-2xl font-bold text-green-800 mt-2">
                                                    {product?.product_quantity ||
                                                        0}{" "}
                                                    units
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                        <div className="text-sm text-gray-600 flex items-center space-x-4">
                            <div className="flex items-center">
                                <Calendar size={16} className="mr-1" />
                                <span>
                                    Created:{" "}
                                    {product?.created_at
                                        ? formatDate(product.created_at)
                                        : "N/A"}
                                </span>
                            </div>
                            {product?.updated_at !== product?.created_at && (
                                <div className="flex items-center">
                                    <Edit size={16} className="mr-1" />
                                    <span>
                                        Updated:{" "}
                                        {product?.updated_at
                                            ? formatDate(product.updated_at)
                                            : "N/A"}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            {isImageModalOpen && hasImages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setIsImageModalOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative">
                            <img
                                src={`${BASE_URL}${product.product_image[selectedImageIndex].image_path}`}
                                alt={`Product image ${selectedImageIndex + 1}`}
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />

                            {product.product_image.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="text-center text-white mt-4">
                            Image {selectedImageIndex + 1} of{" "}
                            {product.product_image.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
