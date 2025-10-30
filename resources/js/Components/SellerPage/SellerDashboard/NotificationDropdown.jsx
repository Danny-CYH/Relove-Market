import {
    faTimes,
    faBell,
    faCircleCheck,
    faTriangleExclamation,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link } from "@inertiajs/react";

export function NotificationDropdown({
    showNotificationDropdown,
    notifications,
    setNotifications,
    setShowNotificationDropdown,
}) {
    if (!showNotificationDropdown) return null;

    return (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setNotifications([])}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                    >
                        Clear all
                    </button>
                    <button
                        onClick={() => setShowNotificationDropdown(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            notification.type === "success"
                                                ? "bg-green-100"
                                                : notification.type ===
                                                  "warning"
                                                ? "bg-yellow-100"
                                                : "bg-blue-100"
                                        }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                notification.type === "success"
                                                    ? faCircleCheck
                                                    : notification.type ===
                                                      "warning"
                                                    ? faTriangleExclamation
                                                    : faCircleInfo
                                            }
                                            className={
                                                notification.type === "success"
                                                    ? "text-green-600 text-sm"
                                                    : notification.type ===
                                                      "warning"
                                                    ? "text-yellow-600 text-sm"
                                                    : "text-blue-600 text-sm"
                                            }
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {notification.timestamp.toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="text-gray-400 mb-2">
                            <FontAwesomeIcon
                                icon={faBell}
                                className="h-8 w-8"
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            No notifications yet
                        </p>
                    </div>
                )}
            </div>

            {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <Link
                        href={route("seller-manage-order")}
                        className="block text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        onClick={() => setShowNotificationDropdown(false)}
                    >
                        View All Orders
                    </Link>
                </div>
            )}
        </div>
    );
}
