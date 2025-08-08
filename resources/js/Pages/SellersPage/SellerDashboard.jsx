import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function SellerDashboard() {
    const [shop, setShop] = useState(null);

    useEffect(() => {
        const dummyData = {
            shop_name: "Gemilang Store",
            total_products: 15,
            total_orders: 120,
            total_earnings: 3580.75,
            orders: [
                {
                    customer: "Ali Hasan",
                    product: "Eco-Friendly Bottle",
                    status: "Shipped",
                    paid: true,
                    date: "2025-08-01",
                },
                {
                    customer: "Siti Aisyah",
                    product: "Vintage Jeans",
                    status: "Pending",
                    paid: false,
                    date: "2025-07-31",
                },
                {
                    customer: "John Tan",
                    product: "Handmade Soap",
                    status: "Delivered",
                    paid: true,
                    date: "2025-07-30",
                },
            ],
            salesGraph: [
                { name: "Jan", earnings: 400 },
                { name: "Feb", earnings: 600 },
                { name: "Mar", earnings: 800 },
                { name: "Apr", earnings: 550 },
                { name: "May", earnings: 900 },
                { name: "Jun", earnings: 760 },
                { name: "Jul", earnings: 970 },
            ],
        };

        const timeout = setTimeout(() => {
            setShop(dummyData);
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    if (!shop) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -200 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-64 bg-white shadow-md hidden md:block p-6"
            >
                <h2 className="text-xl font-bold mb-4">{shop.shop_name}</h2>
                <nav className="space-y-2">
                    <a
                        href="#"
                        className="block text-gray-700 hover:text-indigo-600"
                    >
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="block text-gray-700 hover:text-indigo-600"
                    >
                        Products
                    </a>
                    <a
                        href="#"
                        className="block text-gray-700 hover:text-indigo-600"
                    >
                        Orders
                    </a>
                    <a
                        href="#"
                        className="block text-gray-700 hover:text-indigo-600"
                    >
                        Earnings
                    </a>
                    <a
                        href="#"
                        className="block text-gray-700 hover:text-indigo-600"
                    >
                        Settings
                    </a>
                </nav>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Welcome back, {shop.shop_name}!
                </h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded shadow text-center">
                        <h2 className="text-gray-600">Total Products</h2>
                        <p className="text-2xl font-bold">
                            {shop.total_products}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <h2 className="text-gray-600">Total Orders</h2>
                        <p className="text-2xl font-bold">
                            {shop.total_orders}
                        </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow text-center">
                        <h2 className="text-gray-600">Earnings</h2>
                        <p className="text-2xl font-bold">
                            RM {shop.total_earnings.toFixed(2)}
                        </p>
                    </div>
                </div>

                {/* Earnings Graph */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Monthly Earnings
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={shop.salesGraph}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="earnings" fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Product Performance Trend */}
                <div className="bg-white p-4 rounded shadow mt-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Product Performance
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            {
                                name: "Eco-Friendly Bottle",
                                sales: 120,
                                trend: "up",
                                change: "+15%",
                            },
                            {
                                name: "Vintage Jeans",
                                sales: 90,
                                trend: "down",
                                change: "-10%",
                            },
                            {
                                name: "Handmade Soap",
                                sales: 150,
                                trend: "up",
                                change: "+22%",
                            },
                        ].map((product, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.03 }}
                                className="border rounded p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-medium text-gray-700">
                                        {product.name}
                                    </h3>
                                    <span
                                        className={`text-sm font-semibold ${
                                            product.trend === "up"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {product.change}{" "}
                                        {product.trend === "up" ? "📈" : "📉"}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Current Sales:{" "}
                                    <span className="font-semibold text-gray-700">
                                        {product.sales}
                                    </span>
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-4 rounded shadow mt-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Orders
                    </h2>
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="p-2">Customer</th>
                                    <th className="p-2">Product</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Payment</th>
                                    <th className="p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shop.orders.map((order, idx) => (
                                    <tr key={idx} className="border-t">
                                        <td className="p-2">
                                            {order.customer}
                                        </td>
                                        <td className="p-2">{order.product}</td>
                                        <td className="p-2">
                                            <span
                                                className={`px-2 py-1 rounded text-white text-xs ${
                                                    order.status === "Shipped"
                                                        ? "bg-blue-500"
                                                        : order.status ===
                                                          "Delivered"
                                                        ? "bg-green-500"
                                                        : "bg-yellow-500"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            {order.paid ? (
                                                <span className="text-green-600 font-semibold">
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="text-red-600 font-semibold">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-2">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
