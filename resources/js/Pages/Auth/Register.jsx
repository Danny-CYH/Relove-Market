import Footer from "@/Components/Footer";
import Navbar from "@/Components/Navbar";

import TextInput from "@/Components/TextInput";

import { Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="h-96 bg-white">
            <Navbar />
            <div className="flex items-center justify-center mt-10 mb-10">
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

                            <form onSubmit={submit} className="space-y-4">
                                <TextInput
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="off"
                                    value={data.name}
                                    placeholder="Full Name"
                                    className="w-full border rounded px-4 py-2 md:mb-0"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                <TextInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    value={data.email}
                                    placeholder="Email"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <TextInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="off"
                                    value={data.password}
                                    placeholder="Password"
                                    className="w-full border rounded px-4 py-2"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <TextInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    placeholder="Password Confirmation"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <button className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700">
                                    Sign Up
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
