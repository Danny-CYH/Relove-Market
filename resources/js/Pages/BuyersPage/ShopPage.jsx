import { useState } from "react";
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

                <div class="md:col-span-1 relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-70">
                    <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1">
                        <span class="text-sm text-slate-600 font-medium">
                            Filter Options
                        </span>
                    </div>

                    <div class="p-4">
                        <h3 className="text-black mb-2">Category</h3>
                        <label className="label cursor-pointer text-black">
                            <input
                                type="checkbox"
                                className="appearance-none w-5 h-5 border border-indigo-600 checked:bg-indigo-600 rounded-sm"
                            />
                            <span className="label-text mr-2">Remember me</span>
                        </label>
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
                                <div className="flex flex-row justify-between mt-3">
                                    <h3 className="text-success text-lg">
                                        RM 75.00
                                    </h3>
                                    <h5 className="text-dark">Location</h5>
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
            <Footer />
        </div>
    );
}
