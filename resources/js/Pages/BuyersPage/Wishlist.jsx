import React from "react";
import { Link } from "@inertiajs/react";
import { Footer } from "@/Components/Buyer/Footer";

export default function WishlistPage() {
    const wishlist = [
        {
            id: 1,
            name: "Wireless Bluetooth Speaker",
            image: "/images/products/speaker.jpg",
            price: 89.99,
            status: "In Stock",
        },
        {
            id: 2,
            name: "Minimalist Leather Backpack",
            image: "/images/products/backpack.jpg",
            price: 199.0,
            status: "Out of Stock",
        },
        {
            id: 3,
            name: "Smart Fitness Band",
            image: "/images/products/fitnessband.jpg",
            price: 149.5,
            status: "In Stock",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
                💖 My Wishlist
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white shadow-lg rounded-lg overflow-hidden transition hover:shadow-xl"
                    >
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-48 w-full object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {item.name}
                            </h2>
                            <p className="text-indigo-600 font-bold mt-1">
                                RM {item.price.toFixed(2)}
                            </p>
                            <p
                                className={`mt-2 text-sm font-medium ${
                                    item.status === "In Stock"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {item.status}
                            </p>

                            <div className="mt-4 flex justify-between gap-2">
                                {item.status === "In Stock" ? (
                                    <Link
                                        href={`/cart/add/${item.id}`}
                                        className="bg-indigo-600 text-white px-4 py-2 text-sm rounded hover:bg-indigo-700 transition"
                                    >
                                        Add to Cart
                                    </Link>
                                ) : (
                                    <button
                                        className="bg-gray-300 text-gray-700 px-4 py-2 text-sm rounded cursor-not-allowed"
                                        disabled
                                    >
                                        Out of Stock
                                    </button>
                                )}
                                <button
                                    className="text-red-500 font-semibold hover:text-red-600 transition text-sm"
                                    onClick={() =>
                                        console.log("Remove", item.id)
                                    }
                                >
                                    Remove ❌
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {wishlist.length === 0 && (
                <div className="text-center mt-20 text-gray-500">
                    <p>Your wishlist is currently empty.</p>
                    <Link
                        href="/shop"
                        className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Browse Products
                    </Link>
                </div>
            )}
            <Footer />
        </div>
    );
}
