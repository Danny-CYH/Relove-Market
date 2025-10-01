import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash, Search, Eye } from "lucide-react";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { SellerAddProduct_Modal } from "@/Components/SellerPage/SellerManageProduct/SellerAddProduct_Modal";
import { SellerDeleteProduct_Modal } from "@/Components/SellerPage/SellerManageProduct/SellerDeleteProduct_Modal";
import { SellerEditProduct_Modal } from "@/Components/SellerPage/SellerManageProduct/SellerEditProduct_Modal";
import { SellerViewProduct_Modal } from "@/Components/SellerPage/SellerManageProduct/SellerViewProduct_Modal";

import { LoadingProgress } from "@/Components/AdminPage/LoadingProgress";

import axios from "axios";

export default function SellerManageProduct({
    seller_storeInfo,
    list_categories,
}) {
    const [realTimeProducts, setRealTimeProducts] = useState([]);
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
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [sortBy, setSortBy] = useState("name");

    const [errorField, setErrorField] = useState(null);
    const [modalToReopen, setModalToReopen] = useState(null); // 'add' or 'edit'

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const [loading, setLoading] = useState(false);

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

            setTimeout(() => {
                setLoadingProgress(false);
                setIsAddOpen(false);
            }, 3000);
        } catch (error) {
            const errors = error.response?.data?.errors;
            let errorMessages = "";

            if (errors) {
                // Get the first error message only
                const firstErrorKey = Object.keys(errors)[0]; // first field with error
                const firstErrorMessage = errors[firstErrorKey][0]; // first message for that field

                errorMessages = firstErrorMessage;

                // Optionally store the field for focus
                setErrorField(firstErrorKey);
            } else {
                errorMessages =
                    error.response?.data?.errorMessage || "Unknown error";
            }

            setModalMessage("Error adding new product:\n" + errorMessages);
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
                setModalToReopen("add");
            }, 7000);
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

            setTimeout(() => {
                setLoadingProgress(false);
                setIsEditOpen(false);
            }, 3000);
        } catch (error) {
            setLoadingProgress(true);

            if (error.response) {
                setModalMessage(
                    error.response.data.errorMessage ||
                        "Something went wrong...Please try again"
                );
            } else {
                setModalMessage("Network error. Please try again.");
            }

            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 7000);
        }
    };

    // Code for deleteing the product
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

            setTimeout(() => {
                setLoadingProgress(false);
                setIsDeleteOpen(false);
            }, 3000);
        } catch (error) {
            setModalMessage(error.response.data.errorMessage);
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 7000);
        }
    };

    // Get the product of the seller
    const get_ListProducts = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/seller-manage-product/get-product?page=${page}`
            );
            const data = await response.json();

            setRealTimeProducts(data.list_product.data);

            setCurrentPage(data.list_product.current_page);
            setLastPage(data.list_product.last_page);

            setPagination({
                from: data.list_product.from,
                to: data.list_product.to,
                total: data.list_product.total,
                current_page: data.list_product.current_page,
                last_page: data.list_product.last_page,
            });
        } catch (error) {
            console.log("Error fetching products:", error);
        }
        setLoading(false);
    };

    // Real time update for product listing with Echo
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel("products");

        const productUpdatedListener = (e) => {
            console.log("🎯 ProductUpdated event received:", e);

            if (e.action === "updated") {
                const updatedProduct = e.product;
                setRealTimeProducts((prevProducts) =>
                    prevProducts.map((p) =>
                        p.product_id === updatedProduct.product_id
                            ? updatedProduct
                            : p
                    )
                );
            }

            if (e.action === "deleted") {
                setRealTimeProducts((prevProducts) =>
                    prevProducts.filter((p) => p.product_id !== e.product_id)
                );
            }

            if (e.action === "created") {
                setRealTimeProducts((prevProducts) => [
                    e.product,
                    ...prevProducts,
                ]);
            }
        };

        channel.listen(".product.updated", productUpdatedListener);

        channel.subscribed(() =>
            console.log("✅ Subscribed to products channel")
        );
        channel.error((error) => console.error("❌ Channel error:", error));

        return () => {
            channel.stopListening(".product.updated");
            window.Echo.leaveChannel("products");
        };
    }, []);

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, []);

    // Fetch users whenever page or filters change
    useEffect(() => {
        get_ListProducts(currentPage);
    }, [currentPage]);

    // code for display the error field
    useEffect(() => {
        if (errorField && modalToReopen) {
            setTimeout(() => {
                if (modalToReopen === "add") {
                    setIsAddOpen(true);
                } else if (modalToReopen === "edit") {
                    setIsEditOpen(true);
                }
                setModalToReopen(null);
            }, 100);
        }
    }, [errorField, modalToReopen]);

    // Filter and sort products
    useEffect(() => {
        if (realTimeProducts && realTimeProducts.length > 0) {
            let filtered = realTimeProducts.filter(
                (p) =>
                    (searchTerm.trim() === "" ||
                        p.product_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())) &&
                    (statusFilter === "all" ||
                        p.product_status === statusFilter) &&
                    (categoryFilter === "all" ||
                        p.category.category_id.toString() === categoryFilter)
            );

            // Sort products
            filtered = filtered.sort((a, b) => {
                switch (sortBy) {
                    case "name":
                        return a.product_name.localeCompare(b.product_name);
                    case "price-high":
                        return b.product_price - a.product_price;
                    case "price-low":
                        return a.product_price - b.product_price;
                    case "stock-high":
                        return b.product_quantity - a.product_quantity;
                    case "stock-low":
                        return a.product_quantity - b.product_quantity;
                    default:
                        return 0;
                }
            });

            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [realTimeProducts, searchTerm, statusFilter, categoryFilter, sortBy]);

    // Count products by status
    const productCounts = {
        all: realTimeProducts.length,
        available: realTimeProducts.filter(
            (p) => p.product_status === "available"
        ).length,
        unavailable: realTimeProducts.filter(
            (p) => p.product_status === "unavailable"
        ).length,
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Modal for view the product */}
            {isViewOpen && (
                <SellerViewProduct_Modal
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
                    onClose={() => {
                        setIsAddOpen(false);
                        setErrorField(null);
                    }}
                    errorField={errorField}
                    onErrorFieldHandled={() => setErrorField(null)}
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
                shopName={seller_storeInfo[0].seller_store.store_name}
            />

            {/* Main content */}
            <main className="flex-1 p-4 md:p-6">
                {/* Page header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Product Management
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your product inventory and listings
                            </p>
                        </div>
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Add Product
                        </button>
                    </div>

                    {/* Stats summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total Products
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {productCounts.all}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Available
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {productCounts.available}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center">
                                <div className="bg-red-100 p-2 rounded-lg mr-3">
                                    <svg
                                        className="w-5 h-5 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Unavailable
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {productCounts.unavailable}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search
                                    className="absolute left-3 top-3 text-gray-400"
                                    size={18}
                                />
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Available</option>
                                    <option value="unavailable">
                                        Unavailable
                                    </option>
                                </select>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) =>
                                        setCategoryFilter(e.target.value)
                                    }
                                    className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="all">All Categories</option>
                                    {list_categories.map((category) => (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}
                                        >
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="stock-high">
                                        Stock: High to Low
                                    </option>
                                    <option value="stock-low">
                                        Stock: Low to High
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product table (desktop) */}
                <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {loading ? (
                        <LoadingProgress
                            modalType={"success"}
                            modalMessage={"Loading..."}
                        />
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-6 py-8 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <svg
                                                    className="w-12 h-12 mb-4 text-gray-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
                                                    />
                                                </svg>
                                                <p className="text-lg font-medium mb-1">
                                                    No products found
                                                </p>
                                                <p className="text-sm">
                                                    Try adjusting your search or
                                                    filters
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr
                                            key={product.product_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                                                        {product.product_image ? (
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
                                                                className="h-10 w-10 rounded-lg object-cover"
                                                            />
                                                        ) : (
                                                            <svg
                                                                className="h-6 w-6 text-gray-400"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {
                                                                product.product_name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            SKU:{" "}
                                                            {product.product_id}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 font-medium">
                                                    RM {product.product_price}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="text-gray-900">
                                                        {
                                                            product.product_quantity
                                                        }
                                                    </span>
                                                    {product.product_quantity <
                                                        10 && (
                                                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                            Low stock
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        product.product_status ===
                                                        "available"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {product.product_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                    {
                                                        product.category
                                                            .category_name
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setProductToView(
                                                                product
                                                            );
                                                            setIsViewOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                        title="View product"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setProductToEdit(
                                                                product
                                                            );
                                                            setIsEditOpen(true);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Edit product"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setProductToDelete(
                                                                product
                                                            );
                                                            setIsDeleteOpen(
                                                                true
                                                            );
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Delete product"
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Product cards (mobile) */}
                <div className="md:hidden space-y-3">
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
                            <svg
                                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16"
                                />
                            </svg>
                            <p className="text-gray-500">
                                No products found. Try adjusting your search or
                                filters.
                            </p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => (
                            <div
                                key={product.product_id}
                                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                            >
                                <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="h-14 w-14 bg-gray-200 rounded-lg flex items-center justify-center">
                                            {product.product_image ? (
                                                <img
                                                    src={product.product_image}
                                                    alt={product.product_name}
                                                    className="h-14 w-14 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="h-8 w-8 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            SKU: {product.product_id}
                                        </p>
                                        <div className="flex items-center mt-1">
                                            <span className="text-gray-900 font-medium">
                                                RM {product.product_price}
                                            </span>
                                            <span className="mx-2 text-gray-300">
                                                •
                                            </span>
                                            <span className="text-gray-600">
                                                {product.product_quantity} in
                                                stock
                                            </span>
                                        </div>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <span
                                                className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                                    product.product_status ===
                                                    "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.product_status}
                                            </span>
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                {product.category.category_name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <div>
                                        {product.product_quantity < 10 && (
                                            <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                Low stock
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setProductToView(product);
                                                setIsViewOpen(true);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                                            title="View product"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProductToEdit(product);
                                                setIsEditOpen(true);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                            title="Edit product"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setProductToDelete(product);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete product"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="text-black font-medium">
                                {pagination.from}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">{pagination.to}</span>{" "}
                            of{" "}
                            <span className="text-black font-medium">
                                {pagination.total}
                            </span>{" "}
                            results ({" "}
                            <span className="text-primary font-bold mx-auto">
                                Page {currentPage} of {lastPage}
                            </span>{" "}
                            )
                        </div>

                        <div className="inline-flex items-center space-x-2">
                            {currentPage > 1 && (
                                <button
                                    className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(p - 1, 1)
                                        )
                                    }
                                >
                                    Previous
                                </button>
                            )}

                            <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">
                                {currentPage}
                            </button>

                            {currentPage < lastPage && (
                                <button
                                    className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(p + 1, lastPage)
                                        )
                                    }
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
