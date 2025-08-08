import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";

import TextInput from "@/Components/TextInput";

import { Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Login() {
    const { flash, token, email } = usePage().props;

    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);

    const [showResetModal, setShowResetModal] = useState();
    const [showForgetModal, setShowForgetModal] = useState();

    const [showPassword, setShowPassword] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // login account
    const {
        data: loginData,
        setData: setLoginData,
        post: postLogin,
        processing: processingLogin,
    } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // forget password
    const {
        data: forgetData,
        setData: setForgetData,
        post: postForget,
        processing: processingForget,
    } = useForm({
        email: "",
    });

    // reset password
    const {
        data: resetData,
        setData: setResetData,
        post: postReset,
        processing: processingReset,
    } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (flash?.successMessage) {
            setShowSuccessToast(true);
            const timer = setTimeout(() => setShowSuccessToast(false), 5000);
            return () => clearTimeout(timer);
        }

        if (flash?.errorMessage) {
            setShowErrorToast(true);
            const timer = setTimeout(() => setShowErrorToast(false), 5000);
            return () => clearTimeout(timer);
        }

        if (resetData.token && resetData.email) {
            setShowResetModal(true); // Automatically open modal
        }

        if (window.location.pathname.includes("/reset-password/")) {
            const pathSegments = window.location.pathname.split("/");
            const tokenFromPath = pathSegments[pathSegments.length - 1];
            const emailFromURL = new URL(window.location.href).searchParams.get(
                "email"
            );

            if (tokenFromPath && emailFromURL) {
                setResetData("token", tokenFromPath);
                setResetData("email", emailFromURL);
            }
        }

        if (flash.cleanUrl) {
            window.history.replaceState({}, "", "/reset-password");
        }
    }, [
        flash?.succesMessage,
        flash?.errorMessage,
        resetData.token,
        resetData.email,
        flash.cleanUrl,
    ]);

    // link for login into the account
    const loginAccount_submit = async (e) => {
        e.preventDefault();

        // Check value of the email and password
        if (!loginData.email || !loginData.password) {
            setErrorMessage("Field cannot blank...");
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 5000);
        } else {
            postLogin(route("login"), {
                onError: () => {
                    setErrorMessage(
                        "Login Failed...Please check your credential!"
                    );
                    setShowErrorToast(true);
                    setTimeout(() => setShowErrorToast(false), 5000);
                },
            });
        }
    };

    // link for sending the reset password
    const resetLink_submit = (e) => {
        e.preventDefault();

        postForget(route("password.email"), {
            email: forgetData.user_email,
            onSuccess: () => {
                setShowForgetModal(false);
            },
            onError: (errors) => {
                setShowForgetModal(false);
                setErrorMessage(errors.email);
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            },
        });
    };

    // Link for submit the new password
    const updatePassword_submit = (e) => {
        e.preventDefault();

        postReset(route("password.store"), {
            email: resetData.email,
            token: token,
            password: resetData.password,
            password_confirmation: resetData.password_confirmation,

            onSuccess: () => {
                setShowResetModal(false);
            },
        });
    };

    return (
        <div className="h-96 bg-white">
            {/* Toast for displaying success message */}
            {showSuccessToast && (
                <div className="toast toast-center md:toast-end">
                    <div className="alert alert-success">
                        <span className="text-green-800 font-bold">
                            {flash.successMessage}
                        </span>
                    </div>
                </div>
            )}
            {/* end of toast */}

            {/* toast for displaying error message */}
            {showErrorToast && (
                <div className="toast toast-center md:toast-end">
                    <div className="alert alert-error">
                        <span className="text-white font-bold">
                            {flash.errorMessage || errorMessage}
                        </span>
                    </div>
                </div>
            )}
            {/* end of toast */}

            {/* Modal for sending resetting link */}
            <dialog
                className={`modal modal-bottom sm:modal-middle ${
                    showForgetModal ? "modal-open" : ""
                }`}
            >
                <div className="modal-box bg-white">
                    <button
                        type="button"
                        onClick={() => setShowForgetModal(false)}
                        className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-5 md:top-2 hover:bg-transparent hover:text-black active:bg-transparent"
                    >
                        ✕
                    </button>
                    <h3 className="font-bold text-lg text-black">
                        Forgot your password?
                    </h3>
                    <p className="py-4 text-black">
                        No problem. Just let us know your email address and we
                        will email you a password reset link that will allow you
                        to choose a new one.
                    </p>
                    <form onSubmit={resetLink_submit}>
                        <TextInput
                            id="user_email"
                            type="email"
                            name="user_email"
                            autoComplete="off"
                            placeholder="Your Email Address"
                            value={forgetData.email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setForgetData("email", e.target.value)
                            }
                        />

                        <div className="mt-4 flex items-center justify-end">
                            <button
                                className={`btn flex items-center gap-2 transition-all duration-200
        ${processingForget ? "text-black cursor-not-allowed" : "btn-primary"}
    `}
                                disabled={processingForget}
                            >
                                {processingForget && (
                                    <svg
                                        className="animate-spin h-4 w-4 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                )}
                                {processingForget
                                    ? "Sending..."
                                    : "Send Reset Link"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            {/* end of modal */}

            {/* modal for resetting new password */}
            <dialog
                className={`modal modal-bottom sm:modal-middle ${
                    showResetModal ? "modal-open" : ""
                }`}
            >
                <div className="modal-box bg-white">
                    <button
                        type="button"
                        onClick={() => setShowResetModal(false)}
                        className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-5 md:top-2 hover:bg-transparent hover:text-black active:bg-transparent"
                    >
                        ✕
                    </button>
                    <h3 className="font-bold text-lg text-black">
                        Reset Your Password
                    </h3>
                    <p className="py-4 text-black">
                        Enter your new password below.
                    </p>
                    <form onSubmit={updatePassword_submit}>
                        <TextInput
                            id="target_email"
                            type="email"
                            name="target_email"
                            value={resetData.email}
                            readOnly={true}
                            className="mt-1 block w-full text-black"
                            isFocused={true}
                            onChange={() =>
                                setResetData("email", resetData.email)
                            }
                        />

                        <TextInput
                            id="target_password"
                            name="target_password"
                            type="password"
                            placeholder="New password"
                            className="input input-bordered w-full my-2"
                            value={resetData.password}
                            onChange={(e) =>
                                setResetData("password", e.target.value)
                            }
                        />
                        <TextInput
                            id="target_passwordConfirmation"
                            name="target_passwordConfirmation"
                            type="password"
                            placeholder="Confirm Password"
                            className="input input-bordered w-full my-2"
                            value={resetData.password_confirmation}
                            onChange={(e) =>
                                setResetData(
                                    "password_confirmation",
                                    e.target.value
                                )
                            }
                        />
                        <div className="mt-4 flex items-center justify-end">
                            <button
                                type="submit"
                                className={`btn flex items-center gap-2 transition-all duration-200
        ${processingReset ? "text-black cursor-not-allowed" : "btn-primary"}
    `}
                                disabled={processingReset}
                            >
                                {processingReset && (
                                    <svg
                                        className="animate-spin h-4 w-4 text-black"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        ></path>
                                    </svg>
                                )}
                                {processingReset
                                    ? "Updating..."
                                    : "Reset Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            {/* end of modal */}

            {/* start of login page */}
            <Navbar />
            <div className="flex items-center justify-center mt-10 mb-10 mx-3 md:mx-0">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl border">
                    {/* Left Form Section */}
                    <div className="flex flex-col justify-center items-center p-10 shadow-md">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-black">
                                Hey! Welcome Back!
                            </h2>

                            <form
                                onSubmit={loginAccount_submit}
                                className="space-y-4"
                            >
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    isFocused={true}
                                    value={loginData.email}
                                    onChange={(e) =>
                                        setLoginData("email", e.target.value)
                                    }
                                    className="w-full rounded px-4 py-2"
                                />
                                <div className="relative w-full">
                                    <TextInput
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Password"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded px-4 py-2 pr-10" // add pr-10 to make space for the icon
                                    />

                                    {/* Eye Icon Button */}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            // 👁️ Eye Off Icon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3.98 8.223A10.477 10.477 0 001.5 12c1.74 4.042 5.742 7 
                            10.5 7a10.47 10.47 0 005.09-1.273M15 12a3 3 0 
                            11-6 0 3 3 0 016 0zm6.02 3.777A10.477 10.477 0 
                            0022.5 12c-1.74-4.042-5.742-7-10.5-7a10.47 
                            10.47 0 00-5.09 1.273M3 3l18 18"
                                                />
                                            </svg>
                                        ) : (
                                            // 👁️ Eye Icon
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 
                            8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 
                            7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="flex flex-row justify-between">
                                    <label className="label cursor-pointer text-black">
                                        <input
                                            type="checkbox"
                                            className="appearance-none w-5 h-5 border border-indigo-600 checked:bg-indigo-600 rounded-sm"
                                        />
                                        <span className="label-text mr-2">
                                            Remember me
                                        </span>
                                    </label>
                                    <button
                                        type="button"
                                        className="font-bold text-sm text-blue-800 hover:text-blue-500"
                                        onClick={() => setShowForgetModal(true)}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    className={`flex items-center gap-2 w-full justify-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition-all duration-200
        ${processingLogin ? "text-black cursor-not-allowed" : "btn-primary"}
    `}
                                    disabled={processingLogin}
                                >
                                    {processingLogin && (
                                        <svg
                                            className="animate-spin h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>
                                    )}
                                    {processingLogin
                                        ? "Signing In..."
                                        : "Sign In"}
                                </button>
                            </form>

                            <p className="text-center text-sm mt-4 text-black">
                                Not have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="text-blue-600 font-medium hover:font-bold hover:text-blue-800"
                                >
                                    Sign Up
                                </Link>
                            </p>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-grow h-px bg-gray-300"></div>
                                <span className="mx-2 text-sm text-gray-500">
                                    Or with email
                                </span>
                                <div className="flex-grow h-px bg-gray-300"></div>
                            </div>

                            {/* OAuth Buttons */}
                            <div className="flex flex-col justify-center sm:flex-row gap-4">
                                <button className="btn bg-white text-black border-[#e5e5e5]">
                                    <svg
                                        aria-label="Google logo"
                                        width="16"
                                        height="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                    >
                                        <g>
                                            <path
                                                d="m0 0H512V512H0"
                                                fill="#fff"
                                            ></path>
                                            <path
                                                fill="#34a853"
                                                d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                                            ></path>
                                            <path
                                                fill="#4285f4"
                                                d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                                            ></path>
                                            <path
                                                fill="#fbbc02"
                                                d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                                            ></path>
                                            <path
                                                fill="#ea4335"
                                                d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                                            ></path>
                                        </g>
                                    </svg>
                                    Sign In with Google
                                </button>
                                <button className="btn text-black bg-white border-[#e5e5e5]">
                                    <svg
                                        aria-label="Facebook logo"
                                        width="16"
                                        height="16"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 32 32"
                                    >
                                        <path
                                            fill="blue"
                                            d="M8 12h5V8c0-6 4-7 11-6v5c-4 0-5 0-5 3v2h5l-1 6h-4v12h-6V18H8z"
                                        ></path>
                                    </svg>
                                    Sign In with Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Right Image Section */}
                    <div className="hidden md:block">
                        <img
                            src="../image/login_bg.jpg"
                            alt="Shopping Woman"
                            className="h-[33rem] w-full object-cover"
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
