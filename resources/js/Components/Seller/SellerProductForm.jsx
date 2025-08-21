import React, { useState } from "react";
import { X } from "lucide-react";

export function SellerProductForm({
    onSubmit,
    title,
    onClose,
    list_categories,
}) {
    const [images, setImages] = useState([]);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);

    const [productName, setProductName] = useState("");
    const [productDescription, setDescription] = useState("");
    const [productPrice, setPrice] = useState("");
    const [productQuantity, setQuantity] = useState("");
    const [productStatus, setStatus] = useState("active");
    const [productCondition, setCondition] = useState("new");
    const [productCategories, setCategories] = useState("");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages((prev) => [...prev, ...newImages]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_name", productName);
        formData.append("product_description", productDescription);
        formData.append("product_price", productPrice);
        formData.append("product_condition", productCondition);
        formData.append("product_quantity", productQuantity);
        formData.append("product_status", productStatus);
        formData.append("product_categories", productCategories);

        // Append multiple images
        images.forEach((img, index) => {
            formData.append("product_image[]", img.file);
        });

        try {
            await axios.post(route("add-product"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Product saved successfully!");
        } catch (error) {
            console.error(
                "Error saving product:",
                error.response?.data || error
            );
        }
    };

    return (
        <>
            {/* Main Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
                        {/* Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b bg-gradient-to-r from-indigo-500 to-indigo-600">
                            <h2 className="text-lg font-semibold text-white">
                                {title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* Product Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    name="product_name"
                                    value={productName}
                                    onChange={(e) =>
                                        setProductName(e.target.value)
                                    }
                                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Description
                                </label>
                                <textarea
                                    value={productDescription}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows="3"
                                    name="product_description"
                                    className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>

                            {/* Price & Quantity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (RM)
                                    </label>
                                    <input
                                        type="text"
                                        name="product_price"
                                        step="0.01"
                                        value={productPrice}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quantity
                                    </label>
                                    <input
                                        type="text"
                                        name="product_quantity"
                                        value={productQuantity}
                                        onChange={(e) =>
                                            setQuantity(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Status, Categories & Condition */}
                            <div className="grid grid-cols-3 gap-4">
                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={productStatus}
                                        name="product_status"
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="On Stock">
                                            On Stock
                                        </option>
                                        <option value="Available Soon">
                                            Available Soon
                                        </option>
                                    </select>
                                </div>

                                {/* Categories */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categories
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

                                {/* Condition */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Condition
                                    </label>
                                    <select
                                        value={productCondition}
                                        name="product_condition"
                                        onChange={(e) =>
                                            setCondition(e.target.value)
                                        }
                                        className="text-black block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="new">New</option>
                                        <option value="used-like-new">
                                            Used - Like New
                                        </option>
                                        <option value="used-good">
                                            Used - Good
                                        </option>
                                        <option value="used-fair">
                                            Used - Fair
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Images
                                </label>
                                <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition">
                                    <input
                                        type="file"
                                        name="product_image[]"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="fileUpload"
                                    />
                                    <label
                                        htmlFor="fileUpload"
                                        className="text-center cursor-pointer"
                                    >
                                        <p className="text-gray-600 font-medium">
                                            Click to upload or drag & drop
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            PNG, JPG up to 5MB each
                                        </p>
                                    </label>
                                </div>
                                {images.length > 0 && (
                                    <button
                                        type="button"
                                        className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setIsImagePreviewOpen(true);
                                        }}
                                    >
                                        View Uploaded Images ({images.length})
                                    </button>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-5 border-t">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
                                        {/* Replace */}
                                        <label className="px-3 py-1 bg-blue-500 text-white text-xs rounded cursor-pointer hover:bg-blue-600">
                                            Replace
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (
                                                        e.target.files &&
                                                        e.target.files[0]
                                                    ) {
                                                        const newFile =
                                                            e.target.files[0];
                                                        const updatedImages = [
                                                            ...images,
                                                        ];
                                                        updatedImages[index] = {
                                                            file: newFile,
                                                            preview:
                                                                URL.createObjectURL(
                                                                    newFile
                                                                ),
                                                        };
                                                        setImages(
                                                            updatedImages
                                                        );
                                                        e.target.value = "";
                                                    }
                                                }}
                                            />
                                        </label>

                                        {/* Delete */}
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
                                onClick={() => {
                                    setIsImagePreviewOpen(false);
                                    setIsFormOpen(true);
                                }}
                                className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
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
