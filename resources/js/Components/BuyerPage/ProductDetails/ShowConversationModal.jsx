import { X } from "lucide-react";

export function ShowConversationModal({
    setInitialMessage,
    initialMessage,
    setShowConversationModal,
    startConversation,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl lg:rounded-2xl max-w-md w-full">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b">
                    <h2 className="text-lg lg:text-xl text-black font-semibold">
                        Message Seller
                    </h2>
                    <button
                        onClick={() => setShowConversationModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form
                    onSubmit={startConversation}
                    className="p-4 lg:p-6 space-y-4"
                >
                    <textarea
                        value={initialMessage}
                        onChange={(e) => setInitialMessage(e.target.value)}
                        placeholder="Type your message to the seller..."
                        className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                        rows="4"
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowConversationModal(false)}
                            className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm lg:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!initialMessage.trim()}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm lg:text-base"
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
