import React, { useState, useEffect } from "react";
import {
    Star,
    ShoppingCart,
    MessageCircle,
    Heart,
    TicketPercent,
    Zap,
    ShieldCheck,
    Truck,
    RefreshCcw,
    Store,
} from "lucide-react";

import { usePage } from "@inertiajs/react";
import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";

export default function ItemDetails() {
    const { props } = usePage();
    const product_info = props.product_info[0];

    const [activeTab, setActiveTab] = useState("description");
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [activeImage, setActiveImage] = useState(
        `/storage/${product_info.product_image[0].image_path}`
    );

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (secs) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h}h ${m}m ${s}s`;
    };

    const vouchers = [
        { id: 1, code: "SAVE10", desc: "RM 10 OFF - Min Spend RM50" },
        { id: 2, code: "FREESHIP", desc: "Free Shipping Voucher" },
        { id: 3, code: "FLASH20", desc: "20% OFF Flash Sale" },
    ];

    return (
        <div>
            <Navbar />

            <div className="bg-gray-50 min-h-screen py-10 px-4 lg:px-12">
                <div className="max-w-8xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT: Product Details */}
                    <div className="lg:col-span-3 bg-white rounded-3xl shadow-xl p-6 lg:p-10 space-y-10">
                        {/* Product Top Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left: Gallery */}
                            <div>
                                <img
                                    src={activeImage}
                                    alt="Product"
                                    className="rounded-2xl w-full h-96 object-contain shadow-md bg-gray-50"
                                />
                                <div className="flex gap-3 mt-4 overflow-x-auto">
                                    {product_info.product_image.map(
                                        (img, i) => (
                                            <img
                                                key={i}
                                                src={`/storage/${img.image_path}`}
                                                alt="Thumb"
                                                onClick={() =>
                                                    setActiveImage(
                                                        `/storage/${img.image_path}`
                                                    )
                                                }
                                                className={`w-20 h-20 object-cover rounded-xl cursor-pointer border ${
                                                    activeImage.includes(
                                                        img.image_path
                                                    )
                                                        ? "border-indigo-500"
                                                        : "border-gray-200"
                                                }`}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Right: Product Info */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {product_info.product_name}
                                    </h1>

                                    {/* Ratings */}
                                    <div className="flex items-center mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600 text-sm">
                                            (562 Reviews)
                                        </span>
                                    </div>

                                    {/* Price + Flash Sale */}
                                    <div className="mt-5">
                                        <p className="text-3xl font-extrabold text-indigo-600">
                                            RM {product_info.product_price}
                                        </p>
                                        <p className="text-sm line-through text-gray-400">
                                            RM 950
                                        </p>
                                        {timeLeft > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <Zap className="w-4 h-4 text-red-500" />
                                                <span className="text-sm text-red-500 font-semibold">
                                                    Flash Sale ends in{" "}
                                                    {formatTime(timeLeft)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vouchers */}
                                    <div className="mt-6">
                                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                            <TicketPercent className="w-4 h-4 text-indigo-500" />
                                            Claimable Vouchers
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {vouchers.map((v) => (
                                                <button
                                                    key={v.id}
                                                    className="bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs px-3 py-1 rounded-full hover:bg-indigo-100 transition"
                                                    onClick={() =>
                                                        alert(
                                                            `Voucher ${v.code} claimed!`
                                                        )
                                                    }
                                                >
                                                    {v.desc}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="flex gap-4 mt-6">
                                    <button className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
                                        <ShoppingCart size={20} /> Add to Cart
                                    </button>
                                    <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                                        <MessageCircle size={20} /> Chat Seller
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
                            <div className="flex gap-6 border-b pb-2">
                                {[
                                    "description",
                                    "additional",
                                    "vendor",
                                    "reviews",
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`capitalize font-medium ${
                                            activeTab === tab
                                                ? "text-indigo-600 border-b-2 border-indigo-600"
                                                : "text-gray-500"
                                        } pb-2`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 text-gray-600">
                                {activeTab === "description" && (
                                    <div>
                                        <p>
                                            {product_info.product_description}
                                        </p>
                                        <h3 className="font-semibold mt-6">
                                            Packaging & Delivery
                                        </h3>
                                        <p className="text-sm mt-2">
                                            Your product will be packed securely
                                            and shipped within 2–3 working days.
                                        </p>

                                        <h3 className="font-semibold mt-6">
                                            Suggested Use
                                        </h3>
                                        <p className="text-sm mt-2">
                                            Refrigeration not necessary. Stir
                                            before serving.
                                        </p>

                                        <h3 className="font-semibold mt-6 text-red-500">
                                            Warning
                                        </h3>
                                        <p className="text-sm mt-2">
                                            Oil separation occurs naturally. May
                                            contain pieces of shell.
                                        </p>
                                    </div>
                                )}
                                {activeTab === "additional" && (
                                    <p>
                                        Additional product information goes
                                        here...
                                    </p>
                                )}
                                {activeTab === "vendor" && (
                                    <div className="space-y-3">
                                        <p>
                                            <strong>Seller:</strong>{" "}
                                            {product_info.seller_name}
                                        </p>
                                        <p>
                                            <strong>Location:</strong> Kuala
                                            Lumpur, Malaysia
                                        </p>
                                        <div className="flex gap-4 mt-3 text-sm text-gray-700">
                                            <span className="flex items-center gap-1">
                                                <ShieldCheck
                                                    size={16}
                                                    className="text-green-500"
                                                />{" "}
                                                100% Authentic
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Truck
                                                    size={16}
                                                    className="text-indigo-500"
                                                />{" "}
                                                Fast Delivery
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <RefreshCcw
                                                    size={16}
                                                    className="text-orange-500"
                                                />{" "}
                                                Free Returns
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Store
                                                    size={16}
                                                    className="text-purple-500"
                                                />{" "}
                                                Official Store
                                            </span>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "reviews" && (
                                    <p>User reviews and ratings...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Related Products */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-5">
                        <h2 className="text-lg font-semibold mb-3">
                            Related Products
                        </h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((id) => (
                                <div
                                    key={id}
                                    className="bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                                >
                                    <img
                                        src="/images/item1.jpg"
                                        alt="Related"
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <p className="mt-2 font-medium text-gray-800">
                                        Item {id}
                                    </p>
                                    <p className="text-indigo-600 font-bold">
                                        RM {id * 100}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
