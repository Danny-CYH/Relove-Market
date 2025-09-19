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
} from "lucide-react";

export function SellerAddProduct_Modal({
    onAdd,
    list_categories,
    onClose,
    errorField,
    onErrorFieldHandled,
}) {
    const [step, setStep] = useState(1);

    // Product fields
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productQuantity, setProductQuantity] = useState("1");
    const [productStatus, setProductStatus] = useState("available");
    const [productCondition, setProductCondition] = useState("excellent");
    const [productCategories, setProductCategories] = useState("");
    const [productBrand, setProductBrand] = useState("");
    const [productWeight, setProductWeight] = useState("");
    const [productOptions, setProductOptions] = useState([
        {
            option_name: "",
            option_values: [],
            newValue: "",
        },
    ]);

    const [productImages, setProductImages] = useState([]);
    const [productVideos, setProductVideos] = useState([]);

    // Features and specifications
    const [keyFeatures, setKeyFeatures] = useState([""]);
    const [includedItems, setIncludedItems] = useState([""]);
    const [productMaterial, setProductMaterial] = useState("");
    const [productManufacturer, setProductManufacturer] = useState("");

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

    // Refs for error field focusing
    const productNameRef = useRef(null);
    const productDescriptionRef = useRef(null);
    const productPriceRef = useRef(null);
    const productQuantityRef = useRef(null);
    const productConditionRef = useRef(null);
    const productCategoriesRef = useRef(null);
    const productBrandRef = useRef(null);
    const productSizeRef = useRef(null);
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
        product_size: productSizeRef,
        product_material: productMaterialRef,
        product_manufacturer: productManufacturerRef,
        product_weight: productWeightRef,
    };

    useEffect(() => {
        if (errorField) {
            // Small delay to ensure the modal is fully rendered
            setTimeout(() => {
                const ref = fieldRefs[errorField];
                if (ref && ref.current) {
                    ref.current.focus();
                    ref.current.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }

                // Handle array fields (key_features, included_items)
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

                onErrorFieldHandled(); // Reset the error field
            }, 5000);
        }
    }, [errorField, onErrorFieldHandled]);

    const handleSubmit = (e) => {
        try {
            e.preventDefault();

            const formData = new FormData();

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
                    option.option_values.forEach((value, valueIndex) => {
                        formData.append(
                            `options[${index}][values][${valueIndex}]`,
                            value
                        );
                    });
                }
            });

            // append images
            productImages.forEach((img) => {
                if (img.file) {
                    formData.append("product_image[]", img.file);
                }
            });

            // append videos
            productVideos.forEach((vid) => {
                if (vid.file) {
                    formData.append("product_video[]", vid.file);
                }
            });

            onAdd(e, formData);
        } catch (error) {
            console.log(error);
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

    // Add value to an option
    const addOptionValue = (index) => {
        const newOptions = [...productOptions];
        const value = newOptions[index].newValue.trim();
        if (value !== "" && !newOptions[index].option_values.includes(value)) {
            newOptions[index].option_values.push(value);
            newOptions[index].newValue = ""; // reset input
        }
        setProductOptions(newOptions);
    };

    // Remove value
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
        const newVideos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setProductVideos((prev) => [...prev, ...newVideos]);
        e.target.value = "";
    };

    // Steps and options
    const steps = [
        "Basic Info",
        "Details",
        "Specifications",
        "Options",
        "Media",
        "Review",
    ];

    const conditionOptions = [
        {
            value: "new",
            label: "New with tags",
            description: "Never used, with original tags",
        },
        {
            value: "excellent",
            label: "Excellent",
            description: "Like new, minimal signs of use",
        },
        {
            value: "good",
            label: "Good",
            description: "Gently used, minor wear",
        },
        {
            value: "fair",
            label: "Fair",
            description: "Visible signs of wear but functional",
        },
        {
            value: "poor",
            label: "Poor",
            description: "Heavily used, may need repair",
        },
    ];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="sticky top-0 z-10 px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-600">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Add New Preloved Product
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        {/* Stepper */}
                        <div className="flex items-center justify-between mt-3 overflow-x-auto">
                            {steps.map((label, i) => (
                                <div
                                    key={i}
                                    className="flex-1 min-w-[60px] text-center"
                                >
                                    <div
                                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
                                            step === i + 1
                                                ? "bg-white text-indigo-600"
                                                : step > i + 1
                                                ? "bg-green-500 text-white"
                                                : "bg-indigo-300 text-white"
                                        }`}
                                    >
                                        {i + 1}
                                    </div>
                                    <p className="text-xs text-white mt-1 truncate">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto">
                        <form
                            className="p-4 md:p-6 space-y-6"
                            onSubmit={handleSubmit}
                        >
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="space-y-4">
                                    {/* Input field for product name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            ref={productNameRef}
                                            type="text"
                                            name="product_name"
                                            value={productName}
                                            autoComplete="off"
                                            placeholder="e.g., Vintage Leather Jacket"
                                            required
                                            onChange={(e) =>
                                                setProductName(e.target.value)
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField === "product_name"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    {/* Input field for product description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Description *
                                        </label>
                                        <textarea
                                            ref={productDescriptionRef}
                                            rows={3}
                                            name="product_description"
                                            value={productDescription}
                                            autoComplete="off"
                                            placeholder="Describe your product in detail..."
                                            required
                                            onChange={(e) =>
                                                setProductDescription(
                                                    e.target.value
                                                )
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField ===
                                                "product_description"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Be detailed about condition and
                                            imperfections
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Product Details */}
                            {step === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Input field for product brand */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Brand
                                        </label>
                                        <input
                                            ref={productBrandRef}
                                            type="text"
                                            name="product_brand"
                                            value={productBrand}
                                            autoComplete="off"
                                            placeholder="e.g., Nike, Zara, Apple"
                                            onChange={(e) =>
                                                setProductBrand(e.target.value)
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField === "product_brand"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    {/* Input field for product condition */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Condition *
                                        </label>
                                        <select
                                            ref={productConditionRef}
                                            name="product_condition"
                                            value={productCondition}
                                            required
                                            onChange={(e) =>
                                                setProductCondition(
                                                    e.target.value
                                                )
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField ===
                                                "product_condition"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
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

                                    {/* Input field for product category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Category *
                                        </label>
                                        <select
                                            ref={productCategoriesRef}
                                            name="category_id"
                                            value={productCategories}
                                            onChange={(e) =>
                                                setProductCategories(
                                                    e.target.value
                                                )
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField === "category_id"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                            required
                                        >
                                            <option value="">
                                                Select a category
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

                                    {/* Input field for product status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Status *
                                        </label>
                                        <select
                                            name="product_status"
                                            value={productStatus}
                                            onChange={(e) =>
                                                setProductStatus(e.target.value)
                                            }
                                            className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="active">
                                                Available
                                            </option>
                                            <option value="reserved">
                                                Reserved
                                            </option>
                                            <option value="sold">Sold</option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>

                                    {/* Input field for product material */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Material
                                        </label>
                                        <input
                                            ref={productMaterialRef}
                                            type="text"
                                            name="product_material"
                                            value={productMaterial}
                                            autoComplete="off"
                                            placeholder="e.g., Cotton, Leather"
                                            onChange={(e) =>
                                                setProductMaterial(
                                                    e.target.value
                                                )
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField ===
                                                "product_material"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    {/* Input field for product manufacturer */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Manufacturer
                                        </label>
                                        <input
                                            ref={productManufacturerRef}
                                            type="text"
                                            name="product_manfacturer"
                                            autoComplete="off"
                                            value={productManufacturer}
                                            placeholder="Company name"
                                            onChange={(e) =>
                                                setProductManufacturer(
                                                    e.target.value
                                                )
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField ===
                                                "product_manufacturer"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    {/* Input field for product price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Price
                                        </label>
                                        <input
                                            ref={productPriceRef}
                                            type="text"
                                            name="product_price"
                                            value={productPrice}
                                            autoComplete="off"
                                            placeholder="RM ..."
                                            onChange={(e) =>
                                                setProductPrice(e.target.value)
                                            }
                                            className={`text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                errorField === "product_price"
                                                    ? "border-red-500 ring-1 ring-red-500"
                                                    : ""
                                            }`}
                                        />
                                    </div>

                                    {/* Input field for product weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Weight (kg)
                                        </label>
                                        <div className="relative">
                                            <Weight
                                                className="absolute left-3 top-2.5 text-gray-400"
                                                size={18}
                                            />
                                            <input
                                                ref={productWeightRef}
                                                type="text"
                                                name="product_weight"
                                                value={productWeight}
                                                autoComplete="off"
                                                placeholder="0.5"
                                                onChange={(e) =>
                                                    setProductWeight(
                                                        e.target.value
                                                    )
                                                }
                                                className={`text-black w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                    errorField ===
                                                    "product_weight"
                                                        ? "border-red-500 ring-1 ring-red-500"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Quantity
                                        </label>
                                        <div className="relative">
                                            <Weight
                                                className="absolute left-3 top-2.5 text-gray-400"
                                                size={18}
                                            />
                                            <input
                                                ref={productQuantityRef}
                                                type="text"
                                                name="product_quantity"
                                                value={productQuantity}
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    setProductQuantity(
                                                        e.target.value
                                                    )
                                                }
                                                className={`text-black w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                    errorField ===
                                                    "product_quantity"
                                                        ? "border-red-500 ring-1 ring-red-500"
                                                        : ""
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Product Specifications */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <div className="flex items-start">
                                            <Info
                                                className="text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                                                size={16}
                                            />
                                            <p className="text-sm text-blue-700">
                                                Add detailed specifications to
                                                help buyers understand your
                                                product better
                                            </p>
                                        </div>
                                    </div>

                                    {/* Key Features */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Key Features *
                                        </label>
                                        <div className="space-y-2">
                                            {keyFeatures.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="w-5 text-sm text-gray-500">
                                                            {index + 1}.
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="key_features[]"
                                                            value={feature}
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleFeatureChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`flex-1 text-black text-sm py-2 px-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                errorField ===
                                                                `key_features[${index}]`
                                                                    ? "border-red-500 ring-1 ring-red-500"
                                                                    : ""
                                                            }`}
                                                            placeholder={`Feature ${
                                                                index + 1
                                                            }`}
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
                                                                className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                                            >
                                                                <Minus
                                                                    size={16}
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
                                                className="mt-3 flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                                            >
                                                <Plus
                                                    size={16}
                                                    className="mr-1"
                                                />{" "}
                                                Add Feature
                                            </button>
                                        )}
                                    </div>

                                    {/* What's Included */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            What's Included
                                        </label>
                                        <div className="space-y-2">
                                            {includedItems.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="w-5 text-sm text-gray-500">
                                                            •
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="included_items[]"
                                                            value={item}
                                                            autoComplete="off"
                                                            onChange={(e) =>
                                                                handleIncludedItemChange(
                                                                    index,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`flex-1 text-black text-sm py-2 px-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 ${
                                                                errorField ===
                                                                `included_items[${index}]`
                                                                    ? "border-red-500 ring-1 ring-red-500"
                                                                    : ""
                                                            }`}
                                                            placeholder={`Item ${
                                                                index + 1
                                                            }`}
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
                                                                className="p-1 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                                                            >
                                                                <Minus
                                                                    size={16}
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
                                                className="mt-3 flex items-center text-sm text-gray-600 hover:text-gray-700"
                                            >
                                                <Plus
                                                    size={16}
                                                    className="mr-1"
                                                />{" "}
                                                Add Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Product Options */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <div className="flex items-start">
                                            <Sliders
                                                className="text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                                                size={16}
                                            />
                                            <p className="text-sm text-blue-700">
                                                Add options like size, color, or
                                                other variations of your product
                                            </p>
                                        </div>
                                    </div>

                                    {productOptions.map(
                                        (option, optionIndex) => (
                                            <div
                                                key={option.id}
                                                className="border rounded-lg p-4 bg-gray-50"
                                            >
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-gray-700">
                                                        Option {optionIndex + 1}
                                                    </h4>
                                                    {productOptions.length >
                                                        1 && (
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700 text-sm"
                                                            onClick={() =>
                                                                removeProductOption(
                                                                    optionIndex
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Option Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="product_optionName[]"
                                                        value={
                                                            option.option_name
                                                        }
                                                        autoComplete="off"
                                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                        placeholder="e.g., Size, Color, Material"
                                                        onChange={(e) =>
                                                            updateProductOptionName(
                                                                optionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Option Values
                                                    </label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {option.option_values.map(
                                                            (
                                                                value,
                                                                valueIndex
                                                            ) => (
                                                                <span
                                                                    key={
                                                                        valueIndex
                                                                    }
                                                                    className="flex items-center bg-indigo-100 text-indigo-700 text-sm px-2 py-1 rounded-full"
                                                                >
                                                                    {value}
                                                                    <button
                                                                        type="button"
                                                                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                                                                        onClick={() =>
                                                                            removeOptionValue(
                                                                                optionIndex,
                                                                                valueIndex
                                                                            )
                                                                        }
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </span>
                                                            )
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            name="product_optionValue[]"
                                                            value={
                                                                option.newValue
                                                            }
                                                            className="flex-1 text-black text-sm py-2 px-3 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                            placeholder="Add value and press Enter"
                                                            autoComplete="off"
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
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addOptionValue(
                                                                    optionIndex
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
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
                                            className="flex items-center justify-center w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-400"
                                        >
                                            <Plus size={16} className="mr-1" />
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
                                            <Info
                                                className="text-blue-500 mt-0.5 mr-2"
                                                size={16}
                                            />
                                            <p className="text-sm text-blue-700">
                                                Clear photos from all angles are
                                                essential for preloved items
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Images *
                                        </label>
                                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="product_image"
                                                        className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                                                    >
                                                        <span>
                                                            Upload images
                                                        </span>
                                                        <input
                                                            type="file"
                                                            name="product_image"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={
                                                                handleImageChange
                                                            }
                                                            className="sr-only"
                                                            id="product_image"
                                                        />
                                                    </label>
                                                    <p className="pl-1">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG up to 10MB each
                                                </p>
                                            </div>
                                        </div>
                                        {productImages.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsImagePreviewOpen(true)
                                                }
                                                className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
                                            >
                                                View Uploaded Images (
                                                {productImages.length})
                                            </button>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Product Video (Optional)
                                        </label>
                                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <label
                                                        htmlFor="product_video"
                                                        className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500"
                                                    >
                                                        <span>
                                                            Upload video
                                                        </span>
                                                        <input
                                                            type="file"
                                                            name="product_video"
                                                            accept="video/*"
                                                            onChange={
                                                                handleVideoChange
                                                            }
                                                            className="sr-only"
                                                            id="product_video"
                                                        />
                                                    </label>
                                                    <p className="pl-1">
                                                        or drag and drop
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    MP4, MOV up to 100MB
                                                </p>
                                            </div>
                                        </div>
                                        {productVideos.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsVideoPreviewOpen(true)
                                                }
                                                className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm"
                                            >
                                                View Uploaded Video
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Review */}
                            {step === 6 && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                        Review Your Product
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-black">
                                        <div>
                                            <span className="text-gray-500">
                                                Product Name:
                                            </span>{" "}
                                            {productName}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Product Brand:
                                            </span>{" "}
                                            {productBrand || "Not specified"}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Product Condition:
                                            </span>{" "}
                                            {productCondition}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Product Price:
                                            </span>{" "}
                                            RM {productPrice}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Product Quantity:
                                            </span>{" "}
                                            {productQuantity}
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Product Status:
                                            </span>{" "}
                                            {productStatus}
                                        </div>
                                    </div>

                                    {/* Specifications Summary */}
                                    {keyFeatures.some(
                                        (f) => f.trim() !== ""
                                    ) && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">
                                                Key Features
                                            </h4>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                {keyFeatures
                                                    .filter(
                                                        (f) => f.trim() !== ""
                                                    )
                                                    .map((feature, i) => (
                                                        <li key={i}>
                                                            {feature}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Options Summary */}
                                    {productOptions.some(
                                        (opt) => opt.option_values.length > 0
                                    ) && (
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2">
                                                Product Options
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                {productOptions
                                                    .filter(
                                                        (opt) =>
                                                            opt.option_values
                                                                .length > 0
                                                    )
                                                    .map((option, i) => (
                                                        <div key={i}>
                                                            <span className="text-gray-500">
                                                                {
                                                                    option.option_name
                                                                }
                                                                :
                                                            </span>{" "}
                                                            <span className="text-gray-700">
                                                                {option.option_values.join(
                                                                    ", "
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {productImages.length > 0 && (
                                        <div>
                                            <p className="text-gray-500 mb-2">
                                                Product Images (
                                                {productImages.length})
                                            </p>
                                            <div className="flex gap-2">
                                                {productImages
                                                    .slice(0, 3)
                                                    .map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img.preview}
                                                            alt=""
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    ))}
                                                {productImages.length > 3 && (
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                        +
                                                        {productImages.length -
                                                            3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Navigation */}
                    <div className="sticky bottom-0 bg-white border-t p-4">
                        <div className="flex justify-between">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => prev - 1)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Back
                                </button>
                            )}
                            {step < 6 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => prev + 1)}
                                    className="ml-auto px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        handleSubmit(e);
                                        onClose();
                                    }}
                                    className="ml-auto px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >
                                    Add Product
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isImagePreviewOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-auto p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Uploaded Images ({productImages.length})
                            </h2>
                            <button
                                onClick={() => setIsImagePreviewOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {productImages.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.preview}
                                        alt=""
                                        className="w-full h-40 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() =>
                                            setProductImages((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== index
                                                )
                                            )
                                        }
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Video Preview Modal */}
            {isVideoPreviewOpen && productVideos.length > 0 && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Uploaded Video
                            </h2>
                            <button
                                onClick={() => setIsVideoPreviewOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <video
                            src={productVideos[0].preview}
                            controls
                            className="w-full rounded-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
