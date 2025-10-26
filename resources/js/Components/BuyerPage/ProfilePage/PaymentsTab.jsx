import { Plus, CreditCard } from "lucide-react";

import { EmptyState } from "./EmptyState";

export function PaymentsTab({ paymentMethods }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Payment Methods
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Manage your saved payment methods
                        </p>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                        <Plus size={18} className="mr-2" />
                        Add New Card
                    </button>
                </div>
            </div>

            <div className="p-6">
                {paymentMethods.length === 0 ? (
                    <EmptyState
                        icon={CreditCard}
                        title="No payment methods"
                        description="Add a payment method to make checkout faster"
                        actionText="Add Payment Method"
                    />
                ) : (
                    <div className="space-y-4">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                            <CreditCard
                                                size={20}
                                                className="text-gray-600"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 capitalize">
                                                {method.brand} ••••{" "}
                                                {method.last4}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Expires {method.expiry}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {method.isDefault && (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                Default
                                            </span>
                                        )}
                                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
