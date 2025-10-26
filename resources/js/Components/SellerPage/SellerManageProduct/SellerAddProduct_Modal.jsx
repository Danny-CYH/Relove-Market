import React, { useEffect, useState, useRef } from "react";
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

export function SellerAddProduct_Modal({
    onAdd,
    list_categories,
    onClose,
    errorField,
    onErrorFieldHandled,
}) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Product fields
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productStatus, setProductStatus] = useState("available");
    const [productCondition, setProductCondition] = useState("");
    const [productCategories, setProductCategories] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productMaterial, setProductMaterial] = useState("");
    const [productManufacturer, setProductManufacturer] = useState("");
    const [productWeight, setProductWeight] = useState("");
    const [productOptions, setProductOptions] = useState([
        {
            option_name: "",
            option_values: [],
            newValue: "",
        },
    ]);

    const [productVariants, setProductVariants] = useState([]);

    const [productImages, setProductImages] = useState([]);
    const [productVideos, setProductVideos] = useState([]);

    // Features and specifications
    const [keyFeatures, setKeyFeatures] = useState([""]);
    const [includedItems, setIncludedItems] = useState([""]);

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // Refs for error field focusing
    const productNameRef = useRef(null);
    const productDescriptionRef = useRef(null);
    const productPriceRef = useRef(null);
    const productQuantityRef = useRef(null);
    const productConditionRef = useRef(null);
    const productCategoriesRef = useRef(null);
    const productBrandRef = useRef(null);
    const productMaterialRef = useRef(null);
    const productManufacturerRef = useRef(null);
    const productWeightRef = useRef(null);
    const keyFeaturesRefs = useRef([]);
    const includedItemsRefs = useRef([]);

    // Map error field names to refs
    const fieldRefs = {
        product_name: productNameRef,
        product_description: productDescriptionRef,
        product_price: productPriceRef,
        product_quantity: productQuantityRef,
        product_condition: productConditionRef,
        category_id: productCategoriesRef,
        product_brand: productBrandRef,
        product_material: productMaterialRef,
        product_manufacturer: productManufacturerRef,
        product_weight: productWeightRef,
    };

    useEffect(() => {
        if (errorField) {
            setTimeout(() => {
                const ref = fieldRefs[errorField];
                if (ref && ref.current) {
                    ref.current.focus();
                    ref.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }

                if (errorField.startsWith("key_features")) {
                    const index = parseInt(errorField.match(/\[(\d+)\]/)[1]);
                    if (keyFeaturesRefs.current[index]) {
                        keyFeaturesRefs.current[index].focus();
                        keyFeaturesRefs.current[index].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
                } else if (errorField.startsWith("included_items")) {
                    const index = parseInt(errorField.match(/\[(\d+)\]/)[1]);
                    if (includedItemsRefs.current[index]) {
                        includedItemsRefs.current[index].focus();
                        includedItemsRefs.current[index].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        });
                    }
                }

                onErrorFieldHandled();
            }, 100);
        }
    }, [errorField, onErrorFieldHandled]);

    // Add this function to generate variants when options change
    const generateVariants = (options) => {
        if (options.length === 0) return [];

        // Get all option values grouped by option name
        const optionGroups = options
            .filter((opt) => opt.option_name && opt.option_values.length > 0)
            .map((opt) => ({
                name: opt.option_name,
                values: opt.option_values.map((v) => v.value),
            }));

        if (optionGroups.length === 0) return [];

        // Generate all combinations
        const generateCombinations = (groups, index = 0, current = {}) => {
            if (index === groups.length) {
                return [current];
            }

            const results = [];
            const currentGroup = groups[index];

            for (const value of currentGroup.values) {
                const combination = {
                    ...current,
                    [currentGroup.name]: value,
                };
                results.push(
                    ...generateCombinations(groups, index + 1, combination)
                );
            }

            return results;
        };

        const combinations = generateCombinations(optionGroups);

        // Map to variant format and preserve existing quantities
        return combinations.map((combination) => {
            const variantKey = Object.values(combination).join("|");
            const existingVariant = productVariants.find(
                (v) => v.variant_key === variantKey
            );

            return {
                variant_key: variantKey,
                combination: combination,
                quantity: existingVariant ? existingVariant.quantity : "0",
                price: existingVariant
                    ? existingVariant.price
                    : productPrice || "0",
            };
        });
    };

    // Update this useEffect to generate variants when options change
    useEffect(() => {
        const newVariants = generateVariants(productOptions);
        setProductVariants(newVariants);
    }, [productOptions]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setIsSubmitting(true);

            const formData = new FormData();

            // Basic product info (without quantity)
            formData.append("product_name", productName);
            formData.append("product_description", productDescription);
            formData.append("product_price", productPrice);
            // Remove: formData.append("product_quantity", productQuantity);
            formData.append("product_status", productStatus);
            formData.append("product_condition", productCondition);
            formData.append("category_id", productCategories);
            formData.append("product_brand", productBrand);
            formData.append("product_material", productMaterial);
            formData.append("product_manufacturer", productManufacturer);
            formData.append("product_weight", productWeight);

            // Add key features
            keyFeatures.forEach((feature, index) => {
                if (feature.trim() !== "") {
                    formData.append(`key_features[${index}]`, feature);
                }
            });

            // Add included items
            includedItems.forEach((item, index) => {
                if (item.trim() !== "") {
                    formData.append(`included_items[${index}]`, item);
                }
            });

            if (productVariants.length > 0) {
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
                });
            }

            // Calculate total quantity from variants
            const totalQuantity = productVariants.reduce((total, variant) => {
                return total + parseInt(variant.quantity || "0");
            }, 0);

            formData.append("product_quantity", totalQuantity);

            // Append images
            productImages.forEach((img) => {
                if (img.file) {
                    formData.append("product_image[]", img.file);
                }
            });

            // Append videos
            productVideos.forEach((vid) => {
                if (vid.file) {
                    formData.append("product_video[]", vid.file);
                }
            });

            await onAdd(e, formData);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const conditionOptions = [
        {
            value: "new",
            label: "Brand New",
            description: "Never used, with original tags and packaging",
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
            !newOptions[index].option_values.some((v) => v.value === value)
        ) {
            newOptions[index].option_values.push({
                value: value,
            });
            newOptions[index].newValue = "";
        }
        setProductOptions(newOptions);
    };

    const updateVariantQuantity = (variantKey, quantity) => {
        setProductVariants((prev) =>
            prev.map((variant) =>
                variant.variant_key === variantKey
                    ? { ...variant, quantity }
                    : variant
            )
        );
    };

    const updateVariantPrice = (variantKey, price) => {
        setProductVariants((prev) =>
            prev.map((variant) =>
                variant.variant_key === variantKey
                    ? { ...variant, price }
                    : variant
            )
        );
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
        setProductImages((prev) => [...prev, ...newImages]);
    };
    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);

        // Check if adding these videos would exceed the limit
        if (productVideos.length + files.length > 5) {
            alert("Maximum 5 videos allowed");
            return;
        }

        const newVideos = files
            .map((file) => {
                // Check file size (50MB limit)
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
            .filter((video) => video !== null); // Remove null entries (failed validations)

        setProductVideos((prev) => [...prev, ...newVideos]);
    };

    // Add function to preview video
    const previewVideo = (index) => {
        setCurrentVideoIndex(index);
        setIsVideoPreviewOpen(true);
    };

    const removeImage = (index) => {
        setProductImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index) => {
        setProductVideos((prev) => prev.filter((_, i) => i !== index));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex(
            (prev) => (prev - 1 + productImages.length) % productImages.length
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
                                    Add New Product
                                </h2>
                                <p className="text-indigo-100 text-sm mt-1">
                                    Sell your preloved items easily
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
                                            ref={productNameRef}
                                            type="text"
                                            value={productName}
                                            onChange={(e) =>
                                                setProductName(e.target.value)
                                            }
                                            placeholder="e.g., Vintage Leather Jacket"
                                            className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Be specific and descriptive
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Description *
                                        </label>
                                        <textarea
                                            ref={productDescriptionRef}
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
                                            ref={productCategoriesRef}
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
                                            ref={productConditionRef}
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
                                            ref={productPriceRef}
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
                                            ref={productBrandRef}
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
                                                ref={productWeightRef}
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
                                            ref={productMaterialRef}
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
                                            ref={productManufacturerRef}
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
                                            Key Features *
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
                                                            ref={(el) =>
                                                                (keyFeaturesRefs.current[
                                                                    index
                                                                ] = el)
                                                            }
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
                                                            ref={(el) =>
                                                                (includedItemsRefs.current[
                                                                    index
                                                                ] = el)
                                                            }
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
                                                    Product Variants System
                                                </p>
                                                <p className="text-xs text-blue-600">
                                                    Add options like Color,
                                                    Size, etc. The system will
                                                    automatically generate all
                                                    combinations. Set individual
                                                    quantities and prices for
                                                    each variant.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options Configuration */}
                                    <div className="space-y-4">
                                        {productOptions.map(
                                            (option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className="border rounded-lg p-5 bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-semibold text-gray-800">
                                                            Option{" "}
                                                            {optionIndex + 1}
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
                                                            Option Name *
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                option.option_name
                                                            }
                                                            onChange={(e) =>
                                                                updateProductOptionName(
                                                                    optionIndex,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="e.g., Size, Color, Material"
                                                            className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                            required
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Option Values *
                                                        </label>

                                                        {/* Display existing option values */}
                                                        <div className="space-y-2 mb-3">
                                                            {option.option_values.map(
                                                                (
                                                                    value,
                                                                    valueIndex
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            valueIndex
                                                                        }
                                                                        className="flex items-center gap-2 bg-white p-3 rounded-lg border"
                                                                    >
                                                                        <div className="flex-1">
                                                                            <span className="font-medium text-gray-700">
                                                                                {
                                                                                    value.value
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeOptionValue(
                                                                                    optionIndex,
                                                                                    valueIndex
                                                                                )
                                                                            }
                                                                            className="text-red-500 hover:text-red-700 p-1"
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

                                                        {/* Add new option value */}
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={
                                                                    option.newValue
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
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
                                                                onKeyDown={(
                                                                    e
                                                                ) =>
                                                                    handleOptionValueKeyDown(
                                                                        e,
                                                                        optionIndex
                                                                    )
                                                                }
                                                                placeholder="Option value (e.g., Small, Red)"
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
                                    </div>

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

                                    {/* Variants Display */}
                                    {productVariants.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                Product Variants (
                                                {productVariants.length}{" "}
                                                combinations)
                                            </h3>

                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {productVariants.map(
                                                    (variant, index) => (
                                                        <div
                                                            key={
                                                                variant.variant_key
                                                            }
                                                            className="border rounded-lg p-4 bg-white"
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div>
                                                                    <span className="font-medium text-gray-700">
                                                                        Variant{" "}
                                                                        {index +
                                                                            1}
                                                                        :
                                                                    </span>
                                                                    <span className="ml-2 text-gray-600">
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
                                                                    </span>
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    SKU:{" "}
                                                                    {
                                                                        variant.variant_key
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Quantity
                                                                        *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            variant.quantity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateVariantQuantity(
                                                                                variant.variant_key,
                                                                                e
                                                                                    .target
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
                                                                        Price
                                                                        (RM) *
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            variant.price
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateVariantPrice(
                                                                                variant.variant_key,
                                                                                e
                                                                                    .target
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

                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600">
                                                    Total Stock:{" "}
                                                    {productVariants.reduce(
                                                        (sum, variant) =>
                                                            sum +
                                                            parseInt(
                                                                variant.quantity ||
                                                                    0
                                                            ),
                                                        0
                                                    )}{" "}
                                                    units
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 5: Media */}
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
                                            Product Images *
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                            {productImages.map((img, index) => (
                                                <div
                                                    key={index}
                                                    className="relative group"
                                                >
                                                    <img
                                                        src={img.preview}
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
                                                        onClick={() =>
                                                            removeImage(index)
                                                        }
                                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute top-1 left-1 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                                            Main
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                            {productImages.length < 12 && (
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
                                            {productImages.length}/12 photos
                                            uploaded • PNG, JPG up to 10MB each
                                        </p>
                                    </div>

                                    {/* Video Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Product Videos (Optional)
                                        </label>

                                        {/* Video Upload Area */}
                                        {productVideos.length === 0 ? (
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
                                                    {productVideos.map(
                                                        (video, index) => (
                                                            <div
                                                                key={index}
                                                                className="relative group border rounded-lg overflow-hidden bg-black"
                                                            >
                                                                <video
                                                                    src={
                                                                        video.preview
                                                                    }
                                                                    className="w-full h-40 object-cover"
                                                                    controls
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeVideo(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                                                                >
                                                                    <X
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                                    Video{" "}
                                                                    {index + 1}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                {/* Add More Videos Button */}
                                                {productVideos.length < 5 && (
                                                    <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 cursor-pointer p-4">
                                                        <Plus
                                                            size={20}
                                                            className="text-gray-400 mr-2"
                                                        />
                                                        <span className="text-sm text-gray-600">
                                                            Add More Videos (
                                                            {
                                                                productVideos.length
                                                            }
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
                                            {productVideos.length}/5 videos
                                            allowed • Up to 50MB each
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Review */}
                            {step === 6 && (
                                <div className="space-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-3">
                                        Review Your Product
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

                                            {productImages.length > 0 && (
                                                <div>
                                                    <h4 className="font-medium text-gray-700 mb-2">
                                                        Media
                                                    </h4>
                                                    <div className="flex gap-2">
                                                        {productImages
                                                            .slice(0, 3)
                                                            .map((img, i) => (
                                                                <img
                                                                    key={i}
                                                                    src={
                                                                        img.preview
                                                                    }
                                                                    alt=""
                                                                    className="w-16 h-16 object-cover rounded border"
                                                                />
                                                            ))}
                                                        {productImages.length >
                                                            3 && (
                                                            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                                                +
                                                                {productImages.length -
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
                                                Your product is ready to be
                                                listed! Review all information
                                                and click "Publish Product" to
                                                make it live.
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
                                                Publishing...
                                            </>
                                        ) : (
                                            "Publish Product"
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isImagePreviewOpen && productImages.length > 0 && (
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
                                src={productImages[currentImageIndex].preview}
                                alt=""
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />

                            {productImages.length > 1 && (
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
                            Image {currentImageIndex + 1} of{" "}
                            {productImages.length}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {isVideoPreviewOpen && productVideos.length > 0 && (
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
                                src={productVideos[0].preview}
                                className="w-full h-auto max-h-[80vh] rounded-lg"
                                controls
                                autoPlay
                            />
                        </div>

                        <div className="mt-4 text-center text-white">
                            Video 1 of {productVideos.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
