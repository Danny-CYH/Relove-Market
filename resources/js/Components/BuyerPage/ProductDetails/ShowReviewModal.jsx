import { X, Star } from "lucide-react";

export function ShowReviewModal({
    setShowReviewModal,
    handleAddReview,
    setNewReview,
    newReview,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl lg:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 lg:p-6 border-b">
                    <h2 className="text-lg lg:text-xl text-black font-semibold">
                        Write a Review
                    </h2>
                    <button
                        onClick={() => setShowReviewModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form
                    onSubmit={handleAddReview}
                    className="p-4 lg:p-6 space-y-4"
                >
                    <div>
                        <label className="block text-sm text-black font-medium mb-2">
                            Your Rating
                        </label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                        setNewReview((prev) => ({
                                            ...prev,
                                            rating: star,
                                        }))
                                    }
                                    className="text-2xl"
                                >
                                    <Star
                                        className={
                                            star <= newReview.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                        }
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-black font-medium mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) =>
                                setNewReview((prev) => ({
                                    ...prev,
                                    comment: e.target.value,
                                }))
                            }
                            className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                            rows="4"
                            placeholder="Share your experience with this product..."
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={
                            newReview.rating === 0 || !newReview.comment.trim()
                        }
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
}
