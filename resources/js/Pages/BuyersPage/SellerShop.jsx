import React, { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import {
    FaSearch,
    FaTag,
    FaBolt,
    FaStar,
    FaShoppingBag,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";

export default function SellerShop() {
    // --- Mock data (replace with server data) ---
    const seller = {
        profileImage: "/images/seller-profile.jpg",
        bannerImage: "/images/shop-banner.jpg",
        shopName: "Gemilang Store",
        shopDescription: "Your one-stop store for fashion, electronics & more!",
        address: "12 Jalan Bukit, Kuala Lumpur, Malaysia",
        totalSales: 342,
        rating: 4.6,
        joinDate: "Jan 2024",
        promotions: [
            {
                id: 1,
                title: "Flash Sale",
                discount: "Up to 50% Off",
                image: "/images/promo/flashsale.jpg",
                endsIn: "02:15:33",
            },
            {
                id: 2,
                title: "New Arrivals",
                discount: "Latest Trends In Store",
                image: "/images/promo/new.jpg",
            },
        ],
        products: [
            {
                id: 1,
                name: "Wireless Headphones",
                price: 129.99,
                image: "/images/products/headphones.jpg",
                stock: 10,
                status: "In Stock",
                category: "Electronics",
                rating: 4.5,
                sold: 120,
            },
            {
                id: 2,
                name: "Stylish T-Shirt",
                price: 49.99,
                image: "/images/products/tshirt.jpg",
                stock: 0,
                status: "Out of Stock",
                category: "Fashion",
                rating: 4.2,
                sold: 80,
            },
            {
                id: 3,
                name: "Smart Watch",
                price: 229.99,
                image: "/images/products/watch.jpg",
                stock: 5,
                status: "In Stock",
                category: "Electronics",
                rating: 4.7,
                sold: 210,
            },
            {
                id: 4,
                name: "Denim Jacket",
                price: 159.0,
                image: "/image/items/fashion2.jpg",
                stock: 3,
                status: "In Stock",
                category: "Fashion",
                rating: 4.4,
                sold: 64,
            },
            {
                id: 5,
                name: "Table Lamp",
                price: 79.5,
                image: "/image/items/home3.jpg",
                stock: 14,
                status: "In Stock",
                category: "Home",
                rating: 4.1,
                sold: 33,
            },
            {
                id: 6,
                name: "Bluetooth Speaker",
                price: 99.0,
                image: "/image/items/electronics1.jpg",
                stock: 8,
                status: "In Stock",
                category: "Electronics",
                rating: 4.6,
                sold: 152,
            },
            {
                id: 7,
                name: "Novel Book",
                price: 19.9,
                image: "/image/items/book1.jpg",
                stock: 20,
                status: "In Stock",
                category: "Books",
                rating: 4.0,
                sold: 41,
            },
            {
                id: 8,
                name: "Wall Painting",
                price: 129.0,
                image: "/image/items/home2.jpg",
                stock: 1,
                status: "In Stock",
                category: "Home",
                rating: 4.3,
                sold: 12,
            },
            {
                id: 9,
                name: "Sneakers",
                price: 199.0,
                image: "/image/items/fashion3.jpg",
                stock: 0,
                status: "Out of Stock",
                category: "Fashion",
                rating: 4.5,
                sold: 88,
            },
        ],
    };

    // --- UI State (Home-like filters/controls) ---
    const categories = useMemo(
        () => ["All", "Electronics", "Fashion", "Home", "Books"],
        []
    );
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [query, setQuery] = useState("");
    const [sort, setSort] = useState("latest"); // latest | price-asc | price-desc | best-selling | rating
    const [page, setPage] = useState(1);
    const pageSize = 9;

    // --- Derived product list ---
    const filtered = useMemo(() => {
        let list = [...seller.products];

        // category
        if (selectedCategory !== "All") {
            list = list.filter(
                (p) =>
                    p.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }
        // search
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q)
            );
        }
        // sort
        switch (sort) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "best-selling":
                list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
                break;
            case "rating":
                list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            // "latest" fallback: keep original order (assumed latest first from backend)
            default:
                break;
        }
        return list;
    }, [seller.products, selectedCategory, query, sort]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paged = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page]);

    // Reset page when filters change
    React.useEffect(() => setPage(1), [selectedCategory, query, sort]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            {/* ===== Banner (keep your existing banner; shown here for continuity) ===== */}
            <div
                className="relative h-80 md:h-[22rem] bg-cover bg-center"
                style={{ backgroundImage: `url(${seller.bannerImage})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={seller.profileImage}
                        alt="Seller"
                        className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {seller.shopName}
                        </h1>
                        <p className="mt-1 text-gray-600">
                            {seller.shopDescription}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-2">
                                <FaStar className="text-yellow-400" />{" "}
                                {seller.rating} / 5
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <FaShoppingBag className="text-blue-600" />{" "}
                                {seller.totalSales} Sales
                            </span>
                            <span>Joined {seller.joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Controls (Home-like search + pills + sort) ===== */}
            <section className="px-20 mt-8">
                {/* Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* ===== Flash Deals ribbon (optional) ===== */}
                    {seller.promotions?.length > 0 && (
                        <section className="mt-8">
                            <div className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-4 md:p-5 flex flex-col md:flex-row items-center justify-between shadow">
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20">
                                        <FaBolt />
                                    </span>
                                    <div>
                                        <p className="text-sm uppercase tracking-wide/relaxed opacity-90">
                                            Flash Deals
                                        </p>
                                        <h3 className="text-lg font-semibold">
                                            Save big today • Limited time
                                        </h3>
                                    </div>
                                </div>
                                <div className="mt-3 md:mt-0 text-sm opacity-90">
                                    Ends in{" "}
                                    <span className="font-semibold">
                                        02:15:33
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Sort</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="px-3 py-2 text-sm rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest">Latest</option>
                            <option value="price-asc">
                                Price: Low to High
                            </option>
                            <option value="price-desc">
                                Price: High to Low
                            </option>
                            <option value="best-selling">Best Selling</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* ===== Content (Products + Sidebar trust card) ===== */}
            <section className="px-20 mt-8 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left: Products */}
                    <div className="lg:col-span-3">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-black flex items-center gap-2">
                                <FaTag className="text-blue-600" /> Products
                            </h2>
                            <span className="text-sm text-gray-500">
                                {filtered.length} items
                            </span>
                        </div>

                        {/* Grid */}
                        {paged.length === 0 ? (
                            <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center text-gray-500">
                                No products match your filters yet.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {paged.map((product) => (
                                    <article
                                        key={product.id}
                                        className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden group hover:shadow-lg transition"
                                    >
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Status badge */}
                                            <span
                                                className={`absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-full ${
                                                    product.status ===
                                                    "In Stock"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {product.status}
                                            </span>
                                            {/* “Best seller / New” micro-badges (sample logic) */}
                                            {product.sold > 100 && (
                                                <span className="absolute top-3 right-3 text-[11px] font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                                    Best Seller
                                                </span>
                                            )}
                                        </div>

                                        <div className="p-4">
                                            <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                <FaStar className="text-yellow-400" />
                                                <span>
                                                    {product.rating?.toFixed(
                                                        1
                                                    ) ?? "4.0"}
                                                </span>
                                                <span>•</span>
                                                <span>{product.sold} sold</span>
                                            </div>

                                            <div className="mt-2 flex items-end justify-between">
                                                <p className="text-blue-600 font-bold">
                                                    RM{" "}
                                                    {product.price.toFixed(2)}
                                                </p>
                                                <Link
                                                    href={`/product/${product.product_id}`}
                                                    className="text-sm px-3 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                                    disabled={page === 1}
                                >
                                    <FaChevronLeft /> Prev
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page
                                    <span className="font-semibold">
                                        {page}
                                    </span>
                                    of
                                    <span className="font-semibold">
                                        {totalPages}
                                    </span>
                                </span>
                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-40"
                                    disabled={page === totalPages}
                                >
                                    Next <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Trust / Shop info card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    About this shop
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                            Rating
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-medium">
                                            <FaStar className="text-yellow-400" />{" "}
                                            {seller.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                            Total Sales
                                        </span>
                                        <span className="font-medium">
                                            {seller.totalSales}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">
                                            Joined
                                        </span>
                                        <span className="font-medium">
                                            {seller.joinDate}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href="#contact-seller"
                                    className="mt-4 inline-flex w-full justify-center rounded-full bg-blue-600 text-white text-sm py-2.5 hover:bg-blue-700 transition"
                                >
                                    Contact Seller
                                </Link>
                            </div>

                            {/* Small promo cards (optional) */}
                            {seller.promotions?.slice(0, 1).map((promo) => (
                                <div
                                    key={promo.id}
                                    className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                                >
                                    <img
                                        src={promo.image}
                                        alt={promo.title}
                                        className="w-full h-28 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 text-white p-3 flex flex-col justify-end">
                                        <p className="text-xs uppercase opacity-90">
                                            Special Offer
                                        </p>
                                        <h4 className="text-sm font-semibold">
                                            {promo.title}
                                        </h4>
                                        <p className="text-[12px] opacity-90">
                                            {promo.discount}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            <Footer />
        </div>
    );
}
