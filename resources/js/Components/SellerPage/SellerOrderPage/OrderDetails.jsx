import {
    XCircle,
    Printer,
    Truck,
    CheckCircle,
    User,
    Package,
    MapPin,
} from "lucide-react";
import dayjs from "dayjs";

export function OrderDetails({
    selectedOrder,
    setSelectedOrder,
    setViewOrder, // Add this prop
    printOrder,
    updateOrderStatus,
}) {
    console.log("OrderDetails selectedOrder:", selectedOrder);

    const handleClose = () => {
        setSelectedOrder(null);
        setViewOrder(false); // Close the modal
    };

    if (!selectedOrder) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 lg:p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-full lg:max-w-4xl max-h-[95vh] lg:max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 lg:p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                            {selectedOrder.order_id}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                        <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                selectedOrder.status === "Processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : selectedOrder.status === "Shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : selectedOrder.status === "Delivered"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                        >
                            {selectedOrder.status}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-500">
                            {dayjs(selectedOrder.created_at).format(
                                "DD MMM YYYY, hh:mm A"
                            )}
                        </span>
                    </div>
                </div>

                <div className="p-4 lg:p-6">
                    {/* Customer Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={18} />
                            Customer Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Customer Name
                                </p>
                                <p className="text-gray-900">
                                    {selectedOrder.user?.name || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Email
                                </p>
                                <p className="text-gray-900">
                                    {selectedOrder.user?.email || "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package size={18} />
                            Order Items
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Price
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Quantity
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {selectedOrder.order_items.map(
                                        (product, index) => (
                                            <tr key={index}>
                                                {/* Product Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_BASE_URL +
                                                                product
                                                                    .product_image
                                                                    ?.image_path
                                                            }
                                                            alt={
                                                                product.product
                                                                    ?.product_name ||
                                                                "Product"
                                                            }
                                                            className="w-10 h-10 object-cover rounded"
                                                            onError={(e) =>
                                                                (e.target.src =
                                                                    "../image/no-image.png")
                                                            }
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {product.product
                                                                    ?.product_name ||
                                                                    "N/A"}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Product ID:{" "}
                                                                {
                                                                    product.product_id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Price */}
                                                <td className="px-4 py-3 text-gray-900">
                                                    RM{" "}
                                                    {parseFloat(
                                                        product.price || 0
                                                    ).toFixed(2)}
                                                </td>

                                                {/* Quantity */}
                                                <td className="px-4 py-3 text-gray-900">
                                                    {product.quantity || 1}
                                                </td>

                                                {/* Subtotal */}
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    RM {selectedOrder.amount}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Order Summary
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    RM{" "}
                                    {parseFloat(
                                        selectedOrder.total_amount ||
                                            selectedOrder.amount ||
                                            0
                                    ).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">RM 0.00</span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>
                                <span className="text-lg font-bold">
                                    RM{" "}
                                    {parseFloat(
                                        selectedOrder.total_amount ||
                                            selectedOrder.amount ||
                                            0
                                    ).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MapPin size={18} />
                            Shipping Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-600">
                                Shipping address information would appear
                                here...
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
                        <button
                            onClick={() => printOrder(selectedOrder)}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs lg:text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Printer size={14} />
                            Print Invoice
                        </button>

                        {selectedOrder.status === "Processing" && (
                            <>
                                <button
                                    onClick={() => {
                                        updateOrderStatus(
                                            selectedOrder.id,
                                            "Shipped"
                                        );
                                        handleClose();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-blue-700"
                                >
                                    <Truck size={14} />
                                    Mark as Shipped
                                </button>
                                <button
                                    onClick={() => {
                                        updateOrderStatus(
                                            selectedOrder.id,
                                            "Cancelled"
                                        );
                                        handleClose();
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-red-700"
                                >
                                    <XCircle size={14} />
                                    Cancel Order
                                </button>
                            </>
                        )}

                        {selectedOrder.status === "Shipped" && (
                            <button
                                onClick={() => {
                                    updateOrderStatus(
                                        selectedOrder.id,
                                        "Delivered"
                                    );
                                    handleClose();
                                }}
                                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-xs lg:text-sm font-medium hover:bg-green-700"
                            >
                                <CheckCircle size={14} />
                                Mark as Delivered
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
