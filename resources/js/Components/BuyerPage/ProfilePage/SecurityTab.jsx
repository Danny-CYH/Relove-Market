import { Lock, Shield, Globe, ChevronRight, X, Eye } from "lucide-react";

export function SecurityTab({
    showChangePassword,
    setShowChangePassword,
    passwordData,
    handlePasswordChange,
    handleSavePassword,
    showPassword,
    setShowPassword,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-2xl font-bold text-gray-900">
                    Security Settings
                </h2>
                <p className="text-gray-600 mt-1">
                    Manage your account security and privacy
                </p>
            </div>

            <div className="p-6 space-y-6">
                {/* Password Section */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start">
                        <div className="bg-blue-100 p-3 rounded-lg mr-4">
                            <Lock size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                Password
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Last changed: 3 months ago
                            </p>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start">
                        <div className="bg-purple-100 p-3 rounded-lg mr-4">
                            <Shield size={24} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Add an extra layer of security to your account
                            </p>
                            <button className="border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>

                {/* Login Activity */}
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-start">
                        <div className="bg-green-100 p-3 rounded-lg mr-4">
                            <Globe size={24} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                Login Activity
                            </h3>
                            <p className="text-gray-600 mb-2">
                                Last login: Today at 2:30 PM
                            </p>
                            <p className="text-gray-600 mb-4">
                                Location: Kuala Lumpur, Malaysia
                            </p>
                            <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium flex items-center">
                                View all login activity
                                <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Change Password
                            </h3>
                            <button
                                onClick={() => setShowChangePassword(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-3">
                            <button
                                onClick={handleSavePassword}
                                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                            >
                                Update Password
                            </button>
                            <button
                                onClick={() => setShowChangePassword(false)}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
