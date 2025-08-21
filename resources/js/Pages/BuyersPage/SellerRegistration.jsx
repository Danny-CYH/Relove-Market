import { Footer } from "@/Components/Buyer/Footer";
import { SellerRegisterForm } from "@/Components/Seller/SellerRegisterForm";
import { SellerProgressBar } from "@/Components/Seller/SellerProgressBar";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

export default function SellerRegistration({ list_business }) {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Progress Bar */}
            <div className="bg-white shadow">
                <SellerProgressBar currentStep={step} />
            </div>

            {/* Main Content */}
            <div className="w-full max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
                {/* Left Column: Registration Form */}
                <div className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Create Your Seller Account
                    </h2>
                    <SellerRegisterForm
                        step={step}
                        setStep={setStep}
                        list_business={list_business}
                    />
                </div>

                {/* Right Column: Instructions */}
                <div className="w-full md:w-1/2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        How to Register as a Seller
                    </h2>
                    <ol className="space-y-4">
                        <li className="flex items-start space-x-3">
                            <FaRegCircle className="mt-1 text-indigo-600" />
                            <span className="text-gray-700">
                                Fill in your basic account information like
                                name, email, and password.
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaRegCircle className="mt-1 text-indigo-600" />
                            <span className="text-gray-700">
                                Provide details about your store: name,
                                category, and a short description.
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaRegCircle className="mt-1 text-indigo-600" />
                            <span className="text-gray-700">
                                Enter your business details, including address
                                and business registration number.
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaRegCircle className="mt-1 text-indigo-600" />
                            <span className="text-gray-700">
                                Submit your bank information to receive
                                payments.
                            </span>
                        </li>
                        <li className="flex items-start space-x-3">
                            <FaRegCircle className="mt-1 text-indigo-600" />
                            <span className="text-gray-700">
                                Confirm and review all your details before
                                submission.
                            </span>
                        </li>
                    </ol>

                    <p className="text-sm text-gray-500">
                        Note: All fields are required unless otherwise
                        specified. Your information will be verified before
                        approval.
                    </p>

                    {/* Actions */}
                    <div className="flex space-x-3 mt-4">
                        <Link href={route("homepage")}>
                            <button className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 transition">
                                Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}