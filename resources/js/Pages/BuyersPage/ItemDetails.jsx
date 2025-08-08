import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";

import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

export default function ItemDetails() {
    return (
        <div className="h-96 bg-white">
            <Navbar />
            <div className="grid grid-cols-6 grid-flow-col gap-4 mt-12">
                <div className="col-start-1 col-span-2">
                    <img
                        className="max-h-72 w-full mx-40 mb-5 object-cover object-center"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </div>
                <div className="col-start-1">
                    <img
                        className="max-h-72 w-full mx-40 mb-5 object-cover object-center"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </div>
                <div className="col-start-2">
                    <img
                        className="max-h-72 w-full mx-40 mb-5 object-cover object-center"
                        src="https://images.unsplash.com/photo-1682407186023-12c70a4a35e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                        alt="nature image"
                    />
                </div>

                {/* Displaying Product Information */}
                <div className="col-start-4 col-span-2 row-span-6">
                    {/* Product title */}
                    <h1 className="text-black text-xl font-semibold">
                        NexSUS ROCK Strix Scar 17 Gaming Laptop 15.7" 1TB SSD
                        16GB Ram Pro
                    </h1>
                    <hr />

                    {/* Product price */}
                    <h1 className="text-success font-bold mt-2">RM 2999.00</h1>

                    {/* Product information */}
                    <div className="grid grid-cols-2 mt-4">
                        <h3 className="col-start-1 text-black">Brand</h3>
                        <h3 className="col-start-2 text-secondary">
                            NexSUS Tech Company
                        </h3>
                        <h3 className="col-start-1 text-black">Brand</h3>
                        <h3 className="col-start-2 text-secondary">
                            NexSUS Tech Company
                        </h3>
                        <h3 className="col-start-1 text-black">Brand</h3>
                        <h3 className="col-start-2 text-secondary">
                            NexSUS Tech Company
                        </h3>
                        <h3 className="col-start-1 text-black">Brand</h3>
                        <h3 className="col-start-2 text-secondary">
                            NexSUS Tech Company
                        </h3>
                        <h3 className="col-start-1 text-black">Brand</h3>
                        <div className="flex flex-row gap-2">
                            <button className="btn btn-primary">Primary</button>
                            <button className="btn btn-primary">Primary</button>
                        </div>
                    </div>

                    {/* Service available */}
                    <div className="grid grid-cols-2 mt-4 gap-4">
                        <div className="flex flex-row items-center space-x-4 mt-5 bg-white rounded p-4 shadow">
                            {/* Enlarged Icon */}
                            <FontAwesomeIcon
                                icon={faTruck}
                                className="text-2xl text-black"
                            />

                            {/* Text in 2 rows */}
                            <div className="flex flex-col text-left">
                                <h4 className="text-base font-semibold text-black">
                                    Free Shipping
                                </h4>
                                <p className="text-sm text-black">
                                    Worldwide available
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-4 mt-5 bg-white rounded p-4 shadow">
                            {/* Enlarged Icon */}
                            <FontAwesomeIcon
                                icon={faTruck}
                                className="text-2xl text-black"
                            />

                            {/* Text in 2 rows */}
                            <div className="flex flex-col text-left">
                                <h4 className="text-base font-semibold text-black">
                                    Free Shipping
                                </h4>
                                <p className="text-sm text-black">
                                    Worldwide available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms and condition of the product */}
                <div className="flex flex-row gap-4 mx-40">
                    <h2 className="text-black">Description</h2>
                    <h2 className="text-black">Specification</h2>
                    <h2 className="text-black">Return</h2>
                    <h2 className="text-black">Reviews</h2>
                </div>

                <div className="grid grid-cols-6 gap-60 mx-40">
                    <h3 className="col-start-1 text-black">Brand</h3>
                    <h3 className="col-start-2 col-span-2 text-black">
                        NexSUS Tech Company
                    </h3>
                    <h3 className="col-start-4 text-black">Audio</h3>
                    <h3 className="col-start-5 col-span-2 text-black">
                        NexSUS Tech Company
                    </h3>
                </div>

                {/* Related products */}
                <h2 className="text-black text-2xl font-bold mt-10 mx-40">
                    Related Products
                </h2>
            </div>
            <Footer />
        </div>
    );
}
