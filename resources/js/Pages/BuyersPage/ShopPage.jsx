import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

export default function ShopPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />

            {/* Banner Section */}
            <div
                className="relative h-72 md:h-[23rem] bg-cover bg-center"
                style={{
                    backgroundImage: `url('../image/shopping_banner.jpg')`,
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50" />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-60 md:h-[23rem] text-white px-4 text-center">
                    <h2 className="text-2xl md:text-4xl font-light">
                        Shop Relove Market
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-bold mt-2">
                        Find What You Love, Love What You Find
                    </h1>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex flex-col lg:flex-row gap-6 p-6 md:px-20 mt-10 flex-grow">
                {/* Filter Sidebar */}
                <aside className="lg:w-1/4 bg-white border rounded-lg shadow-md p-4">
                    <h3 className="text-2xl font-semibold mb-4">
                        Filter Products
                    </h3>

                    <div className="mb-6">
                        <h4 className="text-md font-medium mb-2">Category</h4>
                        <label className="flex items-center gap-2 text-sm mb-1">
                            <input
                                type="checkbox"
                                className="accent-indigo-600"
                            />
                            Fashion
                        </label>
                        <label className="flex items-center gap-2 text-sm mb-1">
                            <input
                                type="checkbox"
                                className="accent-indigo-600"
                            />
                            Electronics
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="accent-indigo-600"
                            />
                            Home & Living
                        </label>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium mb-2">
                            Price Range
                        </h4>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full border rounded px-2 py-1 text-sm"
                            />
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <section className="lg:w-3/4">
                    <h2 className="text-xl font-bold mb-4">
                        Recommended For You
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className="bg-white border rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
                            >
                                <img
                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                    alt="Item"
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1">
                                        Vintage Jacket
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        High-quality preloved jacket, gently
                                        worn.
                                    </p>
                                    <div className="mt-3 flex justify-between items-center">
                                        <span className="text-indigo-600 font-bold text-lg">
                                            RM 75.00
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            📍 KL, Malaysia
                                        </span>
                                    </div>
                                    <div className="mt-2 flex gap-2 flex-wrap">
                                        <span className="badge badge-outline text-xs">
                                            Fashion
                                        </span>
                                        <span className="badge badge-outline text-xs">
                                            Used
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
