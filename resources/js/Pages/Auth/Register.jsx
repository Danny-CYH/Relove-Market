import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

import TextInput from "@/Components/TextInput";

import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Register() {
    const { flash } = usePage().props;
    const [showEmailVerificationModal, setShowEmailVerificationModal] =
        useState();
    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);

    const {
        data: registerData,
        setData: setRegisterData,
        post: postRegister,
        processing: processingRegister,
        reset,
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const {
        data: verifyData,
        setData: setVerifyData,
        post: postResendEmail,
        processing: processingResendEmail,
    } = useForm({
        email: "",
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

        if (showEmailVerificationModal) {
            setVerifyData("email", registerData.email);
        }
    }, [
        flash?.successMessage,
        flash?.errorMessage,
        showEmailVerificationModal,
    ]);

    const register_submit = (e) => {
        e.preventDefault();

        postRegister(route("register"), {
            onSuccess: () => {
                if (flash?.errorMessage != null) {
                    reset("name", "email", "password", "password_confirmation");

                    setShowEmailVerificationModal(true);
                }
            },
        });
    };

    const resend_emailVerification = (e) => {
        e.preventDefault();

        postResendEmail(route("custom.verification.send"), {
            onSuccess: () => {
                setShowEmailVerificationModal(false);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 5000);
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
                            {flash.errorMessage}
                        </span>
                    </div>
                </div>
            )}
            {/* end of toast */}

            {/* Toast for showing success resend reset link */}
            {/* {showSuccessToast && (
                <div className="toast toast-center md:toast-end">
                    <div className="alert alert-success">
                        <span className="text-white font-bold">
                            We have resend the verification email to you.
                        </span>
                    </div>
                </div>
            )} */}
            {/* end of toast */}

            {/* Modal for sending email verification */}
            <dialog
                className={`modal modal-bottom sm:modal-middle ${
                    showEmailVerificationModal ? "modal-open" : ""
                }`}
            >
                <div className="modal-box bg-white relative">
                    <button
                        className="btn btn-sm btn-circle btn-ghost text-black absolute right-2 top-5 md:top-2 hover:bg-transparent hover:text-black active:bg-transparent"
                        onClick={() => setShowEmailVerificationModal(false)}
                    >
                        ✕
                    </button>
                    <h3 className="font-bold text-lg text-black">
                        Verify Your Email
                    </h3>
                    <p className="py-4 text-black">
                        Thanks for signing up! Before getting started, could you
                        verify your email address by clicking on the link we
                        just emailed to you? If you didn't receive the email, we
                        will gladly send you another.
                    </p>
                    <form onSubmit={resend_emailVerification}>
                        <TextInput
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Your Email Address"
                            value={verifyData.email}
                            className="mt-1 hidden w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setVerifyData("email", e.target.value)
                            }
                        />

                        <div className="flex flex-row justify-end">
                            <button
                                className={`btn flex items-center gap-2 transition-all duration-200
        ${
            processingResendEmail
                ? "text-black cursor-not-allowed"
                : "btn-primary"
        }
    `}
                                disabled={processingResendEmail}
                            >
                                {processingResendEmail && (
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
                                {processingResendEmail
                                    ? "Sending..."
                                    : "Resend Verification Email"}
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
            {/* end of modal */}

            {/* start of register page */}
            <Navbar />
            <div className="flex items-center justify-center mt-10 mb-10 mx-3 md:mx-0">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl border">
                    {/* Left Image Section */}
                    <div className="hidden md:block">
                        <img
                            src="../image/register_bg.jpg"
                            alt="Shopping Woman"
                            className="h-[35rem] w-full object-cover"
                        />
                    </div>

                    {/* Right Form Section */}
                    <div className="flex flex-col justify-center items-center p-10 shadow-md">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-black">
                                Hi! Welcome to <br className="md:hidden" />
                                Relove Market
                            </h2>

                            <form
                                onSubmit={register_submit}
                                className="space-y-4"
                            >
                                <TextInput
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={registerData.name}
                                    placeholder="Full Name"
                                    className="w-full border rounded px-4 py-2 md:mb-0"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setRegisterData("name", e.target.value)
                                    }
                                />

                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    value={registerData.email}
                                    placeholder="Email"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={(e) =>
                                        setRegisterData("email", e.target.value)
                                    }
                                />

                                <TextInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={registerData.password}
                                    placeholder="Password"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={(e) =>
                                        setRegisterData(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                />

                                <TextInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={registerData.password_confirmation}
                                    placeholder="Password Confirmation"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setRegisterData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <button
                                    className={`flex items-center gap-2 w-full justify-center bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition-all duration-200
        ${processingRegister ? "text-black cursor-not-allowed" : "btn-primary"}
    `}
                                    disabled={processingRegister}
                                >
                                    {processingRegister && (
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
                                    {processingRegister
                                        ? "Signing Up..."
                                        : "Sign Up"}
                                </button>
                            </form>

                            <p className="text-center text-sm mt-4 text-black">
                                Already have an account?{" "}
                                <Link
                                    href={route("login")}
                                    className="text-blue-600 font-medium hover:font-bold hover:text-blue-800"
                                >
                                    Sign In
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
                                    Sign Up with Google
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
                                    Sign Up with Facebook
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
