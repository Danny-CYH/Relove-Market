import {
    Edit3,
    Save,
    X,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Settings,
} from "lucide-react";

import dayjs from "dayjs";
import { usePage } from "@inertiajs/react";

export function ProfileTab({
    formData,
    isEditing,
    setIsEditing,
    loading,
    handleSave,
    handleCancel,
    handleInputChange,
}) {
    const { auth } = usePage().props;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex-row md:flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Profile Information
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your personal information and preferences
                        </p>
                    </div>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center bg-blue-600 text-white px-4 py-2.5 mt-5 md:mt-0 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            <Edit3 size={18} className="mr-2" />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Save size={18} className="mr-2" />
                                )}
                                {loading ? "Saving..." : "Save Changes"}
                            </button>

                            {/* Cancel Button */}
                            <button
                                onClick={handleCancel}
                                className="flex items-center bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                            >
                                <X size={18} className="mr-2" />
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User size={20} className="mr-2 text-blue-600" />
                            Personal Information
                        </h3>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your full name"
                                autoComplete="off"
                            />
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <User
                                    size={20}
                                    className="text-gray-400 mr-3"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.name}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your email"
                                autoComplete="off"
                            />
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <Mail
                                    size={20}
                                    className="text-gray-400 mr-3"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.email}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleInputChange}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your phone number"
                                autoComplete="off"
                            />
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <Phone
                                    size={20}
                                    className="text-gray-400 mr-3"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.phone || "No update"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Member Since
                        </label>
                        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <Calendar
                                size={20}
                                className="text-gray-400 mr-3"
                            />
                            <span className="text-gray-900 font-medium">
                                {dayjs(auth.user.created_at).format(
                                    "MMMM YYYY"
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        {isEditing ? (
                            <textarea
                                name="address"
                                value={formData.address || ""}
                                onChange={handleInputChange}
                                rows={3}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your address"
                            />
                        ) : (
                            <div className="flex items-start p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <MapPin
                                    size={20}
                                    className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.address || "No update"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="city"
                                value={formData.city || ""}
                                onChange={handleInputChange}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your city"
                                autoComplete="off"
                            />
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <Mail
                                    size={20}
                                    className="text-gray-400 mr-3"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.city || "No update"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zip Code
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="zip_code"
                                value={formData.zip_code || ""}
                                onChange={handleInputChange}
                                className="text-black w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your zip code"
                                autoComplete="off"
                            />
                        ) : (
                            <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-200">
                                <Mail
                                    size={20}
                                    className="text-gray-400 mr-3"
                                />
                                <span className="text-gray-900 font-medium">
                                    {formData.zip_code || "No update"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Preferences Section */}
                    <div className="lg:col-span-2 mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Settings
                                size={20}
                                className="mr-2 text-purple-600"
                            />
                            Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Newsletter
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Receive product updates
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        defaultChecked
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        SMS Notifications
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Order updates via SMS
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
