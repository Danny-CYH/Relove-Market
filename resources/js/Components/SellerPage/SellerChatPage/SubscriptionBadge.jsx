export function SubscriptionBadge({
    subscriptionLoading,
    getCurrentTierInfo,
    getTrialDaysRemaining,
    isInTrialPeriod,
    conversations,
    isSubscriptionActive
}) {
    if (subscriptionLoading) {
        return (
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm text-gray-600">
                    Loading subscription...
                </span>
            </div>
        );
    }

    const currentTier = getCurrentTierInfo();
    const activeConversations = conversations.filter((conv) => {
        if (!conv.last_message_at) return false;
        const lastMessageDate = new Date(conv.last_message_at);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        return lastMessageDate > thirtyDaysAgo;
    }).length;

    // Use inline styles for colors since dynamic Tailwind classes don't work
    const colorStyles = {
        gray: { bg: "bg-gray-600", text: "text-gray-600" },
        blue: { bg: "bg-blue-600", text: "text-blue-600" },
        purple: { bg: "bg-purple-600", text: "text-purple-600" },
        gold: { bg: "bg-yellow-600", text: "text-yellow-600" },
    };

    const currentColor = colorStyles[currentTier.color] || colorStyles.gray;
    const trialDaysRemaining = getTrialDaysRemaining();
    const inTrial = isInTrialPeriod();

    return (
        <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className={currentColor.text}>{currentTier.icon}</div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-gray-900">
                        {currentTier.name} Plan
                        {inTrial && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Trial: {trialDaysRemaining}d left
                            </span>
                        )}
                    </span>
                    <span className="text-xs text-gray-500">
                        {activeConversations}/{currentTier.maxConversations}{" "}
                        conversations
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                        className={`h-2 rounded-full transition-all duration-300 ${currentColor.bg}`}
                        style={{
                            width: `${Math.min(
                                (activeConversations /
                                    currentTier.maxConversations) *
                                    100,
                                100
                            )}%`,
                        }}
                    ></div>
                </div>

                {/* Show different messages based on subscription status */}
                {!isSubscriptionActive() ? (
                    <p className="text-xs text-red-600 mt-1">
                        Your trial has ended. Upgrade to continue using chat.
                    </p>
                ) : hasReachedLimit() ? (
                    <p className="text-xs text-red-600 mt-1">
                        Conversation limit reached. Upgrade to continue.
                    </p>
                ) : inTrial ? (
                    <p className="text-xs text-green-600 mt-1">
                        You have {trialDaysRemaining} days left in your free
                        trial.
                    </p>
                ) : null}
            </div>
        </div>
    );
}
