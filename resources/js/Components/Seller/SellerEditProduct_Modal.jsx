import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";

export function SellerEditProduct_Modal({
    onEdit,
    product,
    list_categories,
    onClose,
}) {
    const [step, setStep] = useState(1);

    const [productID, setProductID] = useState("");
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productQuantity, setProductQuantity] = useState("");
    const [productStatus, setProductStatus] = useState("active");
    const [productCondition, setProductCondition] = useState("new");
    const [productCategories, setProductCategories] = useState("");

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isVideoPreviewOpen, setIsVideoPreviewOpen] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const BASE_URL = "http://127.0.0.1:8000/storage/";

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const mapped = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...mapped]);
    };

    const handleVideoChange = (e) => {
        const files = Array.from(e.target.files);
        const mapped = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setVideos((prev) => [...prev, ...mapped]);
    };

    // Whenever modal opens, populate states with product values
    useEffect(() => {
        if (product) {
            setProductID(product.product_id);
            setProductName(product.product_name);
            setProductDescription(product.product_description);
            setProductPrice(product.product_price);
            setProductQuantity(product.product_quantity);
            setProductStatus(product.product_status);
            setProductCondition(product.product_condition);
            setProductCategories(product.category.category_id);
        }

        if (product.product_image) {
            setImages(
                product.product_image.map((img) => ({
                    file: null,
                    preview: BASE_URL + img.image_path.replace("public/", ""),
                }))
            );
        }

        if (product.product_video) {
            setVideos(
                product.product_video.map((vid) => ({
                    file: null,
                    preview: BASE_URL + vid.video_path.replace("public/", ""),
                }))
            );
        }
    }, [product]);

    const steps = ["Basic Info", "Pricing", "Media", "Review"];

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-600">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-white">
                                Edit Product
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
                    <form
                        encType="multipart/form-data"
                        className="p-6 space-y-5"
                    >
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
                                            setProductDescription(
                                                e.target.value
                                            )
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
                                        value={productPrice}
                                        onChange={(e) =>
                                            setProductPrice(e.target.value)
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
                                            setProductQuantity(e.target.value)
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
                                            setProductStatus(e.target.value)
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
                                            setProductCondition(e.target.value)
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
                                        onChange={(e) =>
                                            setProductCategories(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="" disabled>
                                            -- Select Category --
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
                                    <div className="flex justify-center mt-2 px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                            <label className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                                                <span>Upload an image</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG up to 10MB
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
                                    <div className="flex justify-center mt-2 px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition cursor-pointer">
                                        <div className="space-y-1 text-center">
                                            <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                            <label className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                                                <span>Upload a video</span>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="video/*"
                                                    onChange={handleVideoChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500">
                                                MP4, MOV, AVI up to 100MB
                                            </p>
                                        </div>
                                    </div>
                                    {videos.length > 0 && (
                                        <button
                                            type="button"
                                            className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                                            onClick={() =>
                                                setIsVideoPreviewOpen(true)
                                            }
                                        >
                                            View Uploaded Video ({videos.length}
                                            )
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Review */}
                        {step === 4 && (
                            <table className="w-full text-black text-sm border border-gray-200 rounded-lg">
                                <tbody className="divide-y divide-gray-200">
                                    <tr>
                                        <td className="font-medium p-3 w-40">
                                            Product Name
                                        </td>
                                        <td className="p-3">{productName}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3 w-40">
                                            Product Description
                                        </td>
                                        <td className="p-3">
                                            {productDescription}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3">
                                            Product Price
                                        </td>
                                        <td className="p-3">
                                            RM {productPrice}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3">
                                            Product Quantity
                                        </td>
                                        <td className="p-3">
                                            {productQuantity}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3">
                                            Product Status
                                        </td>
                                        <td className="p-3">{productStatus}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3">
                                            Product Category
                                        </td>
                                        <td className="p-3">
                                            {productCategories}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="font-medium p-3">
                                            Product Condition
                                        </td>
                                        <td className="p-3">
                                            {productCondition}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                                            "product_id",
                                            productID
                                        );
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

                                        // append images
                                        images.forEach((img) => {
                                            if (img.file) {
                                                formData.append(
                                                    "product_image[]",
                                                    img.file
                                                );
                                            }
                                        });

                                        // append videos
                                        videos.forEach((vid) => {
                                            if (vid.file) {
                                                formData.append(
                                                    "product_video[]",
                                                    vid.file
                                                );
                                            }
                                        });

                                        onEdit(e, formData); // pass it to parent
                                        onClose(); // close modal
                                    }}
                                    className="ml-auto px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                                >
                                    Update Product
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

            {/* Video Preview Modal */}
            {isVideoPreviewOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl p-6 relative">
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

                        {videos.length > 0 && (
                            <div className="relative">
                                <video
                                    key={currentIndex}
                                    src={videos[currentIndex].preview}
                                    controls
                                    className="w-full max-h-[300px] rounded-lg"
                                />
                                {videos.length > 1 && (
                                    <>
                                        <button
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (prev) =>
                                                        (prev -
                                                            1 +
                                                            videos.length) %
                                                        videos.length
                                                )
                                            }
                                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700"
                                        >
                                            ‹
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentIndex(
                                                    (prev) =>
                                                        (prev + 1) %
                                                        videos.length
                                                )
                                            }
                                            className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-full hover:bg-gray-700"
                                        >
                                            ›
                                        </button>
                                    </>
                                )}
                                <div className="mt-3 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setVideos((prev) =>
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
