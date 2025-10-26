import { EmptyState } from "./EmptyState";

import { Share2, Trash2, Star, Heart } from "lucide-react";

export function WishlistTab({
    wishlistItems,
    removeFromWishlist,
    addToCartFromWishlist,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            My Wishlist
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {wishlistItems.length} items saved for later
                        </p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        <Share2 size={18} className="mr-2" />
                        Share Wishlist
                    </button>
                </div>
            </div>

            <div className="p-6">
                {wishlistItems.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="Your wishlist is empty"
                        description="Save items you love for later by clicking the heart icon"
                        actionText="Browse Products"
                        actionLink="/products"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {wishlistItems.map((item) => (
                            <div
                                key={item.product_id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white group"
                            >
                                <div className="relative">
                                    <img
                                        src={
                                            import.meta.env.VITE_BASE_URL +
                                            item.product_image.image_path
                                        }
                                        alt={item.product.product_name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <button
                                        onClick={() =>
                                            removeFromWishlist(item.id)
                                        }
                                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    {!item.inStock && (
                                        <div className="absolute top-3 left-3 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                                            Out of Stock
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight">
                                        {item.product.product_name}
                                    </h3>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={
                                                        i <
                                                        Math.floor(item.rating)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            ({item.reviews})
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <p className="text-blue-600 font-bold text-lg">
                                            RM {item.product.product_price}
                                        </p>
                                        {item.originalPrice > item.price && (
                                            <p className="text-gray-400 text-sm line-through">
                                                RM{" "}
                                                {item.originalPrice.toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                addToCartFromWishlist(item)
                                            }
                                            disabled={!item.inStock}
                                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                                                item.inStock
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            }`}
                                        >
                                            {item.inStock
                                                ? "Add to Cart"
                                                : "Out of Stock"}
                                        </button>
                                    </div>

                                    <p className="text-xs text-gray-500">
                                        Added on{" "}
                                        {new Date(
                                            item.addedDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
