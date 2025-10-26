export function NotificationsTab({ notifications, handleNotificationToggle }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-900">
                    Notifications
                </h2>
                <p className="text-gray-600 mt-1">
                    Manage how you receive notifications
                </p>
            </div>

            <div className="p-6 space-y-6">
                {[
                    {
                        key: "email",
                        label: "Email Notifications",
                        description:
                            "Receive order updates and promotions via email",
                    },
                    {
                        key: "sms",
                        label: "SMS Notifications",
                        description: "Get important updates via text message",
                    },
                    {
                        key: "push",
                        label: "Push Notifications",
                        description: "Receive notifications on your device",
                    },
                    {
                        key: "promotions",
                        label: "Promotional Emails",
                        description: "Get special offers and discounts",
                    },
                ].map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        <div>
                            <p className="font-medium text-gray-900">
                                {item.label}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications[item.key]}
                                onChange={() =>
                                    handleNotificationToggle(item.key)
                                }
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
