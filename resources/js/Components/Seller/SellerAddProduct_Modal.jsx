import React, { useState } from "react";
import { X, Upload } from "lucide-react";

export function SellerAddProduct_Modal({ onAdd, list_categories, onClose }) {
    const [step, setStep] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Product fields
    const [productName, setProductName] = useState("");
    const [productDescription, setDescription] = useState("");
    const [productPrice, setPrice] = useState("");
    const [productQuantity, setQuantity] = useState("");
    const [productStatus, setStatus] = useState("active");
    const [productCondition, setCondition] = useState("new");
    const [productCategories, setCategories] = useState("");

    const [images, setImages] = useState([]);
    const [video, setVideo] = useState([]);

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

    // Image upload handler
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    // Video upload handler
    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setVideo((prev) => [...prev, ...newVideos]);

        e.target.value = "";
    };

    // Steps label
    const steps = ["Basic Info", "Pricing", "Media", "Review"];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
                    {/* Header with step progress */}
                    <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-600">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Add New Product
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition"
                            >
                                <X size={22} />
                            </button>
                        </div>
                        {/* Stepper */}
                        <div className="flex items-center justify-between mt-3">
                            {steps.map((label, i) => (
                                <div key={i} className="flex-1 text-center">
                                    <div
                                        className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold
                    ${
                        step === i + 1
                            ? "bg-white text-indigo-600"
                            : step > i + 1
                            ? "bg-green-500 text-white"
                            : "bg-indigo-300 text-white"
                    }`}
                                    >
                                        {i + 1}
                                    </div>
                                    <p className="text-xs text-white mt-1">
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form */}
                    <form className="p-6 space-y-5">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) =>
                                            setProductName(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        value={productDescription}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing */}
                        {step === 2 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Price (RM)
                                    </label>
                                    <input
                                        type="text"
                                        step="0.01"
                                        value={productPrice}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Quantity
                                    </label>
                                    <input
                                        type="text"
                                        value={productQuantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Status
                                    </label>
                                    <select
                                        value={productStatus}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="outofstock">
                                            Out of Stock
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Condition
                                    </label>
                                    <select
                                        value={productCondition}
                                        onChange={(e) =>
                                            setCondition(e.target.value)
                                        }
                                        className="text-black w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="new">New</option>
                                        <option value="used">Used</option>
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Product Categories
                                    </label>
                                    <select
                                        value={productCategories}
                                        name="product_categories"
                                        onChange={(e) =>
                                            setCategories(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                            </div>
                        )}

                        {/* Step 3: Media */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Images
                                    </label>
                                    {/* Upload Box */}
                                    <div className="flex justify-center mt-2 px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="product_image"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                >
                                                    <span>Upload an image</span>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                        className="sr-only"
                                                        id="product_image"
                                                        name="product_image"
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
                                    {images.length > 0 && (
                                        <button
                                            type="button"
                                            className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                                            onClick={() =>
                                                setIsImagePreviewOpen(true)
                                            }
                                        >
                                            View Uploaded Images (
                                            {images.length})
                                        </button>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Product Video (Optional)
                                    </label>
                                    {/* Upload Box */}
                                    <div className="flex justify-center mt-2 px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="product_video"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a video</span>
                                                    <input
                                                        id="product_video"
                                                        name="product_video"
                                                        type="file"
                                                        multiple
                                                        accept="video/*"
                                                        className="sr-only"
                                                        onChange={
                                                            handleVideoChange
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                MP4, MOV, or AVI up to 100MB
                                            </p>
                                        </div>
                                    </div>

                                    {/* Preview Button (only show when a video is uploaded) */}
                                    {video.length > 0 && (
                                        <button
                                            type="button"
                                            className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                                            onClick={() =>
                                                setIsVideoPreviewOpen(true)
                                            }
                                        >
                                            View Uploaded Video ({video.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                    Review Your Product
                                </h3>

                                {/* Product Info Grid */}
                                <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium text-gray-900">
                                            {productName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Price</p>
                                        <p className="font-medium text-green-600">
                                            RM {productPrice}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">
                                            Quantity
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {productQuantity}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-medium">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${
                                                    productStatus ===
                                                    "Available"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {productStatus}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-gray-500">
                                            Condition
                                        </p>
                                        <p className="font-medium text-gray-900">
                                            {productCondition}
                                        </p>
                                    </div>
                                </div>

                                {/* Product Images */}
                                {images.length > 0 && (
                                    <div>
                                        <p className="text-gray-500 mb-2">
                                            Product Images
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {images.map((img, i) => (
                                                <div
                                                    key={i}
                                                    className="relative group rounded-lg overflow-hidden shadow-md"
                                                >
                                                    <img
                                                        src={img.preview}
                                                        alt=""
                                                        className="w-28 h-28 object-cover transform group-hover:scale-105 transition duration-200"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between pt-4 border-t">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep((prev) => prev - 1)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Back
                                </button>
                            )}
                            {step < 4 ? (
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
                                        const formData = new FormData();
                                        formData.append(
                                            "product_name",
                                            productName
                                        );
                                        formData.append(
                                            "product_description",
                                            productDescription
                                        );
                                        formData.append(
                                            "product_price",
                                            productPrice
                                        );
                                        formData.append(
                                            "product_quantity",
                                            productQuantity
                                        );
                                        formData.append(
                                            "product_status",
                                            productStatus
                                        );
                                        formData.append(
                                            "product_condition",
                                            productCondition
                                        );
                                        formData.append(
                                            "product_categories",
                                            productCategories
                                        );

                                        images.forEach((img) => {
                                            formData.append(
                                                "product_image[]",
                                                img.file
                                            );
                                        });

                                        video.forEach((vid) => {
                                            formData.append(
                                                "product_video[]",
                                                vid.file
                                            );
                                        });

                                        onAdd(e, formData);
                                        onClose();
                                    }}
                                    className="ml-auto px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >
                                    Add Product
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Preview Modal */}
            {isImagePreviewOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl p-6 relative">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Uploaded Images
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative group border rounded-lg overflow-hidden"
                                >
                                    <img
                                        src={img.preview}
                                        alt={`preview-${index}`}
                                        className="h-40 w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition">
                                        <button
                                            onClick={() =>
                                                setImages((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={() => setIsImagePreviewOpen(false)}
                                className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                            >
                                Back to Form
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for Full Video Preview */}
            {isVideoPreviewOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl p-6 relative">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Uploaded Video
                            </h2>
                            <button
                                onClick={() => setIsVideoPreviewOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Carousel Video Preview */}
                        {video.length > 0 && (
                            <div className="relative">
                                <video
                                    key={currentIndex}
                                    src={video[currentIndex].preview}
                                    controls
                                    className="w-full max-h-[300px] rounded-lg"
                                />

                                {/* Prev Button */}
                                {video.length > 1 && (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex(
                                                (prev) =>
                                                    (prev - 1 + video.length) %
                                                    video.length
                                            )
                                        }
                                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700"
                                    >
                                        ‹
                                    </button>
                                )}

                                {/* Next Button */}
                                {video.length > 1 && (
                                    <button
                                        onClick={() =>
                                            setCurrentIndex(
                                                (prev) =>
                                                    (prev + 1) % video.length
                                            )
                                        }
                                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700"
                                    >
                                        ›
                                    </button>
                                )}

                                {/* Delete Button Below */}
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setVideo((prev) =>
                                                prev.filter(
                                                    (_, i) => i !== currentIndex
                                                )
                                            );
                                            setCurrentIndex((prev) =>
                                                prev > 0 ? prev - 1 : 0
                                            );
                                        }}
                                        className="px-4 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                    >
                                        Delete Video
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsVideoPreviewOpen(false)}
                                className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                            >
                                Back to Form
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
