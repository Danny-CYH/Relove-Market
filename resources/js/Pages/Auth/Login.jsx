import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

import { Link, useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, reset } = useForm({
        email: "",
        password: "",
        reset_email: "",
        reset_password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const resetLink_submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <div className="h-96 bg-white">
            {/* Modal for resetting password */}
            <dialog
                id="my_modal_5"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box bg-white">
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
                            id="resetPassword_email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            placeholder="Your email address"
                            value={data.reset_email}
                            className="mt-1 block w-full"
                            isFocused={true}
                            onChange={(e) =>
                                setData("reset_email", e.target.value)
                            }
                        />

                        <div className="mt-4 flex items-center justify-between">
                            <button
                                type="button"
                                className="btn"
                                onClick={() =>
                                    document
                                        .getElementById("my_modal_5")
                                        .close()
                                }
                            >
                                Close
                            </button>
                            <PrimaryButton
                                className="ms-4"
                                disabled={processing}
                            >
                                Send Reset Link
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </dialog>

            <Navbar />
            <div className="flex items-center justify-center mt-10 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl border">
                    {/* Left Form Section */}
                    <div className="flex flex-col justify-center items-center p-10 shadow-md">
                        <div className="w-full max-w-md">
                            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-black">
                                Hey! Welcome Back!
                            </h2>

                            <form onSubmit={submit} className="space-y-4">
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    autoComplete="off"
                                    isFocused={true}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="w-full border rounded px-4 py-2"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full border rounded px-4 py-2"
                                />

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
                                        // href={route("password.request")}
                                        className="font-bold text-sm text-blue-800 hover:text-blue-500"
                                        onClick={() =>
                                            document
                                                .getElementById("my_modal_5")
                                                .showModal()
                                        }
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700"
                                    disabled={processing}
                                >
                                    Sign In
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
