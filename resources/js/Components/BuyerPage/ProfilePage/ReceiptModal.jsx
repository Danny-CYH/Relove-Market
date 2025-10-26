import { X, Printer } from "lucide-react";

export function ReceiptModal({ order, isOpen, onClose, onPrint }) {
    if (!isOpen) return null;

    console.log(order);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Order Receipt - {order.order_number}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={onPrint}
                            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Printer size={18} className="mr-2" />
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Receipt Content */}
                    <div className="bg-white p-6 border border-gray-200 rounded-lg">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Relove Market
                            </h2>
                            <p className="text-gray-600">Order Receipt</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Order Information
                                </h4>
                                <p>
                                    <strong>Order Number:</strong>{" "}
                                    {order.order_id}
                                </p>
                                <p>
                                    <strong>Order Date:</strong>{" "}
                                    {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className="capitalize">
                                        {order.order_status}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    Shipping Information
                                </h4>
                                <p>
                                    {order.shipping_address ||
                                        "No address provided"}
                                </p>
                                {order.trackingNumber && (
                                    <p>
                                        <strong>Tracking:</strong>{" "}
                                        {order.trackingNumber}
                                    </p>
                                )}
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-gray-200 mb-6 text-black">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-4 py-2 text-left">
                                        Item
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-center">
                                        Quantity
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-right">
                                        Price
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-right">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.order_items?.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {item.product.product_name}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-right">
                                            RM {item.price}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2 text-right">
                                            RM{" "}
                                            {(
                                                item.price * item.quantity
                                            ).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="text-right">
                            <p className="text-lg text-black font-bold">
                                Total: RM {order.amount || "0.00"}
                            </p>
                        </div>

                        <div className="text-center mt-8 text-gray-600">
                            <p>Thank you for your purchase!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
