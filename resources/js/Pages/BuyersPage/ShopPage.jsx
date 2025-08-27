import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

import { Search, ChevronLeft, ChevronRight } from "lucide-react";

import { useState, useEffect } from "react";

import { usePage, Link } from "@inertiajs/react";

export default function ShopPage() {
    const promotions = [
        {
            title: "Mega Sale - Up to 50% Off!",
            description:
                "Grab your favorite preloved items before the deal ends.",
            image: "../image/promo1.jpg",
            cta: "Shop Now",
        },
        {
            title: "Buy 1 Get 1 Free 🎉",
            description:
                "Limited time only – double the value for the same price.",
            image: "../image/promo2.jpg",
            cta: "Grab the Deal",
        },
        {
            title: "Flash Deal",
            description: "Exclusive discounts available for the next 24 hours.",
            image: "../image/promo3.jpg",
            cta: "View Deals",
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; // <-- Replace with backend data later

    const { props } = usePage();

    const list_shoppingItem = props.list_shoppingItem;
    const list_categoryItem = props.list_categoryItem;

    const [current, setCurrent] = useState(0);

    // Auto-rotate every 5s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % promotions.length);
        }, 10000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />

            <div className="relative w-full h-[18rem] overflow-hidden bg-gray-900 shadow-lg">
                {/* Slides */}
                {promotions.map((promo, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            index === current ? "opacity-100 z-10" : "opacity-0"
                        }`}
                        style={{
                            backgroundImage: `url(${promo.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60" />

                        {/* Content */}
                        <div className="relative w-full z-20 flex flex-col items-center justify-center min-h-72 text-center text-white px-6">
                            <h2 className="text-3xl text-center md:text-5xl font-bold mb-4 drop-shadow-lg">
                                {promo.title}
                            </h2>
                            <p className="text-base text-center md:text-lg text-gray-200 max-w-xl mb-6">
                                {promo.description}
                            </p>
                            <button className="bg-indigo-600 hover:bg-indigo-700 items-center px-6 py-3 rounded-full text-sm md:text-base font-medium shadow-md transition">
                                {promo.cta}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Navigation */}
                <button
                    onClick={() =>
                        setCurrent(
                            (prev) =>
                                (prev - 1 + promotions.length) %
                                promotions.length
                        )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white z-30"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                    onClick={() =>
                        setCurrent((prev) => (prev + 1) % promotions.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white z-30"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                    {promotions.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                                idx === current
                                    ? "bg-indigo-500"
                                    : "bg-gray-400"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <main className="flex flex-col lg:flex-row gap-8 p-6 md:px-20 mt-10 flex-grow">
                {/* Sidebar Filters */}
                <aside className="lg:w-1/4 bg-white rounded-2xl shadow-md p-6 sticky top-24 h-fit border border-gray-100">
                    <div className="flex items-center justify-between mb-6 border-b pb-3">
                        <h3 className="text-lg font-semibold">Filters</h3>
                        <button className="text-sm text-indigo-600 hover:underline">
                            Reset
                        </button>
                    </div>

                    <div className="space-y-8 text-sm">
                        {/* Category */}
                        <div>
                            <h4 className="font-semibold mb-3">Category</h4>
                            <div className="flex flex-wrap gap-2">
                                {list_categoryItem.map((category, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-1.5 border border-gray-300 rounded-full text-xs md:text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-600 transition"
                                    >
                                        {category.category_name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h4 className="font-semibold mb-3">Price Range</h4>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    placeholder="Min"
                                    className="input input-bordered input-sm w-1/2 bg-white"
                                />
                                <span>-</span>
                                <input
                                    type="text"
                                    placeholder="Max"
                                    className="input input-bordered input-sm w-1/2 bg-white"
                                />
                            </div>
                        </div>

                        {/* Condition */}
                        <div>
                            <h4 className="font-semibold mb-3">Condition</h4>
                            <div className="space-y-2">
                                {["New", "Like New", "Used", "Vintage"].map(
                                    (cond) => (
                                        <label
                                            key={cond}
                                            className="flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer hover:border-indigo-400 transition"
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm checkbox-primary"
                                            />
                                            <span>{cond}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h4 className="font-semibold mb-3">Location</h4>
                            <select className="select select-bordered w-full bg-white">
                                <option>All</option>
                                <option>Kuala Lumpur</option>
                                <option>Penang</option>
                                <option>Johor</option>
                                <option>Selangor</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="btn btn-primary w-full rounded-full">
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Products Section */}
                <section className="lg:w-3/4">
                    {/* Search + Sort */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
                        <div className="flex items-center w-full md:w-1/2 bg-white border rounded-full px-4 py-2 shadow-sm">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full border-none outline-none px-2 text-sm"
                            />
                        </div>
                        <select className="border rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500">
                            <option>Sort by: Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest</option>
                            <option>Popular</option>
                        </select>
                    </div>

                    <h2 className="text-lg md:text-xl font-bold mb-4">
                        Recommended For You
                    </h2>

                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {list_shoppingItem.data.map((item) => (
                            <div
                                key={item.product_id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 group cursor-pointer flex flex-col overflow-hidden"
                            >
                                <Link
                                    href={`/item-details/${item.product_id}`}
                                    className="flex flex-col flex-1"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-56 bg-gray-50 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={`/storage/${item.product_image[0].image_path}`}
                                            alt={item.product_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow">
                                            Featured
                                        </span>
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col p-4">
                                        <h3 className="font-semibold text-md md:text-lg mb-1 line-clamp-1 group-hover:text-indigo-600 transition">
                                            {item.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {item.product_description}
                                        </p>

                                        {/* Price + Location */}
                                        <div className="mt-auto">
                                            <div className="flex justify-between items-center">
                                                <span className="text-indigo-600 font-bold text-lg">
                                                    RM {item.product_price}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    📍 KL, Malaysia
                                                </span>
                                            </div>

                                            {/* Category & Rating */}
                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                                    {
                                                        item.category
                                                            .category_name
                                                    }
                                                </span>
                                                {/* Placeholder for rating stars */}
                                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                                    ⭐⭐⭐⭐☆
                                                </div>
                                            </div>

                                            {/* Button */}
                                            <button className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm py-2 rounded-full hover:from-indigo-700 hover:to-purple-700 transition">
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-2 mt-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 rounded-full text-sm ${
                                    currentPage === index + 1
                                        ? "bg-indigo-600 text-white"
                                        : "border hover:bg-gray-100"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
