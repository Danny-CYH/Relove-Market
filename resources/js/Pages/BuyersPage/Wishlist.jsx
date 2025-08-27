import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

export default function WishlistCheckout() {
    const [wishlist, setWishlist] = useState([
        {
            id: 1,
            name: "Wireless Headphones",
            price: 120,
            image: "https://via.placeholder.com/120",
            qty: 1,
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 90,
            image: "https://via.placeholder.com/120",
            qty: 2,
        },
        {
            id: 3,
            name: "Gaming Mouse",
            price: 45,
            image: "https://via.placeholder.com/120",
            qty: 1,
        },
    ]);

    const [selected, setSelected] = useState([]);

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const updateQty = (id, type) => {
        setWishlist((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          qty:
                              type === "inc"
                                  ? item.qty + 1
                                  : item.qty > 1
                                  ? item.qty - 1
                                  : 1,
                      }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setWishlist((prev) => prev.filter((item) => item.id !== id));
        setSelected((prev) => prev.filter((i) => i !== id));
    };

    const selectedItems = wishlist.filter((item) => selected.includes(item.id));

    const totalPrice = selectedItems.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    return (
        <div className="bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE: Wishlist items */}
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="text-black text-2xl font-bold mb-4">My Wishlist ❤️</h1>

                    {wishlist.length === 0 ? (
                        <p className="text-gray-600">Your wishlist is empty.</p>
                    ) : (
                        wishlist.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md"
                            >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={selected.includes(item.id)}
                                    onChange={() => toggleSelect(item.id)}
                                    className="w-5 h-5 accent-blue-600"
                                />

                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                />

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">
                                        {item.name}
                                    </h2>
                                    <p className="text-blue-600 font-medium">
                                        ${item.price}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center border rounded-lg">
                                    <button
                                        onClick={() =>
                                            updateQty(item.id, "dec")
                                        }
                                        className="px-3 py-1 text-lg"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{item.qty}</span>
                                    <button
                                        onClick={() =>
                                            updateQty(item.id, "inc")
                                        }
                                        className="px-3 py-1 text-lg"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <p className="w-24 text-right font-semibold">
                                    ${(item.price * item.qty).toFixed(2)}
                                </p>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* RIGHT SIDE: Checkout Summary */}
                <div className="bg-white shadow-lg rounded-xl p-6 h-fit sticky top-6">
                    <h2 className="text-xl font-bold mb-4">Checkout Summary</h2>

                    {/* Address Section */}
                    <div className="mb-4 border-b pb-3">
                        <p className="text-sm text-gray-500">
                            Delivery Address
                        </p>
                        <p className="font-medium">
                            John Doe, 123 Main Street, KL
                        </p>
                        <button className="text-blue-600 text-sm mt-1 hover:underline">
                            Change Address
                        </button>
                    </div>

                    {/* Selected items */}
                    <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                        {selectedItems.length === 0 ? (
                            <p className="text-gray-600 text-sm">
                                No items selected.
                            </p>
                        ) : (
                            selectedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {item.name} x {item.qty}
                                    </span>
                                    <span>
                                        ${(item.price * item.qty).toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between font-semibold text-lg mb-4">
                        <span>Total:</span>
                        <span className="text-blue-600">
                            ${totalPrice.toFixed(2)}
                        </span>
                    </div>

                    {/* Checkout button */}
                    <button
                        disabled={selectedItems.length === 0}
                        className={`w-full py-3 rounded-lg font-medium ${
                            selectedItems.length === 0
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                    >
                        Checkout
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
