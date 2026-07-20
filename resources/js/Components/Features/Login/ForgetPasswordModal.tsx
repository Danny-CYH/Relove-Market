import { FaLock, FaTimes } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

import TextInput from "../../Ui/TextInput";
import { Button } from "@/Components/Ui/Button";
import { Icon } from "@/Components/Ui/Icon";

export function ForgetPasswordModal({
    resetEmail,
    setResetEmail,
    resetLink_submit,
    handleCloseForgetModal,
    isLoading,
}) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={handleCloseForgetModal}
                ></div>

                <div className="relative bg-white rounded-2xl px-6 pt-6 pb-6 text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-md sm:w-full sm:p-8">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
                    <button
                        type="button"
                        className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={handleCloseForgetModal}
                    >
                        <Icon icon={FaTimes} className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col items-center sm:items-start sm:flex-row sm:gap-4">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left">
                            <h3 className="text-xl font-bold text-gray-900">
                                Reset Password
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter your email address and we'll send you a
                                link to reset your password.
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={resetLink_submit}
                        method="POST"
                        className="mt-6"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Icon
                                        icon={FiMail}
                                        className="h-4 w-4 text-gray-400"
                                    />
                                </div>
                                <TextInput
                                    type="email"
                                    placeholder="you@example.com"
                                    value={resetEmail}
                                    onChange={(e) =>
                                        setResetEmail(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            resetLink_submit(e);
                                        }
                                    }}
                                    className="pl-9 w-full text-black"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                            <Icon icon={FaLock} className="h-3 w-3" />
                            <span>We'll send a secure link to your email</span>
                        </div>

                        <div className="mt-5 flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                loadingText="Sending..."
                                buttonText="Send Reset Link"
                                className="flex-1"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
