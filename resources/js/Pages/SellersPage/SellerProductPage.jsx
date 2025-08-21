import React, { useState } from "react";
import { Plus, Edit, Trash, Search } from "lucide-react";

import { SellerSidebar } from "@/Components/Seller/SellerSidebar";
import { SellerProductForm } from "@/Components/Seller/SellerProductForm";

import { usePage } from "@inertiajs/react";

export default function SellerProductPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [status, setStatus] = useState("active");
    const [condition, setCondition] = useState("new");

    const { props } = usePage();

    const handleEdit = (product) => {
        setIsEditOpen(true);
        setProductName(product.name);
        setDescription(product.description || "");
        setPrice(product.price);
        setQuantity(product.stock);
        setStatus(product.status.toLowerCase());
        setCondition(product.condition || "new");
        // setImages(product.images || []);
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setIsDeleteOpen(true);
    };

    const confirmDelete = () => {
        console.log("Deleting product:", productToDelete);
        setIsDeleteOpen(false);
        setProductToDelete(null);
    };

    const handleAddProduct = async (formData) => {
        try {
            await axios.post(route("add-product"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("✅ Product saved successfully!");
        } catch (error) {
            console.error("❌ Error saving product:", error);
        }
    };

    const products = [
        {
            id: 1,
            name: "Wireless Earbuds",
            price: 199,
            stock: 50,
            status: "Active",
        },
        { id: 2, name: "Laptop Stand", price: 99, stock: 15, status: "Active" },
        {
            id: 3,
            name: "Smart Watch",
            price: 299,
            stock: 0,
            status: "Out of Stock",
        },
    ];

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {isOpen && (
                <SellerProductForm
                    title="Add New Product"
                    // onSubmit={handleAddProduct}
                    onClose={() => setIsOpen(false)}
                    list_categories={props.list_categories}
                />
            )}
            {isEditOpen && (
                <SellerProductForm
                    title="Edit Product"
                    onSubmit={route("add-product")}
                    onClose={() => setIsEditOpen(false)}
                    list_categories={props.list_categories}
                />
            )}

            {isDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg text-black font-bold mb-4">
                            Delete Product
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete{" "}
                            <strong>{productToDelete?.name}</strong>?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="px-4 py-2 text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <SellerSidebar shopName="Gemilang Berjaya" />

            {/* Main content */}
            <main className="flex-1 p-6">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Products
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage your store products here.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                </div>

                {/* Search bar */}
                <div className="relative max-w-sm mb-6">
                    <Search
                        className="absolute left-3 top-2.5 text-gray-400"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                {/* Product table (desktop) */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full text-sm text-left text-gray-700">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3">Price (RM)</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        RM {product.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full ${
                                                product.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex flex-row gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                            className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Product cards (mobile) */}
                <div className="md:hidden space-y-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold">
                                    {product.name}
                                </h2>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                        product.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {product.status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                RM {product.price}
                            </p>
                            <p className="text-gray-500 text-xs">
                                Stock: {product.stock}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <button className="flex-1 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center gap-1">
                                    <Edit size={14} /> Edit
                                </button>
                                <button className="flex-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center gap-1">
                                    <Trash size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
