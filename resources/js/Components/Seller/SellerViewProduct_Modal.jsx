import { X } from "lucide-react";
import { useState } from "react";

export function SellerViewProduct_Modal({ product, onClose }) {
    const BASE_URL = "http://127.0.0.1:8000/storage/";

    const [activeMedia, setActiveMedia] = useState(
        product.product_image?.[0]
            ? {
                  type: "image",
                  path: BASE_URL + product.product_image[0].image_path,
              }
            : null
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative animate-fadeIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-black text-2xl font-semibold mb-4">
                    {product.product_name}
                </h2>

                <div className="grid grid-cols-12 gap-6">
                    {/* Sidebar Thumbnails */}
                    <div className="col-span-2 space-y-3 overflow-y-auto max-h-[400px] pr-2">
                        {product.product_image?.map((img, i) => (
                            <img
                                key={i}
                                src={BASE_URL + img.image_path}
                                alt={`thumb-${i}`}
                                onClick={() =>
                                    setActiveMedia({
                                        type: "image",
                                        path: BASE_URL + img.image_path,
                                    })
                                }
                                className="w-full h-20 object-cover rounded-lg border cursor-pointer hover:ring-2 hover:ring-blue-400"
                            />
                        ))}

                        {product.product_video?.map((vid, i) => (
                            <div
                                key={i}
                                onClick={() =>
                                    setActiveMedia({
                                        type: "video",
                                        path: BASE_URL + vid.video_path,
                                    })
                                }
                                className="w-full h-20 bg-gray-200 flex items-center justify-center rounded-lg border cursor-pointer hover:ring-2 hover:ring-blue-400"
                            >
                                🎥 Video {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Main Preview */}
                    <div className="col-span-6 flex items-center justify-center">
                        {activeMedia ? (
                            activeMedia.type === "image" ? (
                                <img
                                    src={activeMedia.path}
                                    alt="preview"
                                    className="w-full max-h-[400px] object-contain rounded-xl border"
                                />
                            ) : (
                                <video
                                    src={activeMedia.path}
                                    controls
                                    className="w-full max-h-[400px] rounded-xl border"
                                />
                            )
                        ) : (
                            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-xl border">
                                <span className="text-gray-400">No Media</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="col-span-4 text-black space-y-3">
                        <p>
                            <span className="font-medium">Description:</span>
                            <br />
                            {product.product_description ||
                                "No description provided"}
                        </p>
                        <p>
                            <span className="font-medium">Price:</span> RM{" "}
                            {product.product_price}
                        </p>
                        <p>
                            <span className="font-medium">Quantity:</span>{" "}
                            {product.product_quantity}
                        </p>
                        <p>
                            <span className="font-medium">Condition:</span>{" "}
                            {product.product_condition}
                        </p>
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span
                                className={`px-3 py-1 text-xs rounded-full ${
                                    product.product_status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {product.product_status}
                            </span>
                        </p>
                        <p>
                            <span className="font-medium">Category:</span>{" "}
                            {product.category?.category_name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}