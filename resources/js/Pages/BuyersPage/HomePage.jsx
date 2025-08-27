import {
    FaSearch,
    FaCamera,
    FaRecycle,
    FaStore,
    FaShoppingBag,
} from "react-icons/fa";

import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/footer";
import { Carousel_ProductData } from "@/Components/Buyer/Carousel_ProductData";
import { SellerRegisterSuccess } from "@/Components/Buyer/SellerRegisterSuccess";

import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function HomePage() {
    const items = [
        {
            id: 1,
            name: "Vintage T-shirt",
            category: "Fashion",
            price: "RM20",
            image: "/image/items/fashion1.jpg",
        },
        {
            id: 2,
            name: "Bluetooth Speaker",
            category: "Electronics",
            price: "RM80",
            image: "/image/items/electronics1.jpg",
        },
        {
            id: 3,
            name: "Secondhand Chair",
            category: "Home Decor",
            price: "RM50",
            image: "/image/items/home1.jpg",
        },
        {
            id: 4,
            name: "Novel Book",
            category: "Books",
            price: "RM10",
            image: "/image/items/book1.jpg",
        },
        {
            id: 5,
            name: "Denim Jacket",
            category: "Fashion",
            price: "RM35",
            image: "/image/items/fashion2.jpg",
        },
        {
            id: 6,
            name: "Old Camera",
            category: "Electronics",
            price: "RM150",
            image: "/image/items/electronics2.jpg",
        },
        {
            id: 7,
            name: "Wall Painting",
            category: "Home Decor",
            price: "RM45",
            image: "/image/items/home2.jpg",
        },
        {
            id: 8,
            name: "Textbook",
            category: "Books",
            price: "RM25",
            image: "/image/items/book2.jpg",
        },
        {
            id: 9,
            name: "Sneakers",
            category: "Fashion",
            price: "RM60",
            image: "/image/items/fashion3.jpg",
        },
        {
            id: 10,
            name: "Table Lamp",
            category: "Home Decor",
            price: "RM30",
            image: "/image/items/home3.jpg",
        },
    ];

    const categories = ["All", "Fashion", "Electronics", "Home Decor", "Books"];

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isOpen, setIsOpen] = useState(false);

    const { flash } = usePage().props;

    const filteredItems =
        selectedCategory === "All"
            ? items
            : items.filter((item) => item.category === selectedCategory);

    const displayItems = filteredItems.slice(0, 8);

    useEffect(() => {
        if (flash.successMessage) {
            setIsOpen(true);
        }
    }, [flash.successMessage]);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Navbar />

            {/* Modal for displaying the success register message for users */}
            <SellerRegisterSuccess isOpen={isOpen} setIsOpen={setIsOpen} />

            <main className="flex-grow">
                {/* Hero Section */}
                <div
                    className="relative h-72 md:h-banner bg-cover bg-center w-full"
                    style={{ backgroundImage: `url('../image/home_page.jpg')` }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    <div className="relative z-10 flex flex-col items-center justify-center min-h-60 md:h-banner text-white px-4 text-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">
                            Give Items a Second Life,
                        </h2>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Shop Relove!
                        </h1>

                        <div className="flex items-center bg-white rounded-full shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg px-4 py-2 mx-auto">
                            <input
                                type="text"
                                placeholder="Search for any item"
                                className="flex-grow outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0 text-sm sm:text-base"
                            />
                            <button className="text-white bg-blue-500 hover:bg-blue-600 rounded-full p-2 ml-2">
                                <FaSearch />
                            </button>
                            <button className="text-white bg-gray-500 hover:bg-gray-600 rounded-full p-2 ml-2">
                                <FaCamera />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Product Carousel */}
                <section className="px-4">
                    <Carousel_ProductData />
                </section>

                <section className="py-12 bg-white px-4">
                    <h2 className="text-2xl text-black font-bold text-center mb-6">
                        Recommended for You
                    </h2>

                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full border ${
                                    selectedCategory === category
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {displayItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white shadow rounded-lg overflow-hidden"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-lg text-black font-semibold mb-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-1">
                                        {item.category}
                                    </p>
                                    <p className="text-blue-600 font-bold">
                                        {item.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* BENEFITS */}
                <section className="py-16 bg-white px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl text-black font-bold text-center mb-12">
                            Why Choose Relove Market?
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    icon: <FaRecycle />,
                                    title: "Eco-Friendly",
                                    text: "Reduce waste and extend product life.",
                                },
                                {
                                    icon: <FaStore />,
                                    title: "Trusted Sellers",
                                    text: "Buy from verified sellers across categories.",
                                },
                                {
                                    icon: <FaShoppingBag />,
                                    title: "Affordable Finds",
                                    text: "Discover unique items at fair prices.",
                                },
                                {
                                    icon: <FaCamera />,
                                    title: "Smart Listing",
                                    text: "List items easily using image recognition.",
                                },
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-50 p-6 rounded-lg shadow-md text-center"
                                >
                                    <div className="text-3xl flex flex-row justify-center text-blue-600 mb-4">
                                        {feature.icon}
                                    </div>
                                    <h4 className="font-semibold text-lg text-black mb-2">
                                        {feature.title}
                                    </h4>
                                    <p className="text-gray-600">
                                        {feature.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section
                    className="relative py-16 text-white text-center px-4 overflow-hidden"
                    style={{
                        backgroundImage: `url('../image/seller_bg.jpg')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    {/* Dark + Blur Overlay */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

                    {/* Content */}
                    <div className="relative z-10 max-w-xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Sell?
                        </h2>
                        <p className="text-lg md:text-xl mb-6">
                            Join the sustainable movement and turn your items
                            into earnings.
                        </p>
                        <Link
                            href={route("seller-registration")}
                            className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                        >
                            Become a Seller
                        </Link>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-12 px-6 bg-white">
                    <h2 className="text-2xl text-black font-bold text-center mb-8">
                        Our Service
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="text-center">
                            <FaRecycle className="text-4xl text-green-600 mb-4 mx-auto" />
                            <h4 className="font-semibold text-black text-lg mb-2">
                                Relove Old Items
                            </h4>
                            <p className="text-gray-600">
                                Upload pre-loved products for resale.
                            </p>
                        </div>
                        <div className="text-center">
                            <FaStore className="text-4xl text-blue-600 mb-4 mx-auto" />
                            <h4 className="font-semibold text-black text-lg mb-2">
                                Open Your Store
                            </h4>
                            <p className="text-gray-600">
                                Become a seller and build your community.
                            </p>
                        </div>
                        <div className="text-center">
                            <FaShoppingBag className="text-4xl text-purple-600 mb-4 mx-auto" />
                            <h4 className="font-semibold text-black text-lg mb-2">
                                Start Shopping
                            </h4>
                            <p className="text-gray-600">
                                Discover unique items at affordable prices.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
