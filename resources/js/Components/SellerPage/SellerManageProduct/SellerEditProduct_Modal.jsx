import React, { useEffect, useState } from "react";
import {
    X,
    Weight,
    Info,
    Plus,
    Minus,
    Sliders,
    Camera,
    Video,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Trash2,
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

    // Product fields
    const [productName, setProductName] = useState(product?.product_name || "");
    const [productDescription, setProductDescription] = useState(
        product?.product_description || ""
    );
    const [productPrice, setProductPrice] = useState(
        product?.product_price || ""
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
    const [productMaterial, setProductMaterial] = useState(
        product?.product_material || ""
    );
    const [productManufacturer, setProductManufacturer] = useState(
        product?.product_manufacturer || ""
    );

    // Only variants state - removed productOptions
    const [productVariants, setProductVariants] = useState([]);

    // Media states
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // Condition options and steps (keep these)
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
        { number: 4, title: "Variants", icon: "⚙️" }, // Changed from "Options" to "Variants"
        { number: 5, title: "Media", icon: "🖼️" },
        { number: 6, title: "Review", icon: "👀" },
    ];

    // Initialize form with product data
    useEffect(() => {
        if (product) {
            setProductName(product.product_name || "");
            setProductDescription(product.product_description || "");
            setProductPrice(product.product_price || "");
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

            // Handle product variants - this is the main data now
            if (product.product_variant && product.product_variant.length > 0) {
                setProductVariants(
                    product.product_variant.map((variant) => ({
                        variant_id: variant.variant_id,
                        variant_key: variant.variant_key,
                        combination:
                            typeof variant.variant_combination === "string"
                                ? JSON.parse(variant.variant_combination)
                                : variant.variant_combination,
                        quantity: variant.quantity?.toString() || "0",
                        price:
                            variant.price?.toString() ||
                            product.product_price ||
                            "0",
                    }))
                );
            } else {
                // If no variants exist, create a default one
                setProductVariants([
                    {
                        variant_key: "default",
                        combination: {},
                        quantity: product.product_quantity?.toString() || "0",
                        price: product.product_price || "0",
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

            // Add product variants - this is the main data now
            productVariants.forEach((variant, index) => {
                formData.append(
                    `variants[${index}][combination]`,
                    JSON.stringify(variant.combination)
                );
                formData.append(
                    `variants[${index}][quantity]`,
                    variant.quantity || "0"
                );
                formData.append(
                    `variants[${index}][price]`,
                    variant.price || productPrice
                );
                formData.append(
                    `variants[${index}][variant_key]`,
                    variant.variant_key
                );

                // Include variant_id for existing variants
                if (variant.variant_id) {
                    formData.append(
                        `variants[${index}][variant_id]`,
                        variant.variant_id
                    );
                }
            });

            // Calculate total quantity from variants
            const totalQuantity = productVariants.reduce((total, variant) => {
                return total + parseInt(variant.quantity || "0");
            }, 0);

            formData.append("product_quantity", totalQuantity);

            // Media handling (keep as is)
            newImages.forEach((img) => {
                if (img.file) {
                    formData.append("new_product_images[]", img.file);
                }
            });

            newVideos.forEach((vid) => {
                if (vid.file) {
                    formData.append("new_product_videos[]", vid.file);
                }
            });

            imagesToDelete.forEach((imgId, index) => {
                formData.append(`images_to_delete[${index}]`, imgId);
            });

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

    // Variant management functions
    const addVariant = () => {
        if (productVariants.length < 20) {
            // Reasonable limit for variants
            setProductVariants([
                ...productVariants,
                {
                    variant_key: `variant_${Date.now()}`,
                    combination: {},
                    quantity: "0",
                    price: productPrice || "0",
                },
            ]);
        }
    };

    const updateVariantCombination = (variantIndex, key, value) => {
        setProductVariants((prev) =>
            prev.map((variant, index) =>
                index === variantIndex
                    ? {
                          ...variant,
                          combination: { ...variant.combination, [key]: value },
                          variant_key:
                              Object.values({
                                  ...variant.combination,
                                  [key]: value,
                              }).join("|") || `variant_${Date.now()}`,
                      }
                    : variant
            )
        );
    };

    const removeVariantCombinationKey = (variantIndex, key) => {
        setProductVariants((prev) =>
            prev.map((variant, index) => {
                if (index === variantIndex) {
                    const newCombination = { ...variant.combination };
                    delete newCombination[key];
                    return {
                        ...variant,
                        combination: newCombination,
                        variant_key:
                            Object.values(newCombination).join("|") ||
                            `variant_${Date.now()}`,
                    };
                }
                return variant;
            })
        );
    };

    const addCombinationKey = (variantIndex, newKey) => {
        if (newKey.trim()) {
            setProductVariants((prev) =>
                prev.map((variant, index) =>
                    index === variantIndex
                        ? {
                              ...variant,
                              combination: {
                                  ...variant.combination,
                                  [newKey.trim()]: "",
                              },
                              variant_key:
                                  Object.values({
                                      ...variant.combination,
                                      [newKey.trim()]: "",
                                  }).join("|") || `variant_${Date.now()}`,
                          }
                        : variant
                )
            );
        }
    };

    const updateVariantQuantity = (variantIndex, quantity) => {
        setProductVariants((prev) =>
            prev.map((variant, index) =>
                index === variantIndex ? { ...variant, quantity } : variant
            )
        );
    };

    const updateVariantPrice = (variantIndex, price) => {
        setProductVariants((prev) =>
            prev.map((variant, index) =>
                index === variantIndex ? { ...variant, price } : variant
            )
        );
    };

    const removeVariant = (variantIndex) => {
        if (productVariants.length > 1) {
            setProductVariants(
                productVariants.filter((_, i) => i !== variantIndex)
            );
        }
    };

    // Keep all your existing media and feature functions (they remain the same)
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

    // Media handlers (keep as is)
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
        if (allVideos.length + files.length > 5) {
            alert("Maximum 5 videos allowed");
            return;
        }
        const newVideos = files
            .map((file) => {
                if (file.size > 50 * 1024 * 1024) {
                    alert(
                        `File ${file.name} is too large. Maximum size is 50MB.`
                    );
                    return null;
                }
                return {
                    file,
                    preview: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size,
                };
            })
            .filter((video) => video !== null);
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

    const previewVideo = (index) => {
        setCurrentVideoIndex(index);
        setIsVideoPreviewOpen(true);
    };

    // Get all images and videos
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

    const nextVideo = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % allVideos.length);
    };

    const prevVideo = () => {
        setCurrentVideoIndex(
            (prev) => (prev - 1 + allVideos.length) % allVideos.length
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
                                            <div>
                                                <p className="text-sm text-blue-700 font-medium mb-1">
                                                    Product Variants
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                    Manage your product variants
                                                    directly. Each variant can
                                                    have different combinations,
                                                    quantities, and prices.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {productVariants.map(
                                            (variant, variantIndex) => (
                                                <div
                                                    key={variantIndex}
                                                    className="border rounded-lg p-5 bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-semibold text-gray-800">
                                                            Variant{" "}
                                                            {variantIndex + 1}
                                                        </h4>
                                                        {productVariants.length >
                                                            1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeVariant(
                                                                        variantIndex
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                            >
                                                                Remove Variant
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Variant Combinations */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Variant Combinations
                                                        </label>
                                                        <div className="space-y-2">
                                                            {Object.entries(
                                                                variant.combination
                                                            ).map(
                                                                (
                                                                    [
                                                                        key,
                                                                        value,
                                                                    ],
                                                                    comboIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            comboIndex
                                                                        }
                                                                        className="flex items-center gap-2"
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                key
                                                                            }
                                                                            disabled
                                                                            className="text-black w-32 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                                            placeholder="Attribute"
                                                                        />
                                                                        <span className="text-gray-500">
                                                                            :
                                                                        </span>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateVariantCombination(
                                                                                    variantIndex,
                                                                                    key,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                            placeholder="Value"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeVariantCombinationKey(
                                                                                    variantIndex,
                                                                                    key
                                                                                )
                                                                            }
                                                                            className="text-red-500 hover:text-red-700 p-2"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>

                                                        {/* Add new combination key */}
                                                        <div className="mt-3 flex gap-2">
                                                            <input
                                                                type="text"
                                                                placeholder="New attribute (e.g., Color, Size)"
                                                                className="text-black flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                onKeyDown={(
                                                                    e
                                                                ) => {
                                                                    if (
                                                                        e.key ===
                                                                        "Enter"
                                                                    ) {
                                                                        addCombinationKey(
                                                                            variantIndex,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                        e.target.value =
                                                                            "";
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    const input =
                                                                        e.target
                                                                            .previousElementSibling;
                                                                    addCombinationKey(
                                                                        variantIndex,
                                                                        input.value
                                                                    );
                                                                    input.value =
                                                                        "";
                                                                }}
                                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                                            >
                                                                Add Attribute
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Quantity and Price */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Quantity *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    variant.quantity
                                                                }
                                                                onChange={(e) =>
                                                                    updateVariantQuantity(
                                                                        variantIndex,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                placeholder="0"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Price (RM) *
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={
                                                                    variant.price
                                                                }
                                                                onChange={(e) =>
                                                                    updateVariantPrice(
                                                                        variantIndex,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                placeholder="0.00"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {productVariants.length < 20 && (
                                        <button
                                            type="button"
                                            onClick={addVariant}
                                            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-400 flex items-center justify-center"
                                        >
                                            <Plus size={20} className="mr-2" />
                                            Add Another Variant
                                        </button>
                                    )}

                                    {/* Total Stock Summary */}
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            Total Stock:{" "}
                                            {productVariants.reduce(
                                                (sum, variant) =>
                                                    sum +
                                                    parseInt(
                                                        variant.quantity || 0
                                                    ),
                                                0
                                            )}{" "}
                                            units across{" "}
                                            {productVariants.length} variants
                                        </p>
                                    </div>
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
                                                        className="w-full h-24 object-cover rounded-lg border cursor-pointer"
                                                        onClick={() => {
                                                            setCurrentImageIndex(
                                                                index
                                                            );
                                                            setIsImagePreviewOpen(
                                                                true
                                                            );
                                                        }}
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

                                    {/* Video Upload - UPDATED WITH PREVIEW SUPPORT */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Product Videos (Optional)
                                        </label>

                                        {/* Video Upload Area */}
                                        {allVideos.length === 0 ? (
                                            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer p-6">
                                                <Video
                                                    className="text-gray-400 mb-2"
                                                    size={32}
                                                />
                                                <span className="text-sm text-gray-600 mb-1">
                                                    Add Videos
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    MP4, MOV, AVI, WMV, MKV up
                                                    to 50MB each
                                                </span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        ) : (
                                            <div className="space-y-4">
                                                {/* Video Grid */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {allVideos.map(
                                                        (video, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group border rounded-lg overflow-hidden bg-black"
                                                            >
                                                                <video
                                                                    src={
                                                                        video.file
                                                                            ? video.preview
                                                                            : `${BASEURL}${video.video_path}`
                                                                    }
                                                                    className="w-full h-40 object-cover cursor-pointer"
                                                                    onClick={() =>
                                                                        previewVideo(
                                                                            index
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        if (
                                                                            video.file
                                                                        ) {
                                                                            removeNewVideo(
                                                                                index -
                                                                                    productVideos.length
                                                                            );
                                                                        } else {
                                                                            removeExistingVideo(
                                                                                video.id,
                                                                                index
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                                >
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                                {video.file && (
                                                                    <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                                                        New
                                                                    </span>
                                                                )}
                                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                                    Video{" "}
                                                                    {index + 1}
                                                                </div>
                                                                {/* Play button overlay */}
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                                    <div className="bg-white/20 rounded-full p-3">
                                                                        <Video
                                                                            className="text-white"
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                {/* Add More Videos Button */}
                                                {allVideos.length < 5 && (
                                                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer p-4">
                                                        <Plus
                                                            size={20}
                                                            className="text-gray-400 mr-2"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Add More Videos (
                                                            {allVideos.length}
                                                            /5)
                                                        </span>
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="video/*"
                                                            onChange={
                                                                handleVideoChange
                                                            }
                                                            className="hidden"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-xs text-gray-500 mt-2">
                                            {allVideos.length}/5 videos allowed
                                            • Up to 50MB each
                                        </p>
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
                                                            Base Price:
                                                        </span>{" "}
                                                        RM {productPrice}
                                                    </p>
                                                    <p className="text-black">
                                                        <span className="text-gray-500">
                                                            Total Quantity:
                                                        </span>{" "}
                                                        {productVariants.reduce(
                                                            (total, variant) =>
                                                                total +
                                                                parseInt(
                                                                    variant.quantity ||
                                                                        "0"
                                                                ),
                                                            0
                                                        )}
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
                                            {/* Product Variants Summary */}
                                            {productVariants.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">
                                                        Product Variants (
                                                        {productVariants.length}
                                                        )
                                                    </h4>
                                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                                        {productVariants
                                                            .slice(0, 5)
                                                            .map(
                                                                (
                                                                    variant,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border rounded-lg p-3 bg-gray-50"
                                                                    >
                                                                        <p className="font-medium text-sm text-gray-800 mb-1">
                                                                            {Object.entries(
                                                                                variant.combination
                                                                            )
                                                                                .map(
                                                                                    ([
                                                                                        key,
                                                                                        value,
                                                                                    ]) =>
                                                                                        `${key}: ${value}`
                                                                                )
                                                                                .join(
                                                                                    ", "
                                                                                )}
                                                                        </p>
                                                                        <div className="flex justify-between text-xs">
                                                                            <span>
                                                                                Qty:{" "}
                                                                                {
                                                                                    variant.quantity
                                                                                }
                                                                            </span>
                                                                            <span>
                                                                                Price:
                                                                                RM{" "}
                                                                                {
                                                                                    variant.price
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        {productVariants.length >
                                                            5 && (
                                                            <p className="text-xs text-gray-500 text-center">
                                                                +
                                                                {productVariants.length -
                                                                    5}{" "}
                                                                more variants
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Rest of review sections */}
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

            {/* Video Preview Modal - NEW */}
            {isVideoPreviewOpen && allVideos.length > 0 && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 p-4">
                    <div className="relative w-full max-w-4xl">
                        <button
                            onClick={() => setIsVideoPreviewOpen(false)}
                            className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                        >
                            <X size={24} />
                        </button>

                        <div className="relative">
                            <video
                                src={
                                    allVideos[currentVideoIndex].file
                                        ? allVideos[currentVideoIndex].preview
                                        : `${BASEURL}${allVideos[currentVideoIndex].video_path}`
                                }
                                className="w-full h-auto max-h-[80vh] rounded-lg"
                                controls
                                autoPlay
                            />

                            {allVideos.length > 1 && (
                                <>
                                    <button
                                        onClick={prevVideo}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextVideo}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="mt-4 text-center text-white">
                            Video {currentVideoIndex + 1} of {allVideos.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
