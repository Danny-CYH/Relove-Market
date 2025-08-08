import React from "react";
import { Link } from "@inertiajs/react";

import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";

export default function SellerShop() {
    const seller = {
        profileImage: "/images/seller-profile.jpg",
        shopName: "Gemilang Store",
        shopDescription: "Your one-stop store for fashion, electronics & more!",
        address: "12 Jalan Bukit, Kuala Lumpur, Malaysia",
        totalSales: 342,
        rating: 4.6,
        joinDate: "Jan 2024",
        products: [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 129.99,
                image: "/images/products/headphones.jpg",
                stock: 10,
                status: "In Stock",
            },
            {
                id: 2,
                name: "Stylish T-Shirt",
                price: 49.99,
                image: "/images/products/tshirt.jpg",
                stock: 0,
                status: "Out of Stock",
            },
            {
                id: 3,
                name: "Smart Watch",
                price: 229.99,
                image: "/images/products/watch.jpg",
                stock: 5,
                status: "In Stock",
            },
        ],
    };

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            {/* Seller Info */}
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col mt-10 mx-4 md:mx-16 md:flex-row md:items-center mb-8">
                <img
                    src={seller.profileImage}
                    alt="Seller"
                    className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover mb-4 md:mb-0 md:mr-6"
                />
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {seller.shopName}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {seller.shopDescription}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        📍 {seller.address}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        ⭐ {seller.rating} / 5 • 🛒 {seller.totalSales} Sales •
                        Joined {seller.joinDate}
                    </p>
                </div>
            </div>

            {/* Shop Stats / Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mx-4 md:mx-16">
                <div className="bg-indigo-100 p-4 rounded-lg text-center shadow">
                    <h2 className="text-lg font-semibold text-indigo-700">
                        Total Products
                    </h2>
                    <p className="text-2xl font-bold">
                        {seller.products.length}
                    </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg text-center shadow">
                    <h2 className="text-lg font-semibold text-green-700">
                        Total Sales
                    </h2>
                    <p className="text-2xl font-bold">{seller.totalSales}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-lg text-center shadow">
                    <h2 className="text-lg font-semibold text-yellow-700">
                        Rating
                    </h2>
                    <p className="text-2xl font-bold">{seller.rating}</p>
                </div>
            </div>

            {/* Product List */}
            <h2 className="text-xl font-bold mb-4 text-gray-700 mx-4 md:mx-16">
                Products for Sale
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 mb-8 md:mx-16">
                {seller.products.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {product.name}
                            </h3>
                            <p className="text-indigo-600 font-bold mt-1">
                                RM {product.price.toFixed(2)}
                            </p>
                            <p
                                className={`text-sm mt-1 ${
                                    product.status === "In Stock"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {product.status}
                            </p>
                            <Link
                                href={`/product/${product.id}`}
                                className="mt-3 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                            >
                                View Product
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}
