import { Footer } from "@/Components/Buyer/Footer";

import { SellerRegisterForm } from "@/Components/Seller/SellerRegisterForm";
import { SellerProgressBar } from "@/Components/Seller/SellerProgressBar";

import { useState } from "react";

import { Link } from "@inertiajs/react";

export default function SellerRegistration({ list_business }) {
    const [step, setStep] = useState(1); // Track current step

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <SellerProgressBar currentStep={step} />

            <div className="w-full max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
                {/* Left Column: Registration Form */}
                <div className="w-full md:w-1/2">
                    <SellerRegisterForm
                        step={step}
                        setStep={setStep}
                        list_business={list_business}
                    />
                </div>

                {/* Right Column: Instructions */}
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-2xl text-black font-bold">
                        How to Register as a Seller
                    </h2>
                    <ol className="list-decimal list-inside text-gray-700 space-y-2">
                        <li>
                            Fill in your basic account information like name,
                            email, and password.
                        </li>
                        <li>
                            Provide details about your store: name, category,
                            and a short description.
                        </li>
                        <li>
                            Enter your business details, including address and
                            business registration number.
                        </li>
                        <li>
                            Submit your bank information to receive payments.
                        </li>
                        <li>
                            Confirm and review all your details before
                            submission.
                        </li>
                    </ol>
                    <p className="text-sm text-gray-500">
                        Note: All fields are required unless otherwise
                        specified. Your information will be verified before
                        approval.
                    </p>
                    <Link href={route("homepage")}>
                        <button className="btn btn-error mt-3 text-white">
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
