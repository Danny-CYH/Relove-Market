import React from "react";
import {
    Star,
    MessageCircle,
    ShoppingCart,
    Heart,
    ThumbsUp,
    ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";
import { usePage } from "@inertiajs/react";

export default function ItemDetails() {
    const relatedProducts = [
        {
            id: 1,
            name: "Wireless Earbuds",
            price: 120,
            img: "/images/item1.jpg",
        },
        { id: 2, name: "Smart Watch", price: 250, img: "/images/item2.jpg" },
        {
            id: 3,
            name: "Bluetooth Speaker",
            price: 99,
            img: "/images/item3.jpg",
        },
    ];

    const { props } = usePage();
    console.log(props.product_info);

    const product_info = props.product_info[0];

    return (
        <div>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="container mx-auto px-4 lg:px-12 space-y-12">
                    {/* Product Hero Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* Left - Gallery */}
                        <div className="p-6">
                            <img
                                src={`/storage/${product_info.product_image[0].image_path}`}
                                alt="Product"
                                className="rounded-2xl w-full h-[420px] object-cover shadow-md"
                            />
                            <div className="flex gap-3 mt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <img
                                        key={i}
                                        src={`/images/thumb${i}.jpg`}
                                        alt={`Thumbnail ${i}`}
                                        className="w-20 h-20 object-cover rounded-xl border border-gray-200 hover:border-indigo-500 cursor-pointer transition"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right - Info */}
                        <div className="flex flex-col justify-between p-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {product_info.product_name}
                                </h1>
                                <div className="flex items-center mt-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                        />
                                    ))}
                                    <span className="ml-2 text-gray-600 text-sm">
                                        124 reviews
                                    </span>
                                </div>
                                <p className="text-2xl font-extrabold text-indigo-600 mt-5">
                                    RM {product_info.product_price}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Stock: {product_info.product_quantity}{" "}
                                    available
                                </p>
                                <p className="text-gray-600 mt-5 leading-relaxed">
                                    Experience superior sound quality with these
                                    wireless earbuds, featuring active noise
                                    cancellation and 30-hour battery life.
                                </p>

                                {/* Tags */}
                                <div className="mt-5 flex gap-2 flex-wrap">
                                    <span className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full">
                                        🎧 Electronics
                                    </span>
                                    <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full">
                                        ✅ Used - Like New
                                    </span>
                                </div>

                                {/* Likes */}
                                <div className="flex items-center gap-2 mt-5 text-sm text-gray-600">
                                    <ThumbsUp className="w-4 h-4 text-blue-500" />
                                    52 people liked this item
                                </div>

                                <div className="flex items-center gap-5 mt-8">
                                    <img
                                        src="/images/seller-avatar.jpg"
                                        alt="Seller"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            John’s Tech Store
                                        </h3>
                                        <p className="text-gray-500 text-sm flex items-center gap-2">
                                            🌟 Trusted Seller • 4.8/5
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex gap-4 mt-8">
                                <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow hover:from-indigo-700 hover:to-purple-700 transition">
                                    <ShoppingCart size={20} /> Add to Cart
                                </button>
                                <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                                    <MessageCircle size={20} /> Chat with Seller
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Details, Reviews & Related */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Product Details & Reviews */}
                        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md space-y-8">
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                    Product Details
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    Built with high-quality materials, these
                                    earbuds ensure comfort and durability. They
                                    are compatible with all major devices,
                                    feature Bluetooth 5.2, and include a 1-year
                                    warranty.
                                </p>
                                <div className="flex items-center gap-2 mt-4 text-green-600 text-sm font-medium">
                                    <ShieldCheck className="w-4 h-4" /> Buyer
                                    Protection Guarantee
                                </div>
                            </section>

                            {/* Reviews */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                    Buyer Reviews
                                </h2>
                                <div className="space-y-6">
                                    <div className="border-b pb-4">
                                        <p className="font-semibold text-gray-700">
                                            John Doe
                                        </p>
                                        <div className="flex items-center mt-1">
                                            {[...Array(4)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                            <Star className="w-4 h-4 text-gray-300" />
                                        </div>
                                        <p className="text-gray-600 mt-2">
                                            Great sound and battery life,
                                            totally worth it!
                                        </p>
                                    </div>
                                </div>

                                {/* Review Form */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Leave a Review
                                    </h3>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-xl p-3 mt-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        placeholder="Share your experience..."
                                    ></textarea>
                                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl mt-3 hover:bg-indigo-700 transition">
                                        Submit Review
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Related Products */}
                        <aside>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Related Products
                            </h2>
                            <div className="grid gap-5">
                                {relatedProducts.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                                    >
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            className="w-full h-36 object-cover rounded-lg"
                                        />
                                        <p className="mt-3 font-medium text-gray-800 line-clamp-1">
                                            {item.name}
                                        </p>
                                        <p className="text-indigo-600 font-bold">
                                            RM {item.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            <Footer />

            {/* Sticky Mobile Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between lg:hidden">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 w-1/2 mr-2">
                    <ShoppingCart size={20} /> Add to Cart
                </button>
                <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl flex items-center gap-2 w-1/2">
                    <MessageCircle size={20} /> Chat
                </button>
            </div>
        </div>
    );
}
