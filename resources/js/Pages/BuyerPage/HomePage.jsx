import {
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
    FaSearch,
} from "react-icons/fa";

import {
    Shirt,
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
    CheckCircle,
    Clock,
} from "lucide-react";

import axios from "axios";

import { useState, useEffect, useRef } from "react";

import { Link, usePage } from "@inertiajs/react";

// Modal component for camera search results
import { CameraSearchModal } from "@/Components/BuyerPage/HomePage/CameraSearchModal";

// Component and functions for the flash sale products carousel
import { Carousel_ProductData } from "@/Components/BuyerPage/HomePage/Carousel_ProductData";
import { GetFlashSaleProducts } from "@/Components/HelperFunction/GetFlashSaleProduct";

// Additional UI components
import Carousel from "../../Components/Ui/Carousel";
import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";
import { Button } from "@/Components/Ui/Button";
import { Modal } from "@/Components/Ui/Modal";

// Helper Functions
import { SaveWishlist } from "@/Components/HelperFunction/SaveWishlist";
import { SearchablePickerModal } from "@/Components/Ui/SearchablePickerModal";
import { useFeaturedProducts } from "@/Components/HelperFunction/useFeaturedProducts";

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
    };

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isSuccessRegisterOpen, setIsSuccessRegisterOpen] = useState(false);

    const [flashSaleProducts, setFlashSaleProducts] = useState([]);

    const [loadingFlashSale, setLoadingFlashSale] = useState(true);

    // Add these new states for camera search
    const [cameraSearchOpen, setCameraSearchOpen] = useState(false);
    const [cameraSearchResults, setCameraSearchResults] = useState([]);
    const [cameraSearchLoading, setCameraSearchLoading] = useState(false);
    const [searchImage, setSearchImage] = useState(null);

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const fileInputRef = useRef(null);

    const { carouselProducts, loadingFeatured } = useFeaturedProducts();

    const { flash } = usePage().props;

    // Get the flash sale products data
    const get_flashSaleProducts = async () => {
        return await GetFlashSaleProducts(
            setLoadingFlashSale,
            setFlashSaleProducts,
        );
    };

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
                },
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

    // listen to the success message after user register as seller success
    useEffect(() => {
        if (flash.successMessage) {
            setIsSuccessRegisterOpen(true);
        }
    }, [flash.successMessage]);

    // call the api functions
    useEffect(() => {
        get_flashSaleProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Modal for displaying the success register message for users */}
            <Modal
                isOpen={isSuccessRegisterOpen}
                onClose={() => setIsSuccessRegisterOpen(false)}
                icon={<CheckCircle />}
                title="Seller Registration Received"
                description="Thank you for registering as a seller on Relove Market. Your application is under review and will be processed within around 1 week."
                note="Please wait patiently, we'll notify you via email once approved."
                noteIcon={<Clock />}
                primaryLabel="Got it!"
                primaryOnClick={() => setIsSuccessRegisterOpen(false)}
            />

            {/* Special Modal for showing the camera search result */}
            <CameraSearchModal
                isOpen={cameraSearchOpen}
                onClose={closeCameraSearch}
                searchResults={cameraSearchResults}
                isLoading={cameraSearchLoading}
                searchImage={searchImage}
                save_wishlist={SaveWishlist}
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
                                    <div
                                        className="flex items-center w-full px-6 py-4 rounded-full border border-gray-300 bg-white cursor-pointer hover:border-green-400 hover:shadow-md transition-all"
                                        onClick={() =>
                                            setIsSearchModalOpen(true)
                                        }
                                    >
                                        <FaSearch className="text-gray-400 mr-3" />
                                        <span className="text-gray-400 flex-1">
                                            Search for any product...
                                        </span>
                                    </div>

                                    {/* Modal for displaying search results */}
                                    <SearchablePickerModal
                                        isOpen={isSearchModalOpen}
                                        onClose={() => {
                                            setIsSearchModalOpen(false);
                                            setSearchQuery("");
                                            setSearchResults([]);
                                        }}
                                        items={list_shoppingItem}
                                        onSelect={(product) => {
                                            setIsSearchModalOpen(false);
                                            setSearchQuery("");
                                            setSearchResults([]);
                                            window.location.href = route(
                                                "product-details",
                                                product.product_id,
                                            );
                                        }}
                                        title="Search Products"
                                        placeholder="What are you looking for?"
                                    />
                                </div>

                                {/* Button for visual search functionality */}
                                <Button
                                    variant="successSoft"
                                    size="visual"
                                    onClick={handleCameraClick}
                                    disabled={cameraSearchLoading}
                                    isLoading={cameraSearchLoading}
                                    loadingText="Searching..."
                                    leftIcon={<FaCamera />}
                                    iconSize="text-lg"
                                    className="flex items-center justify-center gap-2"
                                    buttonText="Visual Search"
                                />

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
                                <Link
                                    key={category.category_id}
                                    href={route("shopping", {
                                        categories: [category.category_name],
                                    })}
                                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                                        selectedCategory ===
                                        category.category_name
                                            ? "border-green-500 bg-green-50 shadow-md"
                                            : "border-gray-200 bg-white hover:shadow-sm hover:border-green-300"
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category.category_name,
                                        )
                                    }
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
                                </Link>
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

                {/* NEW: Infinite Carousel Section - "Recommended for You" */}
                <section className="py-12 bg-white px-4">
                    <Carousel
                        title="Second Life, First Choice"
                        loadingFeatured={loadingFeatured}
                        carouselProducts={carouselProducts}
                    />
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
                                    title: "Smart Search",
                                    text: "Search items in seconds using our AI-powered visual search recognition.",
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
                                            "bg",
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
                                Learn More
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
