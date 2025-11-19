import {
    FaSearch,
    FaCamera,
    FaRecycle,
    FaStore,
    FaShoppingBag,
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
    Watch,
    Laptop,
    Baby,
    Book,
    Dumbbell,
    Heart,
    Palette,
    Car,
    Recycle,
    Sofa,
    Boxes,
    Gem,
} from "lucide-react";

import { FaSpinner } from "react-icons/fa";

import { useState, useEffect, useRef } from "react";

import { Link, usePage } from "@inertiajs/react";

import axios from "axios";

import Swal from "sweetalert2";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";

import { Carousel_ProductData } from "@/Components/BuyerPage/HomePage/Carousel_ProductData";
import { SellerRegisterSuccess } from "@/Components/BuyerPage/HomePage/SellerRegisterSuccess";
import { CameraSearchModal } from "@/Components/BuyerPage/HomePage/CameraSearchModal";
import { NoFeaturedProducts } from "@/Components/BuyerPage/HomePage/NoFeaturedProducts";
import { FeaturedProductsLoading } from "@/Components/BuyerPage/HomePage/FeaturedProductsLoading";
import { FeaturedProductCard } from "@/Components/BuyerPage/HomePage/FeaturedProductCard";

export default function HomePage({ list_shoppingItem, list_categoryItem }) {
    const categoryIcons = {
        "Clothing & Accessories": <Shirt className="w-6 h-6 text-green-600" />,
        "Electronics & Gadgets": <Laptop className="w-6 h-6 text-blue-600" />,
        "Home & Furniture": <Sofa className="w-6 h-6 text-yellow-600" />,
        "Baby & Kids": <Baby className="w-6 h-6 text-pink-600" />,
        "Books & Stationery": <Book className="w-6 h-6 text-purple-600" />,
        "Sports & Outdoors": <Dumbbell className="w-6 h-6 text-orange-600" />,
        "Beauty & Self-Care": <Heart className="w-6 h-6 text-rose-500" />,
        "Art & Collectibles": <Palette className="w-6 h-6 text-indigo-600" />,
        "Jewelry & Watches": <Gem className="w-6 h-6 text-teal-600" />,
        "Vehicles & Bikes": <Car className="w-6 h-6 text-gray-600" />,
        "Eco-Friendly Items": <Recycle className="w-6 h-6 text-green-500" />,
        Others: <Watch className="w-6 h-6 text-gray-400" />,
    };

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [flashSaleProducts, setFlashSaleProducts] = useState([]);

    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [loadingFlashSale, setLoadingFlashSale] = useState(true);

    // Add these new states for camera search
    const [cameraSearchOpen, setCameraSearchOpen] = useState(false);
    const [cameraSearchResults, setCameraSearchResults] = useState([]);
    const [cameraSearchLoading, setCameraSearchLoading] = useState(false);
    const [searchImage, setSearchImage] = useState(null);

    // Carousel state
    const [currentSlide, setCurrentSlide] = useState(0);

    const { flash } = usePage().props;

    const featured_products = featuredProducts.slice(0, 8);

    const fileInputRef = useRef(null);

    // Updated camera search handler
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Set the search image for preview
        setSearchImage(file);

        // Show loading modal
        setCameraSearchLoading(true);
        setCameraSearchOpen(true);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post(
                route("camera-search"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setCameraSearchResults(response.data || []);
        } catch (error) {
            console.error("Camera search failed:", error);
            setCameraSearchResults([]);
        } finally {
            setCameraSearchLoading(false);
        }
    };

    const handleCameraClick = () => {
        fileInputRef.current.click();
    };

    const closeCameraSearch = () => {
        setCameraSearchOpen(false);
        setCameraSearchResults([]);
        setCameraSearchLoading(false);
        setSearchImage(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // get the featured products data
    const get_featuredProducts = async () => {
        try {
            setLoadingFeatured(true);
            const response = await axios.get(route("get-featured-products"));

            setFeaturedProducts(response.data.featured_products || []);
        } catch (error) {
            console.log(error);
            setFeaturedProducts([]);
        } finally {
            setLoadingFeatured(false);
        }
    };

    // get the flash sale products data
    const get_flashSaleProducts = async () => {
        try {
            setLoadingFlashSale(true);
            const response = await axios.get(route("get-flash-sale-products"));

            setFlashSaleProducts(response.data.flashSaleProducts || []);
        } catch (error) {
            console.log(error);
            setFlashSaleProducts([]);
        } finally {
            setLoadingFlashSale(false);
        }
    };

    const save_wishlist = async (product_id, variant_id = null) => {
        try {
            const response = await axios.post(route("store-wishlist"), {
                product_id: product_id,
                variant_id: variant_id,
            });

            Swal.fire({
                icon: "success",
                title: "Added to Wishlist",
                text:
                    response.data.message ||
                    "This item has been added to your wishlist.",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(
                "Error saving wishlist:",
                error.response?.data || error
            );

            Swal.fire({
                icon: "error",
                title: "Failed",
                text:
                    error.response?.data?.message ||
                    "Unable to add to wishlist.",
            });
        }
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

    // listen to the success message after user register as seller success
    useEffect(() => {
        if (flash.successMessage) {
            setIsOpen(true);
        }
    }, [flash.successMessage]);

    // call the api functions
    useEffect(() => {
        get_featuredProducts();
        get_flashSaleProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Modal for displaying the success register message for users */}
            <SellerRegisterSuccess isOpen={isOpen} setIsOpen={setIsOpen} />
            <CameraSearchModal
                isOpen={cameraSearchOpen}
                onClose={closeCameraSearch}
                searchResults={cameraSearchResults}
                isLoading={cameraSearchLoading}
                searchImage={searchImage}
                save_wishlist={save_wishlist}
            />

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
                                <button
                                    onClick={handleCameraClick}
                                    disabled={cameraSearchLoading}
                                    className={`px-6 py-4 rounded-full flex items-center justify-center gap-2 transition-colors ${
                                        cameraSearchLoading
                                            ? "bg-gray-400 cursor-not-allowed text-white"
                                            : "bg-gray-800 hover:bg-gray-900 text-white"
                                    }`}
                                >
                                    {cameraSearchLoading ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaCamera />
                                    )}
                                    {cameraSearchLoading
                                        ? "Searching..."
                                        : "Camera Search"}
                                </button>

                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
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
                                            src="/image/user1.jpg"
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
                                <div
                                    key={category.category_id}
                                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                                        selectedCategory ===
                                        category.category_name
                                            ? "border-green-500 bg-green-50 shadow-md"
                                            : "border-gray-200 bg-white hover:shadow-sm"
                                    }`}
                                >
                                    <span className="mb-2">
                                        {categoryIcons[
                                            category.category_name
                                        ] || (
                                            <Boxes className="w-6 h-6 text-gray-400" />
                                        )}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 text-center">
                                        {category.category_name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Product Carousel */}
                <section className="py-12 bg-gray-50 px-4">
                    <div className="max-w-7xl mx-auto">
                        {loadingFlashSale ? (
                            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-64 mx-auto mb-6"></div>
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ) : flashSaleProducts &&
                          flashSaleProducts.length > 0 ? (
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
                            <Link
                                href={route("shopping")}
                                className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium mt-3 md:mt-0"
                            >
                                View all{" "}
                                <FaArrowRight className="ml-1 text-xs" />
                            </Link>
                        </div>

                        {/* Loading State */}
                        {loadingFeatured && <FeaturedProductsLoading />}

                        {/* No Featured Products State */}
                        {!loadingFeatured && featuredProducts.length === 0 && (
                            <NoFeaturedProducts />
                        )}

                        {/* Featured Products Grid - Desktop */}
                        {!loadingFeatured && featuredProducts.length > 0 && (
                            <>
                                {/* Desktop Grid View */}
                                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {featured_products.map((product) => (
                                        <FeaturedProductCard
                                            key={product.product_id}
                                            product={product}
                                            isFlashSale={false}
                                            save_wishlist={save_wishlist}
                                        />
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
                                            {featured_products.map(
                                                (product) => (
                                                    <div
                                                        key={product.product_id}
                                                        className="w-full flex-shrink-0 px-3"
                                                    >
                                                        <FeaturedProductCard
                                                            product={product}
                                                            isFlashSale={false}
                                                            save_wishlist={
                                                                save_wishlist
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Carousel Navigation */}
                                    <button
                                        onClick={prevSlide}
                                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all backdrop-blur-sm"
                                    >
                                        <FaChevronLeft className="text-gray-700 w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all backdrop-blur-sm"
                                    >
                                        <FaChevronRight className="text-gray-700 w-4 h-4" />
                                    </button>

                                    {/* Carousel Indicators */}
                                    <div className="flex justify-center mt-6 space-x-2">
                                        {Array.from({
                                            length: Math.ceil(
                                                featured_products.length / 1
                                            ), // 1 item per slide on mobile
                                        }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() =>
                                                    setCurrentSlide(index)
                                                }
                                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                    index === currentSlide
                                                        ? "bg-gradient-to-r from-gray-900 to-gray-800 w-8"
                                                        : "bg-gray-300 hover:bg-gray-400"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
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
                                    avatar: "/image/user1.jpg",
                                },
                                {
                                    name: "Alex T.",
                                    role: "Electronics Seller",
                                    text: "As a tech enthusiast, I love finding old gadgets new homes. This platform makes it easy to connect with buyers.",
                                    avatar: "/image/user2.jpg",
                                },
                                {
                                    name: "Sarah L.",
                                    role: "Home Decor Buyer",
                                    text: "I've furnished my entire apartment with unique finds from Relove. Sustainable, affordable, and stylish!",
                                    avatar: "/image/user3.jpg",
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
