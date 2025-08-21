import { usePage, Link } from "@inertiajs/react";

export function Sidebar() {
    const { url } = usePage();

    return (
        <div>
            <nav className="px-4 py-2">
                <ul className="space-y-2">
                    {/* Dashboard */}
                    <li>
                        <Link
                            href={route("buyer-dashboard")}
                            className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                                route().current("buyer-dashboard")
                                    ? "text-indigo-600 font-bold bg-indigo-50"
                                    : "text-black hover:text-blue-600"
                            }`}
                        >
                            Dashboard
                        </Link>
                    </li>

                    {/* Orders */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-orders"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Orders
                        </Link>
                    </li>

                    {/* Wishlist */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-wishlist"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Wishlist
                        </Link>
                    </li>

                    {/* Track Orders */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-track-orders"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Track Orders
                        </Link>
                    </li>

                    {/* Profile */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-profile"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Profile
                        </Link>
                    </li>

                    {/* Recommendations */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-recommendations"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Recommendations
                        </Link>
                    </li>

                    {/* Messages / Notifications (optional) */}
                    <li>
                        <Link
                            href="#"
                            className={`cursor-pointer ${
                                url === "/buyer-messages"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Messages
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
