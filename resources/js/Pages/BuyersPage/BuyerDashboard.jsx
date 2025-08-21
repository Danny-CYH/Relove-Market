import { Sidebar } from "@/Components/Buyer/Sidebar";

export default function BuyerDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="p-6 font-bold text-lg text-indigo-700">
                    Buyer Dashboard
                </div>
                <Sidebar /> {/* Customize for buyer functions */}
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back, [Buyer Name]!
                    </h1>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-500 transition">
                        Notifications
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-gray-500">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-800">
                                12
                            </p>
                        </div>
                        <div className="mt-4">
                            <a
                                href="#"
                                className="text-indigo-600 hover:underline"
                            >
                                View Orders
                            </a>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-gray-500">Wishlist Items</p>
                            <p className="text-2xl font-bold text-gray-800">
                                5
                            </p>
                        </div>
                        <div className="mt-4">
                            <a
                                href="#"
                                className="text-indigo-600 hover:underline"
                            >
                                View Wishlist
                            </a>
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <p className="text-gray-500">Total Spend</p>
                            <p className="text-2xl font-bold text-gray-800">
                                $1,250
                            </p>
                        </div>
                        <div className="mt-4">
                            <a
                                href="#"
                                className="text-indigo-600 hover:underline"
                            >
                                View Details
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white shadow rounded-lg p-6 flex justify-around space-x-4">
                    <button className="flex-1 bg-indigo-600 text-white py-3 rounded hover:bg-indigo-500 transition">
                        Track Orders
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-500 transition">
                        View Wishlist
                    </button>
                    <button className="flex-1 bg-yellow-500 text-white py-3 rounded hover:bg-yellow-400 transition">
                        Update Profile
                    </button>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Recent Orders
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b text-gray-500">
                                        Order #
                                    </th>
                                    <th className="px-4 py-2 border-b text-gray-500">
                                        Date
                                    </th>
                                    <th className="px-4 py-2 border-b text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-4 py-2 border-b text-gray-500">
                                        Total
                                    </th>
                                    <th className="px-4 py-2 border-b text-gray-500">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">1023</td>
                                    <td className="px-4 py-2 border-b">
                                        2025-08-10
                                    </td>
                                    <td className="px-4 py-2 border-b text-green-600 font-semibold">
                                        Delivered
                                    </td>
                                    <td className="px-4 py-2 border-b">$250</td>
                                    <td className="px-4 py-2 border-b">
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:underline"
                                        >
                                            View
                                        </a>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b">1019</td>
                                    <td className="px-4 py-2 border-b">
                                        2025-08-05
                                    </td>
                                    <td className="px-4 py-2 border-b text-yellow-600 font-semibold">
                                        In Transit
                                    </td>
                                    <td className="px-4 py-2 border-b">$180</td>
                                    <td className="px-4 py-2 border-b">
                                        <a
                                            href="#"
                                            className="text-indigo-600 hover:underline"
                                        >
                                            Track
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Recommended for You
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
                            <p className="font-semibold text-gray-800">
                                Item A
                            </p>
                            <p className="text-green-600 font-semibold">New</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
                            <p className="font-semibold text-gray-800">
                                Item B
                            </p>
                            <p className="text-blue-600 font-semibold">
                                Recommended
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition">
                            <p className="font-semibold text-gray-800">
                                Item C
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}