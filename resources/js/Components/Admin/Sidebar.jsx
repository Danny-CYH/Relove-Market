import { usePage, Link } from "@inertiajs/react";

export function Sidebar() {
    const { url } = usePage();

    return (
        <div>
            <nav className="px-4 py-2">
                <ul className="space-y-2">
                    <li>
                        <Link
                            href={route("admin-dashboard")}
                            className={`cursor-pointer ${
                                url === "/admin-dashboard"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("list-transaction")}
                            className={`cursor-pointer ${
                                url === "/list-transaction"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("pending-seller-list")}
                            className={`cursor-pointer ${
                                url === "/pending-seller-list"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Pending Seller
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("subscription-management")}
                            className={`cursor-pointer ${
                                url === "/subscription-management"
                                    ? "text-white bg-indigo-300 block p-2 rounded"
                                    : "text-black block p-2 rounded hover:bg-indigo-100"
                            }`}
                        >
                            Subscription Management
                        </Link>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="text-black block p-2 rounded hover:bg-indigo-100"
                        >
                            User Management
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
