import { FaClock, FaShoppingCart, FaStar } from "react-icons/fa";

export function ProductCard({ product, isFlashSale }) {
    if (!product) return null;

    const { category, originalPrice, discount, timeLeft } = product;

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col group">
            <div className="relative overflow-hidden">
                <img
                    src={
                        import.meta.env.VITE_BASE_URL +
                        product.product_image[0].image_path
                    }
                    alt={product.product_name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Flash sale badge */}
                {isFlashSale && discount && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {discount}% OFF
                    </div>
                )}

                {/* Flash sale countdown */}
                {isFlashSale && timeLeft && (
                    <div className="absolute bottom-0 left-0 right-0 bg-red-600 bg-opacity-90 text-white text-xs py-1 px-2">
                        <div className="flex items-center justify-center">
                            <FaClock className="mr-1" />
                            <span className="font-mono">{timeLeft}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Product info */}
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.product_name}
                </h3>
                <span className="text-xs text-gray-500 uppercase font-medium mb-1">
                    {category.category_name}
                </span>

                {/* Rating */}
                <div className="flex items-center mb-3">
                    <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                className={`w-3 h-3 ${
                                    star <=
                                    Math.round(product.ratings[0]?.rating || 0)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                        ( {product.ratings[0]?.rating || 0} )
                    </span>
                </div>

                {/* Price */}
                <div className="mt-auto flex items-center justify-between">
                    <div>
                        <span className="font-bold text-gray-900">
                            RM {product.product_price}
                        </span>
                        {originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                                {originalPrice}
                            </span>
                        )}
                    </div>

                    {!isFlashSale && (
                        <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                            <FaShoppingCart className="text-sm" />
                        </button>
                    )}
                </div>

                {/* Progress bar for flash sale items */}
                {isFlashSale && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Sold: 72%</span>
                            <span>Available: 12/50</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: "72%" }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
