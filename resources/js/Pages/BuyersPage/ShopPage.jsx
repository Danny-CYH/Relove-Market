import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

export default function ShopPage() {
    return (
        <div className="h-96 flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                <div
                    className="relative h-72 md:h-banner bg-cover bg-center w-full"
                    style={{
                        backgroundImage: `url('../image/shopping_banner.jpg')`,
                    }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center min-h-60 md:h-banner text-white px-4 text-center">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-light mb-2">
                            Shop Relove Market
                        </h2>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6">
                            Find What You Love, Love What You Find
                        </h1>
                    </div>
                </div>
            </main>

            {/* Filter product list button */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-32 mt-20 mb-5">
                {/* Filter Sidebar (1 column out of 4) */}
                <div className="md:col-span-1 border border-black p-5">
                    <h2 className="text-xl font-semibold mb-4 text-black">
                        Filter Products
                    </h2>

                    {/* Price Range */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2 text-black">
                            Price Range
                        </h3>
                        <div className="flex space-x-2">
                            <input
                                type="range"
                                min={0}
                                max="100"
                                value="40"
                                className="range bg-black"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2 text-black">
                            Categories
                        </h3>
                        <div className="space-y-1">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-success"
                            />
                            <label for="test" className="mx-2">
                                Testing
                            </label>
                        </div>
                    </div>

                    {/* Brands */}
                    <div className="mb-6">
                        <h3 className="font-medium mb-2 text-black">Brands</h3>
                        <div className="space-y-1">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between items-center mt-6">
                        <button className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300">
                            Reset
                        </button>
                        <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
                            Apply
                        </button>
                    </div>
                </div>

                {/* Product Area (3 columns out of 4) */}
                <div className="md:col-span-3 mx-10">
                    <h2 className="text-black font-bold mb-5">For You!</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card bg-base-100 shadow-sm">
                            <figure>
                                <img
                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                    alt="Shoes"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    Card Title
                                    <div className="badge badge-secondary">
                                        NEW
                                    </div>
                                </h2>
                                <p>
                                    A card component has a figure, a body part,
                                    and inside body there are title and actions
                                    parts
                                </p>
                                <div className="card-actions justify-start">
                                    <div className="badge badge-outline">
                                        Fashion
                                    </div>
                                    <div className="badge badge-outline">
                                        Products
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-sm">
                            <figure>
                                <img
                                    src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                    alt="Shoes"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    Card Title
                                    <div className="badge badge-secondary">
                                        NEW
                                    </div>
                                </h2>
                                <p>
                                    A card component has a figure, a body part,
                                    and inside body there are title and actions
                                    parts
                                </p>
                                <div className="card-actions justify-start">
                                    <div className="badge badge-outline">
                                        Fashion
                                    </div>
                                    <div className="badge badge-outline">
                                        Products
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Repeat cards... */}
                    </div>
                </div>
            </div>

            {/* List products */}
            <div className="px-40">
                {/* <h2 className="text-black font-bold mt-10">For You!</h2>
                <div className="flex flex-row mt-5 mb-5">
                    <div className="card bg-base-100 w-96 shadow-sm">
                        <figure>
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt="Shoes"
                            />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">
                                Card Title
                                <div className="badge badge-secondary">NEW</div>
                            </h2>
                            <p>
                                A card component has a figure, a body part, and
                                inside body there are title and actions parts
                            </p>
                            <div className="card-actions justify-start">
                                <div className="badge badge-outline">
                                    Fashion
                                </div>
                                <div className="badge badge-outline">
                                    Products
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            <Footer />
        </div>
    );
}
