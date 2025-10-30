import { Star } from "lucide-react";

export function FeaturedToggleButton({
    product,
    subscription,
    canPerformAction,
    isProductFeatured,
    toggleProductFeatured,
    togglingProduct,
}) {
    const isFeatured = isProductFeatured(product.product_id);
    const isTrialUser = subscription?.subscription_plan_id === "PLAN-TRIAL";

    return (
        <button
            onClick={() => toggleProductFeatured(product)}
            disabled={
                togglingProduct === product.product_id ||
                (!canPerformAction("featureProduct") && !isTrialUser)
            }
            className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                isFeatured
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300"
            } ${
                togglingProduct === product.product_id ||
                (!canPerformAction("featureProduct") && !isTrialUser)
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-105"
            }`}
            title={
                isTrialUser
                    ? isFeatured
                        ? "Click to unfeature"
                        : "Click to feature"
                    : canPerformAction("featureProduct")
                    ? isFeatured
                        ? "Click to unfeature"
                        : "Click to feature"
                    : "Upgrade to feature products"
            }
        >
            {togglingProduct === product.product_id ? (
                <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full mr-1"></div>
            ) : (
                <Star
                    size={14}
                    className={`mr-1 ${
                        isFeatured
                            ? "fill-yellow-400 text-yellow-600"
                            : "text-gray-500"
                    }`}
                />
            )}
            <span className="font-medium">
                {isFeatured ? "Featured" : "Feature"}
            </span>
            {/* Show trial indicator for trial users */}
            {isTrialUser && !isFeatured && (
                <span className="ml-1 text-green-600 text-xs">• Free</span>
            )}
        </button>
    );
}
