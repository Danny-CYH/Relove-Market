import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Search, Eye } from "lucide-react";

import { SellerSidebar } from "@/Components/Seller/SellerSidebar";
import { SellerAddProduct_Modal } from "@/Components/Seller/SellerAddProduct_Modal";
import { SellerDeleteProduct_Modal } from "@/Components/Seller/SellerDeleteProduct_Modal";
import { SellerEditProduct_Modal } from "@/Components/Seller/SellerEditProduct_Modal";
import { SellerViewProduct_Modal } from "@/Components/Seller/SellerViewProduct_Modal";

import { LoadingProgress } from "@/Components/Admin/LoadingProgress";

import axios from "axios";

export default function SellerProductPage({
    seller_storeInfo,
    list_categories,
    list_products,
}) {
    const [realTimeProducts, setRealTimeProducts] = useState(list_products);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    // Loading Progress
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("");

    const [productToView, setProductToView] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const productData = realTimeProducts || [];

    // Code for getting all the list products
    const get_ListProducts = async () => {
        try {
            const res = await axios.get(route("get-product"), {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setRealTimeProducts(res.data.list_products);
        } catch (error) {
            console.log(error);
        }
    };

    // Code for viewing the product
    const view_product = async (e, product) => {
        e.preventDefault();

        try {
            await axios.get(route("view-product"), product, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } catch (error) {
            console.log(error);
        }
    };

    // Code for adding the new product
    const add_Product = async (e, formData) => {
        e.preventDefault();

        try {
            setModalMessage("Processing your request...");
            setModalType("loading");
            setLoadingProgress(true);

            const response = await axios.post(route("add-product"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModalMessage(response.data.successMessage);
            setModalType("success");

            get_ListProducts();

            setTimeout(() => {
                setLoadingProgress(false);
            }, 3000);
        } catch (error) {
            setModalMessage(
                "Error saving product: " + error.response?.data || error
            );
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 5000);
        }
    };

    // Code for updating the product
    const edit_Product = async (e, formData) => {
        e.preventDefault();

        try {
            setModalMessage("Processing your request...");
            setModalType("loading");
            setLoadingProgress(true);

            const response = await axios.post(route("edit-product"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setModalMessage(response.data.successMessage);
            setModalType("success");

            get_ListProducts();

            setTimeout(() => {
                setLoadingProgress(false);
            }, 3000);
        } catch (error) {
            setLoadingProgress(true);

            if (error.response) {
                setModalMessage(
                    error.response.data.errorMessage || "Something went wrong"
                );
            } else {
                setModalMessage("Network error. Please try again.");
            }

            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 5000);
        }
    };

    const delete_product = async (e, product) => {
        e.preventDefault();

        try {
            setModalMessage("Processing your request...");
            setModalType("loading");
            setLoadingProgress(true);

            const response = await axios.post(
                route("delete-product"),
                { product_id: product },
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setModalMessage(response.data.successMessage);
            setModalType("success");

            get_ListProducts();

            setTimeout(() => {
                setLoadingProgress(false);
            }, 3000);
        } catch (error) {
            setModalMessage(response.data.errorMessage);
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 5000);
        }
    };

    // Real time update the filter function on the product based on user input
    useEffect(() => {
        if (productData && productData.length > 0) {
            const product_data = productData.filter(
                (p) => p.product_status === "active"
            );

            // apply search on active products
            const searched = product_data.filter((p) =>
                p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setFilteredProducts(searched);
        } else {
            setFilteredProducts([]);
        }
    }, [realTimeProducts, searchTerm]);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Modal for view the product */}
            {isViewOpen && (
                <SellerViewProduct_Modal
                    onView={(e, product) => {
                        view_product(e, product);
                    }}
                    product={productToView}
                    onClose={() => setIsViewOpen(false)}
                />
            )}

            {/* Modal for add new product */}
            {isAddOpen && (
                <SellerAddProduct_Modal
                    onAdd={(e, formData) => {
                        add_Product(e, formData);
                    }}
                    list_categories={list_categories}
                    onClose={() => setIsAddOpen(false)}
                />
            )}

            {/* Modal for edit the product */}
            {isEditOpen && (
                <SellerEditProduct_Modal
                    onEdit={(e, formData) => {
                        edit_Product(e, formData);
                    }}
                    onClose={() => setIsEditOpen(false)}
                    product={productToEdit}
                    list_categories={list_categories}
                />
            )}

            {/* Modal for delete the product */}
            {isDeleteOpen && (
                <SellerDeleteProduct_Modal
                    product={productToDelete}
                    onDelete={(e, product) => {
                        delete_product(e, product);
                    }}
                    onClose={() => setIsDeleteOpen(false)}
                />
            )}

            {/* Loading Progress */}
            {loadingProgress && (
                <LoadingProgress
                    modalType={modalType}
                    modalMessage={modalMessage}
                />
            )}

            {/* Sidebar */}
            <SellerSidebar
                shopName={seller_storeInfo[0].seller_store[0].store_name}
            />

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
                        onClick={() => setIsAddOpen(true)}
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
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.product_id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium">
                                            {product.product_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            RM {product.product_price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.product_quantity}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${
                                                    product.product_status ===
                                                    "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {product.product_status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.category.category_name}
                                        </td>
                                        <td className="px-6 py-4 flex flex-row gap-2">
                                            <button
                                                onClick={() => {
                                                    setProductToEdit(product);
                                                    setIsEditOpen(true);
                                                }}
                                                className="p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProductToView(product);
                                                    setIsViewOpen(true);
                                                }}
                                                className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setProductToDelete(product);
                                                    setIsDeleteOpen(true);
                                                }}
                                                className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                                            >
                                                <Trash size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Product cards (mobile) */}
                <div className="md:hidden space-y-4">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.product_id}
                            className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="font-semibold">
                                    {product.name}
                                </h2>
                                <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                        product.status === "active"
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
                                <button className="flex-1 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 flex items-center justify-center gap-1">
                                    <Eye size={14} /> View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
