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
} from "lucide-react";
import { useState } from "react";

export function SellerViewProduct_Modal({ product, onClose }) {
    console.log(product);

    const [activeMedia, setActiveMedia] = useState(
        product.product_image?.[0]
            ? {
                  type: "image",
                  path:
                      import.meta.env.VITE_BASE_URL +
                      product.product_image[0].image_path,
              }
            : null
    );

    const [activeTab, setActiveTab] = useState("overview");

    // Helper functions
    const getFeatureText = (feature) => {
        if (typeof feature === "string") return feature;
        return feature.feature_text || feature.item_name || "";
    };

    const getItemText = (item) => {
        if (typeof item === "string") return item;
        return item.item_text || item.item_name || "";
    };

    const getConditionStyle = (condition) => {
        const styles = {
            new: "bg-green-100 text-green-800 border-green-200",
            excellent: "bg-blue-100 text-blue-800 border-blue-200",
            good: "bg-amber-100 text-amber-800 border-amber-200",
            fair: "bg-orange-100 text-orange-800 border-orange-200",
            poor: "bg-red-100 text-red-800 border-red-200",
        };
        return styles[condition] || styles.good;
    };

    // Check if there are product options
    const hasOptions =
        product.product_option &&
        product.product_option.some(
            (option) =>
                option.product_option_value &&
                option.product_option_value.length > 0
        );

    console.log("Has options?", hasOptions);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {product.product_name}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Product ID: {product.product_id}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-500" />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b">
                    <nav className="flex space-x-8 px-6">
                        {["overview", "features", "options", "media"].map(
                            (tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab
                                            ? "border-blue-500 text-blue-600"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    {tab === "overview" && "Overview"}
                                    {tab === "features" &&
                                        "Features & Includes"}
                                    {tab === "options" && "Product Options"}
                                    {tab === "media" && "Media Gallery"}
                                </button>
                            )
                        )}
                    </nav>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Overview Tab */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                            {/* Media Preview */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 aspect-square flex items-center justify-center">
                                    {activeMedia ? (
                                        activeMedia.type === "image" ? (
                                            <img
                                                src={activeMedia.path}
                                                alt="Product preview"
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <video
                                                src={activeMedia.path}
                                                controls
                                                className="w-full h-full object-contain rounded-lg"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Package size={48} />
                                            <span className="ml-2">
                                                No media available
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6">
                                {/* Price and Status */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            RM{" "}
                                            {parseFloat(
                                                product.product_price
                                            ).toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Price
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getConditionStyle(
                                                product.product_condition
                                            )}`}
                                        >
                                            {product.product_condition
                                                ?.charAt(0)
                                                .toUpperCase() +
                                                product.product_condition?.slice(
                                                    1
                                                )}
                                        </span>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Condition
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="text-black font-semibold">
                                                {product.product_quantity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            In Stock
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="text-black font-semibold">
                                                {product.product_weight} kg
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Weight
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="text-black font-semibold">
                                                {product.product_size}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Size
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center">
                                            <span className="text-black font-semibold capitalize">
                                                {product.product_status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Status
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                                        <List size={18} className="mr-2" />
                                        Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                                        {product.product_description ||
                                            "No description provided."}
                                    </p>
                                </div>

                                {/* Specifications */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        Specifications
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">
                                                Brand:
                                            </span>
                                            <span className="text-black font-medium ml-2">
                                                {product.product_brand ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Material:
                                            </span>
                                            <span className="text-black font-medium ml-2">
                                                {product.product_material ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Manufacturer:
                                            </span>
                                            <span className="text-black font-medium ml-2">
                                                {product.product_manufacturer ||
                                                    "Not specified"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">
                                                Category:
                                            </span>
                                            <span className="text-black font-medium ml-2">
                                                {
                                                    product.category
                                                        ?.category_name
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Features & Includes Tab */}
                    {activeTab === "features" && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Key Features */}
                                <div className="bg-white rounded-xl border p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                                        <Star
                                            size={20}
                                            className="text-yellow-500 mr-2"
                                        />
                                        Key Features
                                    </h3>
                                    {product.product_feature.length > 0 ? (
                                        <div className="space-y-3">
                                            {product.product_feature.map(
                                                (feature, index) => {
                                                    return (
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
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            No key features specified
                                        </p>
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
                                    {product.product_include_item.length > 0 ? (
                                        <div className="space-y-3">
                                            {product.product_include_item.map(
                                                (item, index) => {
                                                    return (
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
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">
                                            No items included
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Product Options Tab */}
                    {activeTab === "options" && (
                        <div className="p-6">
                            <div className="bg-white rounded-xl border p-6">
                                <h3 className="font-semibold text-gray-900 mb-6 flex items-center">
                                    <Sliders
                                        size={20}
                                        className="text-purple-500 mr-2"
                                    />
                                    Product Options & Variations
                                </h3>

                                {hasOptions ? (
                                    <div className="space-y-6">
                                        {product.product_option.map(
                                            (option, optionIndex) =>
                                                option.product_option_value &&
                                                option.product_option_value
                                                    .length > 0 && (
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
                                                                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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
                                            variations or options configured.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Media Gallery Tab */}
                    {activeTab === "media" && (
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Images */}
                                <div className="lg:col-span-2">
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Product Images
                                    </h3>
                                    {product.product_image &&
                                    product.product_image.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {product.product_image.map(
                                                (img, index) => (
                                                    <div
                                                        key={index}
                                                        className="group relative"
                                                    >
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_BASE_URL +
                                                                img.image_path
                                                            }
                                                            alt={`Product image ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                        />
                                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                                                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                                View
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-12">
                                            No images available
                                        </p>
                                    )}
                                </div>

                                {/* Videos */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-4">
                                        Product Videos
                                    </h3>
                                    {product.product_video &&
                                    product.product_video.length > 0 ? (
                                        <div className="space-y-4">
                                            {product.product_video.map(
                                                (vid, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-gray-100 rounded-lg p-3"
                                                    >
                                                        <video
                                                            src={
                                                                BASE_URL +
                                                                vid.video_path
                                                            }
                                                            controls
                                                            className="w-full rounded-lg"
                                                        />
                                                        <p className="text-sm text-gray-600 mt-2 text-center">
                                                            Video {index + 1}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-12">
                                            No videos available
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Created:{" "}
                        {new Date(product.created_at).toLocaleDateString()}
                        {product.updated_at !== product.created_at && (
                            <span className="ml-4">
                                Updated:{" "}
                                {new Date(
                                    product.updated_at
                                ).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
