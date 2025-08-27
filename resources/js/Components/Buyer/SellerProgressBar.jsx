const steps = ["Account Info", "Store Info", "Review & Submit"];

export function SellerProgressBar({ currentStep }) {
    return (
        <div className="w-full px-6 py-6 bg-gray-50">
            <div className="relative flex justify-between items-center max-w-4xl mx-auto">
                {steps.map((step, index) => {
                    const isActive = index + 1 === currentStep;
                    const isCompleted = index + 1 < currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center w-full"
                        >
                            {/* Connection Line */}
                            {!isLast && (
                                <div className="absolute top-6 left-1/2 w-full h-1 -translate-x-1/2 z-0">
                                    <div
                                        className={`h-1 rounded-full ${
                                            isCompleted
                                                ? "bg-gradient-to-r from-green-400 to-green-600"
                                                : "bg-gray-300"
                                        }`}
                                    ></div>
                                </div>
                            )}

                            {/* Step Circle */}
                            <div
                                className={`z-10 w-12 h-12 flex items-center justify-center rounded-full border-2 transition-all duration-300
                ${
                    isCompleted
                        ? "bg-green-500 border-green-600 text-white shadow-lg"
                        : ""
                }
                ${
                    isActive
                        ? "bg-blue-600 border-blue-700 text-white shadow-lg"
                        : ""
                }
                ${
                    !isCompleted && !isActive
                        ? "bg-white border-gray-300 text-gray-500"
                        : ""
                }`}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Step Label */}
                            <p
                                className={`mt-3 text-sm md:text-base text-center font-medium transition-colors duration-300
                ${isActive ? "text-blue-700 font-semibold" : ""}
                ${isCompleted ? "text-green-700" : ""}
                ${!isActive && !isCompleted ? "text-gray-400" : ""}`}
                            >
                                {step}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}