import { useState, useEffect } from "react";

import dayjs from "dayjs";

import { Sidebar } from "@/Components/AdminPage/Sidebar";
import { LoadingProgress } from "@/Components/AdminPage/LoadingProgress";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle user selection
    const toggleUserSelection = (userId) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    // Select all users on current page
    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map((user) => user.user_id));
        }
    };

    // Block selected users
    const blockUsers = () => {
        setUsers(
            users.map((user) =>
                selectedUsers.includes(user.user_id)
                    ? { ...user, status: "Blocked" }
                    : user
            )
        );
        setSelectedUsers([]);
    };

    // Unblock selected users
    const unblockUsers = () => {
        setUsers(
            users.map((user) =>
                selectedUsers.includes(user.id)
                    ? { ...user, status: "Active" }
                    : user
            )
        );
        setSelectedUsers([]);
    };

    // Delete selected users
    const deleteUsers = () => {
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
    };

    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(
                `/admin/user-management/list?page=${page}&search=${filter}&status=${statusFilter}&role=${roleFilter}`
            );
            const data = await response.json();

            setUsers(data.data);
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);

            setPagination({
                from: data.from,
                to: data.to,
                total: data.total,
                current_page: data.current_page,
                last_page: data.last_page,
            });
        } catch (err) {
            console.error("Error fetching users:", err);
        }
        setLoading(false);
    };

    // Reset page to 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, roleFilter]);

    // Fetch users whenever page or filters change
    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, filter]);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <Sidebar pendingCount={3} />

            {/* Main Content */}
            <main className="flex-1 p-4 mt-14 z-70 lg:p-6 md:z-10 md:mt-0">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header with title and actions */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    User Management
                                </h2>
                                <p className="text-gray-600">
                                    Manage platform users and permissions
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {selectedUsers.length > 0 && (
                                    <>
                                        <button
                                            onClick={blockUsers}
                                            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                        >
                                            Block Selected
                                        </button>
                                        <button
                                            onClick={unblockUsers}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                        >
                                            Unblock Selected
                                        </button>
                                        <button
                                            onClick={deleteUsers}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                                        >
                                            Delete Selected
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Search Bar - Left */}
                            <div className="flex items-center border border-gray-300 rounded-md w-full">
                                <div className="pl-3 pr-2 py-2">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="flex-1 text-black pr-4 py-2 focus:outline-none border-none"
                                />
                            </div>

                            {/* Filters - Right */}
                            <div className="flex flex-col md:flex-row gap-4 md:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full md:w-40 text-black border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Blocked">Blocked</option>
                                    <option value="Pending">Pending</option>
                                </select>

                                <select
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    className="w-full md:w-40 text-black border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Buyer">Buyer</option>
                                    <option value="Seller">Seller</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <LoadingProgress
                                modalType={"success"}
                                modalMessage={"Loading..."}
                            />
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <table className="hidden min-w-full divide-y divide-gray-200 md:table">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedUsers.length ===
                                                            users.length &&
                                                        users.length > 0
                                                    }
                                                    onChange={toggleSelectAll}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                User
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Role
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Registration Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Last Login
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr
                                                    key={user.user_id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(
                                                                user.user_id
                                                            )}
                                                            onChange={() =>
                                                                toggleUserSelection(
                                                                    user.user_id
                                                                )
                                                            }
                                                            className="rounded text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                                <span className="text-indigo-800 font-medium">
                                                                    <img
                                                                        src={
                                                                            user.avatar
                                                                                ? `/storage/avatars/${user.avatar}`
                                                                                : "../image/shania_yan.png"
                                                                        }
                                                                        alt={
                                                                            user.name
                                                                        }
                                                                        className="h-10 w-10 rounded-full object-cover mr-2"
                                                                    />
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-black text-sm">
                                                            {
                                                                user.role
                                                                    .role_name
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.status ===
                                                                "Active"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : user.status ===
                                                                      "Blocked"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {dayjs(
                                                            user.created_at
                                                        ).format(
                                                            "DD/MM/YYYY HH:mm"
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.last_login_at ==
                                                        null
                                                            ? "Not Login Yet"
                                                            : dayjs(
                                                                  user.last_login_at
                                                              ).format(
                                                                  "DD/MM/YYYY HH:mm"
                                                              )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                            Edit
                                                        </button>
                                                        {user.status ===
                                                        "Active" ? (
                                                            <button
                                                                onClick={() => {
                                                                    setUsers(
                                                                        users.map(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id ===
                                                                                user.id
                                                                                    ? {
                                                                                          ...u,
                                                                                          status: "Blocked",
                                                                                      }
                                                                                    : u
                                                                        )
                                                                    );
                                                                }}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setUsers(
                                                                        users.map(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id ===
                                                                                user.id
                                                                                    ? {
                                                                                          ...u,
                                                                                          status: "Active",
                                                                                      }
                                                                                    : u
                                                                        )
                                                                    );
                                                                }}
                                                                className="text-green-600 hover:text-green-900"
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                                >
                                                    No users found matching your
                                                    criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Mobile Cards */}
                                <div className="md:hidden p-4 space-y-4">
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <div
                                                key={user.user_id}
                                                className="bg-white border rounded-lg p-4 shadow-sm"
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedUsers.includes(
                                                                user.user_id
                                                            )}
                                                            onChange={() =>
                                                                toggleUserSelection(
                                                                    user.user_id
                                                                )
                                                            }
                                                            className="rounded text-indigo-600 focus:ring-indigo-500 mr-3"
                                                        />
                                                        <img
                                                            src={
                                                                user.avatar
                                                                    ? `/storage/avatars/${user.avatar}`
                                                                    : "../image/shania_yan.png"
                                                            }
                                                            alt={user.name}
                                                            className="h-12 w-12 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                                                            Edit
                                                        </button>
                                                        {user.status ===
                                                        "Active" ? (
                                                            <button
                                                                onClick={() => {
                                                                    setUsers(
                                                                        users.map(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id ===
                                                                                user.id
                                                                                    ? {
                                                                                          ...u,
                                                                                          status: "Blocked",
                                                                                      }
                                                                                    : u
                                                                        )
                                                                    );
                                                                }}
                                                                className="text-red-600 hover:text-red-900 text-sm"
                                                            >
                                                                Block
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    setUsers(
                                                                        users.map(
                                                                            (
                                                                                u
                                                                            ) =>
                                                                                u.id ===
                                                                                user.id
                                                                                    ? {
                                                                                          ...u,
                                                                                          status: "Active",
                                                                                      }
                                                                                    : u
                                                                        )
                                                                    );
                                                                }}
                                                                className="text-green-600 hover:text-green-900 text-sm"
                                                            >
                                                                Unblock
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="mb-2">
                                                    <div className="font-medium text-gray-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-black font-medium">
                                                            Role:
                                                        </span>
                                                        <span className="text-gray-600 ml-1">
                                                            {
                                                                user.role
                                                                    .role_name
                                                            }
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-black font-medium">
                                                            Status:
                                                        </span>
                                                        <span
                                                            className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                user.status ===
                                                                "Active"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : user.status ===
                                                                      "Blocked"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-yellow-100 text-yellow-800"
                                                            }`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-black font-medium">
                                                            Registered:
                                                        </span>
                                                        <span className="text-gray-500 ml-1">
                                                            {dayjs(
                                                                user.created_at
                                                            ).format(
                                                                "DD/MM/YYYY"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-black text-sm font-medium">
                                                        Last Login:
                                                    </span>
                                                    <span className="text-red-400 text-sm font-bold ml-1">
                                                        {user.last_login_at ==
                                                        null
                                                            ? "Never"
                                                            : dayjs(
                                                                  user.last_login_at
                                                              ).format(
                                                                  "DD/MM/YYYY"
                                                              )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                                            No users found matching your
                                            criteria.
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="font-medium">
                                    {pagination.from}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                    {pagination.to}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
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
                </div>
            </main>
        </div>
    );
}
