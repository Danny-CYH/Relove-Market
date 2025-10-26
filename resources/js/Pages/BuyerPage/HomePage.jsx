import {
    FaSearch,
    FaCamera,
    FaRecycle,
    FaStore,
    FaShoppingBag,
    FaHeart,
    FaShoppingCart,
    FaArrowRight,
    FaLeaf,
    FaShieldAlt,
    FaTags,
    FaStar,
    FaExclamationTriangle,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

import {
    Shirt,
    Laptop,
    Home,
    Baby,
    Book,
    Dumbbell,
    Heart,
    ToyBrick,
    Car,
    Boxes,
} from "lucide-react";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/footer";

import { Carousel_ProductData } from "@/Components/BuyerPage/HomePage/Carousel_ProductData";
import { SellerRegisterSuccess } from "@/Components/BuyerPage/HomePage/SellerRegisterSuccess";

import { useState, useEffect } from "react";

import { Link, usePage } from "@inertiajs/react";

import axios from "axios";

export default function HomePage({ list_shoppingItem, list_categoryItem }) {
    const categoryIcons = {
        "Fashion & Accessories": <Shirt className="w-6 h-6 text-green-600" />,
        "Electronics & Gadgets": <Laptop className="w-6 h-6 text-blue-600" />,
        "Home & Living": <Home className="w-6 h-6 text-yellow-600" />,
        "Baby & Kids": <Baby className="w-6 h-6 text-pink-600" />,
        "Books & Stationery": <Book className="w-6 h-6 text-purple-600" />,
        "Sports & Outdoors": <Dumbbell className="w-6 h-6 text-red-600" />,
        "Beauty & Personal Care": <Heart className="w-6 h-6 text-pink-500" />,
        "Collectibles & Hobbies": (
            <ToyBrick className="w-6 h-6 text-orange-600" />
        ),
        Vehicles: <Car className="w-6 h-6 text-gray-600" />,
        Others: <Boxes className="w-6 h-6 text-gray-400" />,
    };

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);

    const { flash } = usePage().props;

    const featured_products = featuredProducts.slice(0, 8);

    const get_featuredProducts = async () => {
        const response = await axios.get("/api/buyer/get-featured-products");

        console.log(response);

        setFeaturedProducts(response.data.featured_products);
    };

    const get_flashSaleProducts = async () => {
        const response = await axios.get("/api/buyer/get-flash-sale-products");
        setFlashSaleProducts(response.data.flashSaleProducts);
    };

    // Handle search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.length > 1) {
            // Filter items based on search query
            const results = list_shoppingItem.filter(
                (product) =>
                    product.product_name
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                    product.category?.category_name
                        ?.toLowerCase()
                        .includes(query.toLowerCase())
            );
            setSearchResults(results);
            setShowSearchResults(true);
        } else {
            setShowSearchResults(false);
        }
    };

    // Carousel functions
    const nextSlide = () => {
        setCurrentSlide((prev) =>
            prev === Math.ceil(featured_products.length / 2) - 1 ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prev) =>
            prev === 0 ? Math.ceil(featured_products.length / 2) - 1 : prev - 1
        );
    };

    useEffect(() => {
        if (flash.successMessage) {
            setIsOpen(true);
        }
    }, [flash.successMessage]);

    useEffect(() => {
        get_featuredProducts();
        get_flashSaleProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Modal for displaying the success register message for users */}
            <SellerRegisterSuccess isOpen={isOpen} setIsOpen={setIsOpen} />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-16 md:py-24 px-4">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                <FaLeaf className="mr-2" /> Sustainable Shopping
                                Platform
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Give Items a{" "}
                                <span className="text-green-600">
                                    Second Life
                                </span>
                                , Shop Relove!
                            </h1>
                            <p className="text-lg text-gray-600 max-w-lg">
                                Discover unique pre-loved items while reducing
                                waste and saving money. Join our community of
                                eco-conscious shoppers today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-grow max-w-xl">
                                    <input
                                        type="text"
                                        placeholder="Search for any product..."
                                        className="text-black w-full px-6 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearch(e.target.value)
                                        }
                                        onFocus={() =>
                                            searchQuery.length > 1 &&
                                            setShowSearchResults(true)
                                        }
                                        onBlur={() =>
                                            setTimeout(
                                                () =>
                                                    setShowSearchResults(false),
                                                200
                                            )
                                        }
                                    />
                                    <button className="absolute right-3 top-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                                        <FaSearch className="text-lg" />
                                    </button>

                                    {/* Search Results Dropdown */}
                                    {showSearchResults && (
                                        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-80 overflow-y-auto">
                                            {searchResults.length > 0 ? (
                                                <div className="py-2">
                                                    {searchResults.map(
                                                        (product) => (
                                                            <Link
                                                                key={
                                                                    product.product_id
                                                                }
                                                                href={route(
                                                                    "product-details",
                                                                    product.product_id
                                                                )}
                                                                className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <img
                                                                    src={
                                                                        import.meta
                                                                            .env
                                                                            .VITE_BASE_URL +
                                                                        product
                                                                            .product_image[0]
                                                                            .image_path
                                                                    }
                                                                    alt={
                                                                        product.product_name
                                                                    }
                                                                    className="w-10 h-10 rounded-full object-cover mr-3"
                                                                />
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {
                                                                            product.product_name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            product
                                                                                .category
                                                                                .category_name
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <span className="ml-auto font-bold text-green-600">
                                                                    RM{" "}
                                                                    {
                                                                        product.product_price
                                                                    }
                                                                </span>
                                                            </Link>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="px-4 py-3 text-gray-500">
                                                    No results found for "
                                                    {searchQuery}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button className="px-6 py-4 bg-gray-800 text-white rounded-full flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                                    <FaCamera /> Camera Search
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <span className="text-gray-500 text-sm">
                                    Popular Searches:
                                </span>
                                <a
                                    href="#"
                                    className="text-sm text-gray-700 hover:text-green-600"
                                >
                                    Vintage jeans
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-gray-700 hover:text-green-600"
                                >
                                    Books
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-gray-700 hover:text-green-600"
                                >
                                    Electronics
                                </a>
                                <a
                                    href="#"
                                    className="text-sm text-gray-700 hover:text-green-600"
                                >
                                    Home decor
                                </a>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-white rounded-2xl shadow-xl p-2 transform rotate-2">
                                <img
                                    src="/image/home_page.jpg"
                                    alt="Sustainable shopping"
                                    className="rounded-xl w-full h-64 object-cover transform -rotate-2"
                                />
                            </div>
                            <div className="absolute -bottom-12 -left-2 md:-bottom-6 md:-left-6 bg-white rounded-xl shadow-lg p-4 w-60 md:w-60">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img
                                            src="/image/shania_yan.png"
                                            alt="User"
                                            className="h-10 w-10 rounded-full"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            Sarah M.
                                        </p>
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className="w-3 h-3 text-yellow-400 fill-current"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    "Found amazing vintage pieces here!"
                                </p>
                            </div>
                            <div className="absolute -top-10 -right-2 md:-top-6 md:-right-6 bg-green-600 text-white rounded-xl shadow-lg p-4 w-48">
                                <div className="flex items-center">
                                    <FaRecycle className="text-xl mr-2" />
                                    <span className="font-bold">1.2K+</span>
                                </div>
                                <p className="mt-1 text-xs">
                                    Items saved from landfill this month
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-12 bg-white px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 text-center">
                                Various Category Waiting For You To Discover
                            </h2>
                            <Link
                                href={route("shopping")}
                                className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium mt-3 md:mt-0"
                            >
                                View all categories{" "}
                                <FaArrowRight className="ml-1 text-xs" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {list_categoryItem.map((category) => (
                                <button
                                    key={category.category_id}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category.category_name
                                        )
                                    }
                                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                        selectedCategory ===
                                        category.category_name
                                            ? "border-green-500 bg-green-50 shadow-md"
                                            : "border-gray-200 hover:border-green-300 hover:shadow-sm"
                                    }`}
                                >
                                    <span className="mb-2">
                                        {categoryIcons[
                                            category.category_name
                                        ] || (
                                            <Boxes className="w-6 h-6 text-gray-400" />
                                        )}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">
                                        {category.category_name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Carousel */}
                <section className="py-12 bg-gray-50 px-4">
                    <div className="max-w-7xl mx-auto">
                        {flashSaleProducts ? (
                            <Carousel_ProductData
                                productData={flashSaleProducts}
                            />
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                <div className="flex justify-center mb-4">
                                    <FaExclamationTriangle className="text-4xl text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No Flash Sale Products Available
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    There are currently no products on flash
                                    sale. Check back later for amazing deals!
                                </p>
                                <Link
                                    href={route("shopping")}
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                                >
                                    Browse All Products
                                    <FaArrowRight className="ml-2 text-sm" />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-12 bg-white px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 text-center">
                                Recommended for You
                            </h2>
                            <a
                                href="#"
                                className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium mt-3 md:mt-0"
                            >
                                View all{" "}
                                <FaArrowRight className="ml-1 text-xs" />
                            </a>
                        </div>

                        {/* Desktop Grid View */}
                        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {featured_products.map((product) => (
                                <Link
                                    href={route(
                                        "product-details",
                                        product.product_id
                                    )}
                                    key={product.product_id}
                                >
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="relative">
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_BASE_URL +
                                                    product.product_image[0]
                                                        .image_path
                                                }
                                                alt={product.product_name}
                                                className="w-full h-56 object-cover"
                                            />
                                            <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                                {product.category.category_name}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                {product.product_name}
                                            </h3>

                                            <div className="flex items-center mb-2">
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <FaStar
                                                                key={star}
                                                                className={`w-3 h-3 ${
                                                                    star <=
                                                                    Math.floor(
                                                                        product
                                                                            .ratings[0]
                                                                            ?.rating
                                                                    )
                                                                        ? "text-yellow-400 fill-current"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 ml-1">
                                                    ({product.ratings[0]?.rating}
                                                    )
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div>
                                                    <span className="font-bold text-gray-900">
                                                        RM{" "}
                                                        {product.product_price}
                                                    </span>
                                                    <span className="text-xs text-gray-500 line-through ml-2">
                                                        {product.originalPrice}
                                                    </span>
                                                </div>
                                                <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                                                    <FaShoppingCart className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile Carousel View */}
                        <div className="md:hidden relative">
                            <div className="overflow-hidden rounded-xl">
                                <div
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{
                                        transform: `translateX(-${
                                            currentSlide * 100
                                        }%)`,
                                    }}
                                >
                                    {featured_products.map((product) => (
                                        <Link
                                            href={route(
                                                "product-details",
                                                product.product_id
                                            )}
                                            key={product.product_id}
                                        >
                                            <div className="w-full flex-shrink-0 px-2">
                                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                                    <div className="relative">
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_BASE_URL +
                                                                product
                                                                    .product_image[0]
                                                                    .image_path
                                                            }
                                                            alt={
                                                                product.product_name
                                                            }
                                                            className="w-full h-48 object-cover"
                                                        />

                                                        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                                            {
                                                                product.category
                                                                    .category_name
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                                            {
                                                                product.product_name
                                                            }
                                                        </h3>

                                                        <div className="flex items-center mb-2">
                                                            <div className="flex items-center">
                                                                {[
                                                                    1, 2, 3, 4,
                                                                    5,
                                                                ].map(
                                                                    (star) => (
                                                                        <FaStar
                                                                            key={
                                                                                star
                                                                            }
                                                                            className={`w-3 h-3 ${
                                                                                star <=
                                                                                Math.floor(
                                                                                    product
                                                                                        .ratings[0]
                                                                                        ?.rating
                                                                                )
                                                                                    ? "text-yellow-400 fill-current"
                                                                                    : "text-gray-300"
                                                                            }`}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500 ml-1">
                                                                (
                                                                {
                                                                    product
                                                                        .ratings[0]
                                                                        ?.rating
                                                                }
                                                                )
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-3">
                                                            <div>
                                                                <span className="font-bold text-gray-900">
                                                                    RM{" "}
                                                                    {
                                                                        product.product_price
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-gray-500 line-through ml-2">
                                                                    {
                                                                        product.originalPrice
                                                                    }
                                                                </span>
                                                            </div>
                                                            <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                                                                <FaShoppingCart className="text-sm" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Carousel Navigation */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            >
                                <FaChevronLeft className="text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                            >
                                <FaChevronRight className="text-gray-700" />
                            </button>

                            {/* Carousel Indicators */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({
                                    length: Math.ceil(featured_products.length),
                                }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${
                                            index === currentSlide
                                                ? "bg-green-600 w-4"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* BENEFITS */}
                <section className="py-16 bg-gray-50 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Why Choose Relove Market?
                            </h2>
                            <p className="text-gray-600">
                                We're revolutionizing the way people think about
                                secondhand shopping with a focus on
                                sustainability and community.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <FaRecycle className="text-3xl" />,
                                    title: "Eco-Friendly",
                                    text: "Reduce waste and extend product life by giving items a second home.",
                                    color: "text-green-600",
                                },
                                {
                                    icon: <FaShieldAlt className="text-3xl" />,
                                    title: "Trusted Sellers",
                                    text: "All sellers are verified to ensure safe and reliable transactions.",
                                    color: "text-blue-600",
                                },
                                {
                                    icon: <FaTags className="text-3xl" />,
                                    title: "Affordable Finds",
                                    text: "Discover unique items at fair prices without breaking the bank.",
                                    color: "text-purple-600",
                                },
                                {
                                    icon: <FaCamera className="text-3xl" />,
                                    title: "Smart Listing",
                                    text: "List items in seconds using our AI-powered image recognition.",
                                    color: "text-orange-600",
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                >
                                    <div
                                        className={`flex justify-center items-center w-14 h-14 rounded-xl bg-opacity-10 ${
                                            feature.color
                                        } ${feature.color.replace(
                                            "text",
                                            "bg"
                                        )} mb-4`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-semibold text-lg text-gray-900 mb-2">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        {feature.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="relative py-20 text-white text-center px-4 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('../image/seller_bg.jpg')`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-blue-900/90 backdrop-blur-sm"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Sell Your Preloved Items?
                        </h2>
                        <p className="text-lg md:text-xl mb-8 opacity-90">
                            Join thousands of sellers turning their pre-loved
                            items into earnings while promoting sustainable
                            consumption.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href={route("seller-registration")}
                                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition shadow-md hover:shadow-lg"
                            >
                                Become a Seller Today
                            </Link>
                            <Link
                                href={route("seller-benefit")}
                                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-700 transition"
                            >
                                How It Works
                            </Link>
                        </div>
                        <div className="mt-10 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                            <div>
                                <div className="text-3xl font-bold">10K+</div>
                                <div className="text-sm opacity-80">
                                    Active Sellers
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">50K+</div>
                                <div className="text-sm opacity-80">
                                    Listed Items
                                </div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold">98%</div>
                                <div className="text-sm opacity-80">
                                    Satisfied Users
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-16 bg-white px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                            Selling and buying pre-loved items has never been
                            easier with our simple process
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                                    <span className="text-xl font-bold">1</span>
                                </div>
                                <FaRecycle className="text-4xl text-green-600 mb-4 mx-auto" />
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                    List Your Items
                                </h4>
                                <p className="text-gray-600">
                                    Snap photos of your pre-loved items and
                                    create listings in minutes.
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                                    <span className="text-xl font-bold">2</span>
                                </div>
                                <FaStore className="text-4xl text-blue-600 mb-4 mx-auto" />
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                    Manage Your Store
                                </h4>
                                <p className="text-gray-600">
                                    Track sales, communicate with buyers, and
                                    manage your inventory.
                                </p>
                            </div>
                            <div className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                                    <span className="text-xl font-bold">3</span>
                                </div>
                                <FaShoppingBag className="text-4xl text-purple-600 mb-4 mx-auto" />
                                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                    Earn & Shop
                                </h4>
                                <p className="text-gray-600">
                                    Get paid securely and use your earnings to
                                    shop for other great finds.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 bg-gray-50 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            What Our Community Says
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Emma R.",
                                    role: "Seller & Buyer",
                                    text: "I've made over RM2,000 selling clothes I no longer wear. The process is so simple and the community is wonderful!",
                                    avatar: "/image/shania_yan.png",
                                },
                                {
                                    name: "Alex T.",
                                    role: "Electronics Seller",
                                    text: "As a tech enthusiast, I love finding old gadgets new homes. This platform makes it easy to connect with buyers.",
                                    avatar: "/image/shania_yan.png",
                                },
                                {
                                    name: "Sarah L.",
                                    role: "Home Decor Buyer",
                                    text: "I've furnished my entire apartment with unique finds from Relove. Sustainable, affordable, and stylish!",
                                    avatar: "/image/shania_yan.png",
                                },
                            ].map((testimonial, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="h-12 w-12 rounded-full"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-semibold text-gray-900">
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center mt-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className="w-4 h-4 text-yellow-400 fill-current"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
