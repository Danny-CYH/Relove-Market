import React, { useEffect, useState } from "react";

import { usePage, useForm } from "@inertiajs/react";

import TextInput from "../TextInput";
import InputLabel from "../InputLabel";

const SellerRegistrationForm = ({ step, setStep }) => {
    const fieldStepMap = {
        // Step 1
        name: 1,
        email: 1,
        phoneNumber: 1,

        // Step 2
        storeName: 2,
        storeLicense: 2,
        storeDescription: 2,
        storeAddress: 2,
        storeCity: 2,
        storeState: 2,
    };

    const states = ["Selangor", "Johor", "Penang", "Sabah", "Sarawak"];
    const cities = [
        "Kuala Lumpur",
        "Shah Alam",
        "Johor Bahru",
        "George Town",
        "Kota Kinabalu",
    ];

    const { flash } = usePage().props;
    const { props } = usePage();

    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);

    const [highlightedField, setHighlightedField] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {
        data: formData,
        setData: setFormData,
        post: postRegistration,
    } = useForm({
        name: "",
        email: "",
        phoneNumber: "",
        storeName: "",
        storeLicense: "",
        storeDescription: "",
        storeAddress: "",
        storeCity: "",
        storeState: "",
        businessType: "",
    });

    const validateCurrentStep = () => {
        const stepFields = {
            1: ["name", "email", "phoneNumber"],
            2: [
                "storeName",
                "storeLicense",
                "storeDescription",
                "storeAddress",
                "storeCity",
                "storeState",
                "businessType",
            ],
        };

        const requiredFields = stepFields[step] || [];
        const emptyField = requiredFields.find((field) => {
            const value = formData[field];
            return value === undefined || value === null || value === "";
        });

        if (emptyField) {
            setHighlightedField(emptyField);
            setErrorMessage(`${emptyField} is required`);
            setShowErrorToast(true);

            // Optional: Auto scroll and focus
            setTimeout(() => {
                const el = document.querySelector(`[name="${emptyField}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                    el.focus({ preventScroll: true });
                }
                setShowErrorToast(false);
            }, 5000);

            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        // Clear error if corrected
        if (highlightedField === name && value !== "") {
            setHighlightedField("");
            setShowErrorToast(false);
            setErrorMessage("");
        }
    };

    // step for navigating between the form
    const prevStep = () => setStep(step - 1);
    const nextStep = () => {
        const isValid = validateCurrentStep();
        if (isValid) {
            setStep(step + 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting form:", formData);

        postRegistration(route("seller-registration-process"), {
            registrationNumber: formData.registrationNumber,
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            storeName: formData.storeName,
            storeLicense: formData.storeLicense,
            storeDescription: formData.storeDescription,
            storeAddress: formData.storeAddress,
            storeCity: formData.storeCity,
            storeState: formData.storeState,
            businessType: formData.businessType,

            onSucess: () => {
                setShowSuccessToast(true);
            },
            onError: () => {},
        });
    };

    useEffect(() => {
        const errorKeys = Object.keys(props.errors);
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            const targetStep = fieldStepMap[firstError] || 1;

            // Redirect to correct step
            setStep(targetStep);
            setHighlightedField(firstError);

            // Delay focus until step content is rendered
            setTimeout(() => {
                const firstErrorField = document.querySelector(
                    `[name="${firstError}"]`
                );
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });

                    setErrorMessage(props.errors[firstError]);
                    setShowErrorToast(true);

                    const timer = setTimeout(() => {
                        setShowErrorToast(false);
                        setErrorMessage("");
                        setHighlightedField(""); // Remove border
                    }, 5000);

                    return () => clearTimeout(timer);
                }
            }, 100);
        }
    }, [props.errors]);

    return (
        <div className="max-w-xl p-6 border rounded-lg shadow-md bg-white md:mx-auto">
            {/* Toast for displaying success message */}
            {showSuccessToast && (
                <div className="toast toast-center md:toast-end">
                    <div className="alert alert-success">
                        <span className="text-green-800 font-bold">
                            {successMessage}
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
                            {errorMessage}
                        </span>
                    </div>
                </div>
            )}
            {/* end of toast */}

            <h2 className="text-2xl text-black font-bold mb-4">
                Seller Registration
            </h2>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Account Info */}
                {step === 1 && (
                    <>
                        <InputLabel value="Full Name" />
                        <TextInput
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 ${
                                highlightedField === "name"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            required
                        />

                        <InputLabel value="Email Address" />
                        <TextInput
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 ${
                                highlightedField === "email"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            required
                        />

                        <InputLabel value="Phone Number" />
                        <TextInput
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 ${
                                highlightedField === "phoneNumber"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            required
                        />
                    </>
                )}

                {/* Step 2: Store Info */}
                {step === 2 && (
                    <>
                        <InputLabel value="Store Name" />
                        <TextInput
                            type="text"
                            name="storeName"
                            placeholder="Store Name"
                            value={formData.storeName}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 ${
                                highlightedField === "storeName"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            required
                        />

                        <InputLabel value="Store License" />
                        <TextInput
                            type="file"
                            name="storeLicense"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 file-input ${
                                highlightedField === "storeLicense"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            accept="application/pdf"
                            required
                        />

                        <InputLabel value="Store Description" />
                        <textarea
                            name="storeDescription"
                            placeholder="Tell us about your store"
                            value={formData.storeDescription}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 border-black text-black ${
                                highlightedField === "storeDescription"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            rows="3"
                            required
                        />

                        <InputLabel value="Store Address" />
                        <TextInput
                            type="text"
                            name="storeAddress"
                            placeholder="Store Address"
                            value={formData.storeAddress}
                            autoComplete="off"
                            onChange={handleChange}
                            className={`w-full mb-3 mt-2 border-1 ${
                                highlightedField === "storeAddress"
                                    ? "!border-red-500 border-2"
                                    : "border-gray-300"
                            }`}
                            required
                        />

                        <div className="grid grid-cols-2 gap-5 mt-2">
                            {/* Store City Dropdown */}
                            <div className="col-start-1">
                                <InputLabel value="Store City" />
                                <select
                                    name="storeCity"
                                    value={formData.storeCity}
                                    onChange={handleChange}
                                    className="bg-white border-black rounded-md text-black w-full mb-3 mt-2"
                                    required
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city}>
                                            {city}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Store State Dropdown */}
                            <div className="col-start-2">
                                <InputLabel value="Store State" />
                                <select
                                    name="storeState"
                                    value={formData.storeState}
                                    onChange={handleChange}
                                    className="bg-white border-black rounded-md text-black w-full mb-3 mt-2"
                                    required
                                >
                                    <option value="">Select State</option>
                                    {states.map((state, index) => (
                                        <option key={index} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <InputLabel value="Business Type" />
                        <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="bg-white border-black rounded-md text-black w-full mb-3 mt-2"
                            required
                        >
                            <option value="">Select Business Type</option>
                            {props.list_business.map((business, index) => (
                                <option
                                    key={index}
                                    value={business.business_id}
                                >
                                    {business.business_id +
                                        " - " +
                                        business.business_type}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="text-gray-700">
                        <h2 className="text-lg font-semibold mb-2">
                            Review Your Information
                        </h2>
                        <p className="mb-4 text-sm text-gray-600">
                            Please check that everything is correct before
                            submitting:
                        </p>

                        <div className="bg-white border rounded shadow-sm p-4">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                {Object.entries(formData).map(
                                    ([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex flex-col"
                                        >
                                            <dt className="font-medium capitalize text-gray-600">
                                                {key.replace(/([A-Z])/g, " $1")}
                                            </dt>
                                            <dd className="text-gray-900 break-words">
                                                {value instanceof File
                                                    ? value.name
                                                    : String(value) || "-"}
                                            </dd>
                                        </div>
                                    )
                                )}
                            </dl>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn btn-primary w-28"
                        >
                            Back
                        </button>
                    )}
                    {step < 3 && (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn btn-success text-white ml-auto w-28"
                        >
                            Next
                        </button>
                    )}
                    {step === 3 && (
                        <button
                            type="submit"
                            className="btn btn-success ml-auto w-28"
                        >
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SellerRegistrationForm;
