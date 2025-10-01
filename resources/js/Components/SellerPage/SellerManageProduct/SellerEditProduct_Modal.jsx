import React, { useEffect, useState, useRef } from "react";
import {
    X,
    Upload,
    Ruler,
    Weight,
    Info,
    Plus,
    Minus,
    Sliders,
    Camera,
    Video,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Trash2,
    Image as ImageIcon,
    Edit3,
    Save,
} from "lucide-react";

export function SellerEditProduct_Modal({
    onEdit,
    product,
    list_categories,
    onClose,
}) {
    const BASEURL = "http://127.0.0.1:8000/storage/";
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Product fields with initial values from the product prop
    const [productName, setProductName] = useState(product?.product_name || "");
    const [productDescription, setProductDescription] = useState(
        product?.product_description || ""
    );
    const [productPrice, setProductPrice] = useState(
        product?.product_price || ""
    );
    const [productQuantity, setProductQuantity] = useState(
        product?.product_quantity || "1"
    );
    const [productStatus, setProductStatus] = useState(
        product?.product_status || "available"
    );
    const [productCondition, setProductCondition] = useState(
        product?.product_condition || ""
    );
    const [productCategories, setProductCategories] = useState(
        product?.category_id || ""
    );
    const [productBrand, setProductBrand] = useState(
        product?.product_brand || ""
    );
    const [productWeight, setProductWeight] = useState(
        product?.product_weight || ""
    );
    const [productOptions, setProductOptions] = useState([]);

    const [productMaterial, setProductMaterial] = useState(
        product?.product_material || ""
    );
    const [productManufacturer, setProductManufacturer] = useState(
        product?.product_manufacturer || ""
    );

    const [productImages, setProductImages] = useState([]);
    const [productVideos, setProductVideos] = useState([]);

    const [newImages, setNewImages] = useState([]);
    const [newVideos, setNewVideos] = useState([]);

    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [videosToDelete, setVideosToDelete] = useState([]);

    // Features and specifications
    const [keyFeatures, setKeyFeatures] = useState([""]);
    const [includedItems, setIncludedItems] = useState([""]);

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Condition options
    const conditionOptions = [
        {
            value: "new",
            label: "Brand New",
            description: "Never used, with original tags and packaging",
        },
        {
            value: "like_new",
            label: "Like New",
            description: "Minimal signs of use, looks almost new",
        },
        {
            value: "excellent",
            label: "Excellent",
            description: "Lightly used, well maintained",
        },
        {
            value: "good",
            label: "Good",
            description: "Normal signs of use, fully functional",
        },
        {
            value: "fair",
            label: "Fair",
            description: "Visible wear but still functional",
        },
        {
            value: "poor",
            label: "Poor",
            description: "Heavily used, may need repairs",
        },
    ];

    const steps = [
        { number: 1, title: "Basic Info", icon: "📝" },
        { number: 2, title: "Details", icon: "🔍" },
        { number: 3, title: "Specifications", icon: "📋" },
        { number: 4, title: "Options", icon: "⚙️" },
        { number: 5, title: "Media", icon: "🖼️" },
        { number: 6, title: "Review", icon: "👀" },
    ];

    // Initialize form with product data
    useEffect(() => {
        if (product) {
            setProductName(product.product_name || "");
            setProductDescription(product.product_description || "");
            setProductPrice(product.product_price || "");
            setProductQuantity(product.product_quantity || "1");
            setProductStatus(product.product_status || "available");
            setProductCondition(product.product_condition || "");
            setProductCategories(product.category_id || "");
            setProductBrand(product.product_brand || "");
            setProductWeight(product.product_weight || "");
            setProductMaterial(product.product_material || "");
            setProductManufacturer(product.product_manufacturer || "");

            // Handle arrays with fallbacks
            setKeyFeatures(
                product.product_feature?.map((f) => f.feature_text) || [""]
            );
            setIncludedItems(
                product.product_include_item?.map((item) => item.item_name) || [
                    "",
                ]
            );

            // Handle product options
            if (product.product_option && product.product_option.length > 0) {
                setProductOptions(
                    product.product_option.map((opt) => ({
                        option_id: opt.option_id,
                        option_name: opt.option_name || "",
                        option_values:
                            opt.product_option_value?.map((val) => ({
                                id: val.value_id, // ✅ Store the value ID
                                name: val.option_value,
                            })) || [],
                        newValue: "",
                    }))
                );
            } else {
                setProductOptions([
                    {
                        option_name: "",
                        option_values: [],
                        newValue: "",
                    },
                ]);
            }

            // Handle images and videos
            setProductImages(product.product_image || []);
            setProductVideos(product.product_video || []);
        }
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("product_id", product.product_id);

            // Basic product info
            formData.append("product_name", productName);
            formData.append("product_description", productDescription);
            formData.append("product_price", productPrice);
            formData.append("product_quantity", productQuantity);
            formData.append("product_status", productStatus);
            formData.append("product_condition", productCondition);
            formData.append("category_id", productCategories);
            formData.append("product_brand", productBrand);
            formData.append("product_material", productMaterial);
            formData.append("product_manufacturer", productManufacturer);
            formData.append("product_weight", productWeight);

            // Add key features (only non-empty ones)
            keyFeatures.forEach((feature, index) => {
                if (feature.trim() !== "") {
                    formData.append(`key_features[${index}]`, feature);
                }
            });

            // Add included items (only non-empty ones)
            includedItems.forEach((item, index) => {
                if (item.trim() !== "") {
                    formData.append(`included_items[${index}]`, item);
                }
            });

            // Add product options
            productOptions.forEach((option, index) => {
                if (
                    option.option_name.trim() !== "" &&
                    option.option_values.length > 0
                ) {
                    formData.append(
                        `options[${index}][name]`,
                        option.option_name
                    );

                    // Send the option_id for existing options
                    if (option.option_id) {
                        formData.append(
                            `options[${index}][id]`,
                            option.option_id
                        );
                    }

                    // Send values with their structure
                    option.option_values.forEach((valueObj, valueIndex) => {
                        // For existing values with IDs
                        if (valueObj.id) {
                            formData.append(
                                `options[${index}][values][${valueIndex}][id]`,
                                valueObj.id
                            );
                            formData.append(
                                `options[${index}][values][${valueIndex}][name]`,
                                valueObj.name
                            );
                        } else {
                            // For new values (no ID yet)
                            formData.append(
                                `options[${index}][values][${valueIndex}][name]`,
                                valueObj.name || valueObj
                            );
                        }
                    });
                }
            });

            // Append new images
            newImages.forEach((img) => {
                if (img.file) {
                    formData.append("new_product_images[]", img.file);
                }
            });

            // Append new videos
            newVideos.forEach((vid) => {
                if (vid.file) {
                    formData.append("new_product_videos[]", vid.file);
                }
            });

            // Append images to delete
            imagesToDelete.forEach((imgId, index) => {
                formData.append(`images_to_delete[${index}]`, imgId);
            });

            // Append videos to delete
            videosToDelete.forEach((vidId, index) => {
                formData.append(`videos_to_delete[${index}]`, vidId);
            });

            await onEdit(e, formData);
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addFeature = () => {
        if (keyFeatures.length < 10) {
            setKeyFeatures([...keyFeatures, ""]);
        }
    };

    const handleFeatureChange = (index, value) => {
        const newFeatures = [...keyFeatures];
        newFeatures[index] = value;
        setKeyFeatures(newFeatures);
    };

    const removeFeature = (index) => {
        if (keyFeatures.length > 1) {
            setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
        }
    };

    const addIncludedItem = () => {
        if (includedItems.length < 10) {
            setIncludedItems([...includedItems, ""]);
        }
    };

    const handleIncludedItemChange = (index, value) => {
        const newItems = [...includedItems];
        newItems[index] = value;
        setIncludedItems(newItems);
    };

    const removeIncludedItem = (index) => {
        if (includedItems.length > 1) {
            setIncludedItems(includedItems.filter((_, i) => i !== index));
        }
    };

    // Product options handlers
    const addProductOption = () => {
        if (productOptions.length < 5) {
            setProductOptions([
                ...productOptions,
                {
                    option_name: "",
                    option_values: [],
                    newValue: "",
                },
            ]);
        }
    };

    const updateProductOptionName = (index, value) => {
        const newOptions = [...productOptions];
        newOptions[index].option_name = value;
        setProductOptions(newOptions);
    };

    const addOptionValue = (index) => {
        const newOptions = [...productOptions];
        const value = newOptions[index].newValue.trim();
        if (
            value !== "" &&
            !newOptions[index].option_values.some((v) => v.name === value)
        ) {
            newOptions[index].option_values.push({
                name: value, // New values won't have IDs initially
                id: null,
            });
            newOptions[index].newValue = "";
        }
        setProductOptions(newOptions);
    };

    const removeOptionValue = (optionIndex, valueIndex) => {
        const newOptions = [...productOptions];
        newOptions[optionIndex].option_values = newOptions[
            optionIndex
        ].option_values.filter((_, i) => i !== valueIndex);
        setProductOptions(newOptions);
    };

    const removeProductOption = (index) => {
        if (productOptions.length > 1) {
            setProductOptions(productOptions.filter((_, i) => i !== index));
        }
    };

    const handleOptionValueKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addOptionValue(index);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewImages((prev) => [...prev, ...newImages]);
    };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setNewVideos((prev) => [...prev, ...newVideos]);
    };

    const removeExistingImage = (imageId, index) => {
        setImagesToDelete([...imagesToDelete, imageId]);
        setProductImages(productImages.filter((_, i) => i !== index));
    };

    const removeExistingVideo = (videoId, index) => {
        setVideosToDelete([...videosToDelete, videoId]);
        setProductVideos(productVideos.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const removeNewVideo = (index) => {
        setNewVideos(newVideos.filter((_, i) => i !== index));
    };

    // Get all images (existing + new)
    const allImages = [...productImages, ...newImages];
    const allVideos = [...productVideos, ...newVideos];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length
        );
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 z-10 px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Edit Product
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    Update your product details
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition p-1 rounded-lg hover:bg-indigo-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Stepper */}
                        <div className="flex items-center justify-between mt-4 overflow-x-auto">
                            {steps.map((stepItem, i) => (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[80px] text-center"
                                >
                                    <div
                                        className={`flex items-center justify-center w-10 h-10 mx-auto rounded-full border-2 ${
                                            step === stepItem.number
                                                ? "bg-white border-white text-indigo-600"
                                                : step > stepItem.number
                                                ? "bg-green-500 border-green-500 text-white"
                                                : "bg-white/20 border-white/30 text-white"
                                        }`}
                                    >
                                        {step > stepItem.number ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <span className="text-sm font-semibold">
                                                {stepItem.icon}
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-xs mt-2 ${
                                            step === stepItem.number
                                                ? "text-white font-medium"
                                                : "text-indigo-100"
                                        }`}
                                    >
                                        {stepItem.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={productName}
                                            onChange={(e) =>
                                                setProductName(e.target.value)
                                            }
                                            placeholder="e.g., Vintage Leather Jacket"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Description *
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={productDescription}
                                            onChange={(e) =>
                                                setProductDescription(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Describe your product in detail including condition, features, and any imperfections..."
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Detailed descriptions attract more
                                            buyers
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Product Details */}
                            {step === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            value={productCategories}
                                            onChange={(e) =>
                                                setProductCategories(
                                                    e.target.value
                                                )
                                            }
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">
                                                Select category
                                            </option>
                                            {list_categories.map((category) => (
                                                <option
                                                    key={category.category_id}
                                                    value={category.category_id}
                                                >
                                                    {category.category_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Condition *
                                        </label>
                                        <select
                                            value={productCondition}
                                            onChange={(e) =>
                                                setProductCondition(
                                                    e.target.value
                                                )
                                            }
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">
                                                Select condition
                                            </option>
                                            {conditionOptions.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        {productCondition && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {
                                                    conditionOptions.find(
                                                        (opt) =>
                                                            opt.value ===
                                                            productCondition
                                                    )?.description
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Price (RM) *
                                        </label>
                                        <input
                                            type="text"
                                            value={productPrice}
                                            onChange={(e) =>
                                                setProductPrice(e.target.value)
                                            }
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity *
                                        </label>
                                        <input
                                            type="text"
                                            value={productQuantity}
                                            onChange={(e) =>
                                                setProductQuantity(
                                                    e.target.value
                                                )
                                            }
                                            min="1"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Brand
                                        </label>
                                        <input
                                            type="text"
                                            value={productBrand}
                                            onChange={(e) =>
                                                setProductBrand(e.target.value)
                                            }
                                            placeholder="e.g., Nike, Apple, IKEA"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Weight (kg)
                                        </label>
                                        <div className="relative">
                                            <Weight
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                size={20}
                                            />
                                            <input
                                                type="text"
                                                value={productWeight}
                                                onChange={(e) =>
                                                    setProductWeight(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="0.5"
                                                step="0.1"
                                                min="0"
                                                className="text-black w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Material
                                        </label>
                                        <input
                                            type="text"
                                            value={productMaterial}
                                            onChange={(e) =>
                                                setProductMaterial(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Cotton, Leather, Plastic"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Manufacturer
                                        </label>
                                        <input
                                            type="text"
                                            value={productManufacturer}
                                            onChange={(e) =>
                                                setProductManufacturer(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g., Malaysia, China"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            value={productStatus}
                                            onChange={(e) =>
                                                setProductStatus(e.target.value)
                                            }
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        >
                                            <option value="available">
                                                Available
                                            </option>
                                            <option value="reserved">
                                                Reserved
                                            </option>
                                            <option value="sold">Sold</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Specifications */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="flex items-start">
                                            <Info
                                                className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                                                size={20}
                                            />
                                            <p className="text-sm text-blue-700">
                                                Add detailed specifications to
                                                help buyers make informed
                                                decisions
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Key Features
                                        </label>
                                        <div className="space-y-2">
                                            {keyFeatures.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="w-6 text-sm text-gray-500 font-medium">
                                                            {index + 1}.
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) =>
                                                                handleFeatureChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={`Feature ${
                                                                index + 1
                                                            }`}
                                                            className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        />
                                                        {keyFeatures.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeFeature(
                                                                        index
                                                                    )
                                                                }
                                                                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                                            >
                                                                <Minus
                                                                    size={20}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        {keyFeatures.length < 10 && (
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="mt-3 flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
                                            >
                                                <Plus
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                Add Another Feature
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            What's Included
                                        </label>
                                        <div className="space-y-2">
                                            {includedItems.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div className="w-6 text-sm text-gray-500">
                                                            •
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={item}
                                                            onChange={(e) =>
                                                                handleIncludedItemChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder={`Included item ${
                                                                index + 1
                                                            }`}
                                                            className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        />
                                                        {includedItems.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeIncludedItem(
                                                                        index
                                                                    )
                                                                }
                                                                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                                            >
                                                                <Minus
                                                                    size={20}
                                                                />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                        {includedItems.length < 10 && (
                                            <button
                                                type="button"
                                                onClick={addIncludedItem}
                                                className="mt-3 flex items-center text-gray-600 hover:text-gray-700 font-medium"
                                            >
                                                <Plus
                                                    size={20}
                                                    className="mr-2"
                                                />
                                                Add Another Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Options */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="flex items-start">
                                            <Sliders
                                                className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                                                size={20}
                                            />
                                            <p className="text-sm text-blue-700">
                                                Add variations like size, color,
                                                or other options for your
                                                product
                                            </p>
                                        </div>
                                    </div>

                                    {productOptions.map(
                                        (option, optionIndex) => (
                                            <div
                                                key={optionIndex}
                                                className="border rounded-lg p-5 bg-gray-50"
                                            >
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-semibold text-gray-800">
                                                        Option {optionIndex + 1}
                                                    </h4>
                                                    {productOptions.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeProductOption(
                                                                    optionIndex
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                        >
                                                            Remove Option
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Option Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            option.option_name
                                                        }
                                                        onChange={(e) =>
                                                            updateProductOptionName(
                                                                optionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="e.g., Size, Color, Material"
                                                        className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Option Values
                                                    </label>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {option.option_values.map(
                                                            (
                                                                valueObj,
                                                                valueIndex
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        valueIndex
                                                                    }
                                                                    className="inline-flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                                                                >
                                                                    {
                                                                        valueObj.name
                                                                    }
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeOptionValue(
                                                                                optionIndex,
                                                                                valueIndex
                                                                            )
                                                                        }
                                                                        className="ml-2 text-indigo-500 hover:text-indigo-700"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </span>
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={
                                                                option.newValue
                                                            }
                                                            onChange={(e) => {
                                                                const newOptions =
                                                                    [
                                                                        ...productOptions,
                                                                    ];
                                                                newOptions[
                                                                    optionIndex
                                                                ].newValue =
                                                                    e.target.value;
                                                                setProductOptions(
                                                                    newOptions
                                                                );
                                                            }}
                                                            onKeyDown={(e) =>
                                                                handleOptionValueKeyDown(
                                                                    e,
                                                                    optionIndex
                                                                )
                                                            }
                                                            placeholder="Add value and press Enter"
                                                            className="text-black flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addOptionValue(
                                                                    optionIndex
                                                                )
                                                            }
                                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                                        >
                                                            Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {productOptions.length < 5 && (
                                        <button
                                            type="button"
                                            onClick={addProductOption}
                                            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-400 flex items-center justify-center"
                                        >
                                            <Plus size={20} className="mr-2" />
                                            Add Another Option
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Step 5: Media */}
                            {step === 5 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                        <div className="flex items-start">
                                            <Camera
                                                className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
                                                size={20}
                                            />
                                            <div>
                                                <p className="text-sm text-blue-700 font-medium mb-1">
                                                    Photo Guidelines
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                    Upload clear photos from all
                                                    angles. Include any
                                                    imperfections. First image
                                                    will be the main thumbnail.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Product Images
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                            {allImages.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={
                                                            img.file
                                                                ? img.preview
                                                                : `${BASEURL}${img.image_path}`
                                                        }
                                                        alt=""
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (img.file) {
                                                                removeNewImage(
                                                                    index -
                                                                        productImages.length
                                                                );
                                                            } else {
                                                                removeExistingImage(
                                                                    img.id,
                                                                    index
                                                                );
                                                            }
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    {img.file && (
                                                        <span className="absolute top-1 left-1 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                                            New
                                                        </span>
                                                    )}
                                                    {index === 0 && (
                                                        <span className="absolute bottom-1 left-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                            Main
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {allImages.length < 12 && (
                                                <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer p-4">
                                                    <Camera
                                                        className="text-gray-400 mb-2"
                                                        size={24}
                                                    />
                                                    <span className="text-sm text-gray-600 text-center">
                                                        Add Photos
                                                    </span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {allImages.length}/12 photos • PNG,
                                            JPG up to 10MB each
                                        </p>
                                    </div>

                                    {/* Video Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Product Video
                                        </label>
                                        {allVideos.length > 0 ? (
                                            <div className="relative">
                                                <video
                                                    src={
                                                        allVideos[0].file
                                                            ? allVideos[0]
                                                                  .preview
                                                            : `${BASEURL}${allVideos[0].video_path}`
                                                    }
                                                    className="w-full rounded-lg border"
                                                    controls
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (allVideos[0].file) {
                                                            removeNewVideo(0);
                                                        } else {
                                                            removeExistingVideo(
                                                                allVideos[0].id,
                                                                0
                                                            );
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                                >
                                                    <X size={16} />
                                                </button>
                                                {allVideos[0].file && (
                                                    <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer p-6">
                                                <Video
                                                    className="text-gray-400 mb-2"
                                                    size={32}
                                                />
                                                <span className="text-sm text-gray-600 mb-1">
                                                    Add Video
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    MP4 up to 100MB
                                                </span>
                                                <input
                                                    type="file"
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Review */}
                            {step === 6 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                        Review Your Changes
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">
                                                    Basic Information
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Name:
                                                        </span>{" "}
                                                        {productName}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Category:
                                                        </span>{" "}
                                                        {list_categories.find(
                                                            (cat) =>
                                                                cat.category_id ==
                                                                productCategories
                                                        )?.category_name ||
                                                            "Not selected"}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Condition:
                                                        </span>{" "}
                                                        {conditionOptions.find(
                                                            (opt) =>
                                                                opt.value ===
                                                                productCondition
                                                        )?.label ||
                                                            "Not selected"}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Brand:
                                                        </span>{" "}
                                                        {productBrand ||
                                                            "Not specified"}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Manufacturer:
                                                        </span>{" "}
                                                        {productManufacturer ||
                                                            "Not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-700 mb-2">
                                                    Pricing & Stock
                                                </h4>
                                                <div className="space-y-2 text-sm">
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Price:
                                                        </span>{" "}
                                                        RM {productPrice}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Quantity:
                                                        </span>{" "}
                                                        {productQuantity}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Status:
                                                        </span>{" "}
                                                        {productStatus}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {keyFeatures.some(
                                                (f) => f.trim() !== ""
                                            ) && (
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">
                                                        Key Features
                                                    </h4>
                                                    <ul className="list-disc list-inside text-sm space-y-1">
                                                        {keyFeatures
                                                            .filter(
                                                                (f) =>
                                                                    f.trim() !==
                                                                    ""
                                                            )
                                                            .map(
                                                                (
                                                                    feature,
                                                                    i
                                                                ) => (
                                                                    <li
                                                                        key={i}
                                                                        className="text-black"
                                                                    >
                                                                        {
                                                                            feature
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </div>
                                            )}

                                            {allImages.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">
                                                        Media
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        {allImages
                                                            .slice(0, 3)
                                                            .map((img, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={
                                                                        img.file
                                                                            ? img.preview
                                                                            : `${BASEURL}${img.image_path}`
                                                                    }
                                                                    alt=""
                                                                    className="w-16 h-16 object-cover rounded border"
                                                                />
                                                            ))}
                                                        {allImages.length >
                                                            3 && (
                                                            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                                                +
                                                                {allImages.length -
                                                                    3}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                        <div className="flex items-start">
                                            <CheckCircle
                                                className="text-green-500 mt-0.5 mr-3 flex-shrink-0"
                                                size={20}
                                            />
                                            <p className="text-sm text-green-700">
                                                Review all changes and click
                                                "Update Product" to save your
                                                modifications.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Navigation */}
                    <div className="sticky bottom-0 bg-white border-t p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                {step > 1 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStep((prev) => prev - 1)
                                        }
                                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                                    >
                                        <ChevronLeft
                                            size={20}
                                            className="inline mr-2"
                                        />
                                        Back
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {step < 6 ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStep((prev) => prev + 1)
                                        }
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                    >
                                        Continue
                                        <ChevronRight
                                            size={20}
                                            className="inline ml-2"
                                        />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Product"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isImagePreviewOpen && allImages.length > 0 && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={() => setIsImagePreviewOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative">
                            <img
                                src={
                                    allImages[currentImageIndex].file
                                        ? allImages[currentImageIndex].preview
                                        : `${BASEURL}${allImages[currentImageIndex].image_path}`
                                }
                                alt=""
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />

                            {allImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-4 text-center text-white">
                            Image {currentImageIndex + 1} of {allImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
