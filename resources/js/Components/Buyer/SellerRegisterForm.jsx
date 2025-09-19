import React, { useEffect, useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaUpload,
} from "react-icons/fa";

import ReactCountryFlag from "react-country-flag";

import malaysiaLocations from "./malaysia-location.json";

import { MalaysiaStateModal } from "./MalaysiaStateModal";
import { MalaysiaCityModal } from "./MalaysiaCityModal";
import { BusinessTypeModal } from "./BusinessTypeModal";

export function SellerRegisterForm({ step, setStep, list_business }) {
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
        businessType: 2,
    };

    // Use data from JSON file
    const malaysianStates = malaysiaLocations.states;
    const malaysianCitiesByState = malaysiaLocations.citiesByState;

    const { flash, errors } = usePage().props;

    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);
    const [highlightedField, setHighlightedField] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [cities, setCities] = useState([]);

    // Modal states
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data: formData,
        setData: setFormData,
        post: postRegistration,
        processing,
    } = useForm({
        name: "",
        email: "",
        phoneNumber: "",
        storeName: "",
        storeLicense: null,
        storeDescription: "",
        storeAddress: "",
        storeCity: "",
        storeState: "",
        businessType: "",
    });

    // Update cities when state changes
    useEffect(() => {
        if (
            formData.storeState &&
            malaysianCitiesByState[formData.storeState]
        ) {
            setCities(malaysianCitiesByState[formData.storeState]);
        } else {
            setCities([]);
        }

        // Reset city when state changes
        if (formData.storeState !== "") {
            setFormData({ ...formData, storeCity: "" });
        }
    }, [formData.storeState]);

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
            setErrorMessage(`${fieldToLabel(emptyField)} is required`);
            setShowErrorToast(true);

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

        // Additional validation for email format
        if (step === 1 && formData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setHighlightedField("email");
                setErrorMessage("Please enter a valid email address");
                setShowErrorToast(true);
                return false;
            }
        }

        // Updated validation for Malaysian phone number
        if (step === 1 && formData.phoneNumber) {
            // Malaysian phone number regex: accepts +60, 60, 0 followed by 8-11 digits
            const malaysiaPhoneRegex = /^(\+?60|0)?[1-9][0-9]{7,9}$/;
            const cleanedPhone = formData.phoneNumber.replace(/\D/g, "");

            if (!malaysiaPhoneRegex.test(cleanedPhone)) {
                setHighlightedField("phoneNumber");
                setErrorMessage(
                    "Please enter a valid Malaysian phone number (e.g., 123456789, 0123456789)"
                );
                setShowErrorToast(true);
                return false;
            }
        }

        return true;
    };

    const fieldToLabel = (fieldName) => {
        const labels = {
            name: "Full Name",
            email: "Email Address",
            phoneNumber: "Phone Number",
            storeName: "Store Name",
            storeLicense: "Store License",
            storeDescription: "Store Description",
            storeAddress: "Store Address",
            storeCity: "Store City",
            storeState: "Store State",
            businessType: "Business Type",
        };
        return labels[fieldName] || fieldName;
    };

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setSelectedFileName(file ? file.name : "");
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

    // Format phone number as user types and ensure it starts with 0 when stored
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, ""); // Remove non-digits
        let formattedValue = value;
        let storedValue = value;

        // If starts with 60, remove it to add the 0 prefix
        if (value.startsWith("60")) {
            storedValue = "0" + value.substring(2);
            formattedValue = "+60 " + value.substring(2);
        } else if (value.length > 0 && !value.startsWith("0")) {
            storedValue = "0" + value;
            formattedValue = "+60 " + value;
        } else if (value.startsWith("0")) {
            storedValue = value;
            formattedValue = "+60 " + value.substring(1);
        }

        // Add spacing for readability for longer numbers
        if (formattedValue.length > 6) {
            formattedValue = formattedValue
                .replace(/(\+60\s)(\d{2,4})(\d{3})(\d{0,4})/, "$1$2 $3 $4")
                .trim();
        }

        setFormData({ ...formData, phoneNumber: storedValue });

        // Clear error if corrected
        if (highlightedField === "phoneNumber" && value !== "") {
            setHighlightedField("");
            setShowErrorToast(false);
            setErrorMessage("");
        }
    };

    // Handler for selecting state from modal
    const handleStateSelect = (state) => {
        setFormData({ ...formData, storeState: state, storeCity: "" });
        setShowStateModal(false);
        setSearchTerm("");
    };

    // Handler for selecting city from modal
    const handleCitySelect = (city) => {
        setFormData({ ...formData, storeCity: city });
        setShowCityModal(false);
        setSearchTerm("");
    };

    // Handler for selecting business type from modal
    const handleBusinessSelect = (businessId, businessType) => {
        setFormData({ ...formData, businessType: businessId });
        setShowBusinessModal(false);
        setSearchTerm("");
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const closeStateModal = () => {
        setShowStateModal(false);
        setSearchTerm("");
    };

    const closeCityModal = () => {
        setShowCityModal(false);
        setSearchTerm("");
    };

    const closeBusinessModal = () => {
        setShowBusinessModal(false);
        setSearchTerm("");
    };

    const prevStep = () => setStep(step - 1);
    const nextStep = () => {
        const isValid = validateCurrentStep();
        if (isValid) {
            setStep(step + 1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postRegistration(route("seller-registration-process"), {
            onSuccess: () => {
                setShowSuccessToast(true);
            },
            onError: (errors) => {
                setShowErrorToast(true);
                setErrorMessage("Please check the form for errors");
            },
        });
    };

    useEffect(() => {
        const errorKeys = Object.keys(errors || {});
        if (errorKeys.length > 0) {
            const firstError = errorKeys[0];
            const targetStep = fieldStepMap[firstError] || 1;

            setStep(targetStep);
            setHighlightedField(firstError);
            setErrorMessage(errors[firstError]);
            setShowErrorToast(true);

            setTimeout(() => {
                const firstErrorField = document.querySelector(
                    `[name="${firstError}"]`
                );
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                    firstErrorField.focus();
                }
            }, 100);
        }
    }, [errors]);

    // Filter options based on search term
    const filteredStates = malaysianStates.filter((state) =>
        state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCities = cities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBusinesses = list_business.filter((business) =>
        business.business_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format phone number for display (with +60 prefix)
    const formatPhoneForDisplay = (phone) => {
        if (!phone) return "";

        const cleaned = phone.replace(/\D/g, "");
        if (cleaned.startsWith("0")) {
            return "+60 " + cleaned.substring(1);
        }
        return "+60 " + cleaned;
    };

    return (
        <div className="w-full">
            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-3">
                {showSuccessToast && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
                        <FaCheckCircle className="mr-2 text-green-600" />
                        <span>
                            {flash?.successMessage ||
                                "Registration successful!"}
                        </span>
                    </div>
                )}

                {showErrorToast && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center">
                        <FaExclamationTriangle className="mr-2 text-red-600" />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            <MalaysiaStateModal
                isOpen={showStateModal}
                onClose={closeStateModal}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredStates={filteredStates}
                onStateSelect={handleStateSelect}
            />

            <MalaysiaCityModal
                isOpen={showCityModal}
                onClose={closeCityModal}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredCities={filteredCities}
                onCitySelect={handleCitySelect}
                selectedState={formData.storeState}
            />

            <BusinessTypeModal
                isOpen={showBusinessModal}
                onClose={closeBusinessModal}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                filteredBusinesses={filteredBusinesses}
                onBusinessSelect={handleBusinessSelect}
            />

            <form className="space-y-6 text-black">
                {/* Step 1: Account Info */}
                {step === 1 && (
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Personal Information
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Tell us about yourself to get started
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                autoComplete="off"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "name"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="your.email@example.com"
                                autoComplete="off"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "email"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number (Malaysia) *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <ReactCountryFlag
                                        countryCode="MY"
                                        svg
                                        style={{
                                            width: "1.5em",
                                            height: "1.5em",
                                            borderRadius: "3px",
                                        }}
                                        title="Malaysia"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="123456789"
                                    autoComplete="off"
                                    value={formatPhoneForDisplay(
                                        formData.phoneNumber
                                    )}
                                    onChange={handlePhoneChange}
                                    className={`w-full pl-12 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        highlightedField === "phoneNumber"
                                            ? "border-red-500 ring-2 ring-red-100"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Enter your Malaysian phone number without the
                                leading 0 (e.g., 123456789)
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Store Info */}
                {step === 2 && (
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Store Information
                        </h3>
                        <p className="text-gray-600 text-sm mb-6">
                            Tell us about your business
                        </p>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Name *
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                placeholder="Your Store Name"
                                autoComplete="off"
                                value={formData.storeName}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "storeName"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business License *
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    highlightedField === "storeLicense"
                                        ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                            >
                                <input
                                    type="file"
                                    name="storeLicense"
                                    onChange={handleChange}
                                    className="hidden"
                                    id="storeLicense"
                                    accept=".pdf,.doc,.docx,image/*"
                                    required
                                />
                                <label
                                    htmlFor="storeLicense"
                                    className="cursor-pointer"
                                >
                                    <FaUpload className="mx-auto text-gray-400 text-2xl mb-3" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        {selectedFileName ||
                                            "Click to upload business license"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, or images (Max 5MB)
                                    </p>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Description *
                            </label>
                            <textarea
                                name="storeDescription"
                                placeholder="Describe your store and what you sell..."
                                autoComplete="off"
                                value={formData.storeDescription}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "storeDescription"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Address *
                            </label>
                            <textarea
                                name="storeAddress"
                                placeholder="Full store address"
                                autoComplete="off"
                                value={formData.storeAddress}
                                onChange={handleChange}
                                rows={2}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "storeAddress"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowStateModal(true)}
                                    className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        highlightedField === "storeState"
                                            ? "border-red-500 ring-2 ring-red-100"
                                            : "border-gray-300"
                                    } ${
                                        formData.storeState
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    }`}
                                >
                                    {formData.storeState || "Select State"}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    City *
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (formData.storeState) {
                                            setShowCityModal(true);
                                        }
                                    }}
                                    disabled={!formData.storeState}
                                    className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                        highlightedField === "storeCity"
                                            ? "border-red-500 ring-2 ring-red-100"
                                            : "border-gray-300"
                                    } ${
                                        formData.storeCity
                                            ? "text-gray-900"
                                            : "text-gray-500"
                                    } ${
                                        !formData.storeState
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {formData.storeCity || "Select City"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Type *
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowBusinessModal(true)}
                                className={`w-full px-4 py-3 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "businessType"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                } ${
                                    formData.businessType
                                        ? "text-gray-900"
                                        : "text-gray-500"
                                }`}
                            >
                                {formData.businessType
                                    ? list_business.find(
                                          (b) =>
                                              b.business_id ===
                                              formData.businessType
                                      )?.business_type
                                    : "Select Business Type"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirmation */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <FaInfoCircle className="text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-1">
                                        Review Your Information
                                    </h3>
                                    <p className="text-blue-700 text-sm">
                                        Please verify that all information is
                                        correct before submitting your
                                        application.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <h4 className="font-semibold text-gray-900 border-b pb-2">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Full Name
                                    </label>
                                    <p className="font-medium">
                                        {formData.name || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Email
                                    </label>
                                    <p className="font-medium">
                                        {formData.email || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Phone Number
                                    </label>
                                    <p className="font-medium">
                                        {formData.phoneNumber || "-"}
                                    </p>
                                </div>
                            </div>

                            <h4 className="font-semibold text-gray-900 border-b pb-2 mt-6">
                                Store Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Store Name
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeName || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Business License
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeLicense
                                            ? formData.storeLicense.name
                                            : "Not uploaded"}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-600">
                                        Description
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeDescription || "-"}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-600">
                                        Address
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeAddress || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        City
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeCity || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        State
                                    </label>
                                    <p className="font-medium">
                                        {formData.storeState || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">
                                        Business Type
                                    </label>
                                    <p className="font-medium">
                                        {formData.businessType
                                            ? list_business.find(
                                                  (b) =>
                                                      b.business_id ===
                                                      formData.businessType
                                              )?.business_type
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <FaExclamationTriangle className="text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                                <p className="text-yellow-800 text-sm">
                                    By submitting this form, you agree to our
                                    Terms of Service and confirm that all
                                    information provided is accurate.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="button"
                            disabled={processing}
                            onClick={(e) => {
                                handleSubmit(e);
                            }}
                            className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {processing
                                ? "Submitting..."
                                : "Submit Application"}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
