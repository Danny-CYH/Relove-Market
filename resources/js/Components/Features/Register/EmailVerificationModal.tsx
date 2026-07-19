import Button from "@/Components/Ui/Button";

export function EmailVerificationModal({
    isLoading,
    onClose,
    email,
    resendEmail,
}) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                    <div className="absolute top-0 right-0 pt-4 pr-4">
                        <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Verify Your Email
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Thanks for signing up! Before getting
                                    started, could you verify your email address
                                    by clicking on the link we just emailed to
                                    you? If you didn't receive the email, we
                                    will gladly send you another.
                                </p>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Email sent to: {email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={resendEmail} method="POST" className="mt-5">
                        <input type="hidden" name="user_email" value={email} />
                        <div className="mt-5 sm:mt-6">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                loadingText="Sending..."
                                buttonText="Resend Email"
                                variant="primary"
                                fullWidth={true}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
