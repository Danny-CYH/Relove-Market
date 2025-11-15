import React, { useEffect, useState, useRef } from "react";
import { usePage, useForm } from "@inertiajs/react";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaUpload,
    FaIdCard,
    FaCamera,
    FaLock,
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
        verificationType: 2,
        verificationImage: 2,
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
    const [imagePreview, setImagePreview] = useState(null);

    // Modal states
    const [showStateModal, setShowStateModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);
    const [showBusinessModal, setShowBusinessModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // File input ref
    const fileInputRef = useRef(null);

    // Malaysian verification ID types
    const verificationTypes = [
        {
            id: "nric",
            name: "Malaysian NRIC",
        },
        {
            id: "passport",
            name: "Passport",
        },
        {
            id: "business_registration",
            name: "Business Registration Number",
        },
        {
            id: "driving_license",
            name: "Driving License",
        },
    ];

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
        verificationType: "",
        verificationImage: null,
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
                "verificationType",
                "verificationImage",
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

        if (step === 1 && formData.name) {
            const nameRegex = /^[A-Za-z\s]+$/;

            if (!nameRegex.test(formData.name)) {
                setHighlightedField("name");
                setErrorMessage("Name cannot contain numbers");
                setShowErrorToast(true);
                return false;
            }
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

        // Validation for image file
        if (step === 2 && formData.verificationImage) {
            const file = formData.verificationImage;
            const validTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
            ];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                setHighlightedField("verificationImage");
                setErrorMessage(
                    "Please upload a valid image (JPEG, JPG, PNG, WEBP)"
                );
                setShowErrorToast(true);
                return false;
            }

            if (file.size > maxSize) {
                setHighlightedField("verificationImage");
                setErrorMessage("Image size should be less than 5MB");
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
            verificationType: "Verification Type",
            verificationImage: "Verification Image",
            storeDescription: "Store Description",
            storeAddress: "Store Address",
            storeState: "Store State",
            storeCity: "Store City",
            businessType: "Business Type",
        };
        return labels[fieldName] || fieldName;
    };

    const handleChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file") {
            const file = files[0];
            if (file) {
                setFormData({ ...formData, [name]: file });
                setSelectedFileName(file.name);

                // Create preview for image
                if (name === "verificationImage") {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
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

    // Handle image capture/upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, verificationImage: file });
            setSelectedFileName(file.name);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }

        // Clear error if corrected
        if (highlightedField === "verificationImage" && file) {
            setHighlightedField("");
            setShowErrorToast(false);
            setErrorMessage("");
        }
    };

    // Remove image
    const handleRemoveImage = () => {
        setFormData({ ...formData, verificationImage: null });
        setImagePreview(null);
        setSelectedFileName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Format phone number as user types and ensure it starts with 0 when stored
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        let formattedValue = value;
        let storedValue = value;

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

        if (formattedValue.length > 6) {
            formattedValue = formattedValue
                .replace(/(\+60\s)(\d{2,4})(\d{3})(\d{0,4})/, "$1$2 $3 $4")
                .trim();
        }

        setFormData({ ...formData, phoneNumber: storedValue });

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

        const submitFormData = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
                submitFormData.append(key, formData[key]);
            }
        });

        postRegistration(route("seller-registration-process"), {
            data: submitFormData,
            forceFormData: true,
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

                        {/* Verification Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Type *
                            </label>
                            <select
                                name="verificationType"
                                value={formData.verificationType}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    highlightedField === "verificationType"
                                        ? "border-red-500 ring-2 ring-red-100"
                                        : "border-gray-300"
                                }`}
                                required
                            >
                                <option value="">
                                    Select Verification Type
                                </option>
                                {verificationTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Choose the type of identification you'll provide
                            </p>
                        </div>

                        {/* Verification Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Verification Document *
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                    highlightedField === "verificationImage"
                                        ? "border-red-500 bg-red-50 ring-2 ring-red-100"
                                        : formData.verificationType
                                        ? "border-gray-300 hover:border-gray-400"
                                        : "border-gray-300 bg-gray-50"
                                }`}
                            >
                                <input
                                    type="file"
                                    name="verificationImage"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="verificationImage"
                                    accept="image/*"
                                    capture="environment"
                                    ref={fileInputRef}
                                    disabled={!formData.verificationType}
                                    required
                                />

                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Verification document preview"
                                                className="max-h-48 rounded-lg border border-gray-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {selectedFileName}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            Take New Photo
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="verificationImage"
                                        className={`cursor-pointer block ${
                                            !formData.verificationType
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                    >
                                        {!formData.verificationType ? (
                                            <FaLock className="mx-auto text-gray-400 text-2xl mb-3" />
                                        ) : (
                                            <FaCamera className="mx-auto text-gray-400 text-2xl mb-3" />
                                        )}
                                        <p className="text-sm text-gray-600 mb-2">
                                            {!formData.verificationType
                                                ? "Please select verification type first"
                                                : "Click to take a photo of your verification document"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formData.verificationType
                                                ? `Take a clear photo of your ${verificationTypes
                                                      .find(
                                                          (t) =>
                                                              t.id ===
                                                              formData.verificationType
                                                      )
                                                      ?.name.toLowerCase()} document`
                                                : "Select verification type to enable upload"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Supported: JPG, PNG, WEBP (Max 5MB)
                                        </p>
                                    </label>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.verificationType
                                    ? "Ensure the document is clearly visible and all details are readable"
                                    : "Select verification type first to upload document"}
                            </p>
                        </div>

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
                                    onClick={() => {
                                        setShowStateModal(true);
                                    }}
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Choose your business state
                                </p>
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Choose state first before city
                                </p>
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

                {/* Step 3: Review & Confirmation */}
                {step === 3 && (
                    <div className="space-y-6">
                        {/* Information Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Personal Information Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                            <FaIdCard className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Personal Information
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Your contact details
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Full Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {formData.name || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Email Address
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {formData.email || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Phone Number
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {formData.phoneNumber
                                                    ? formatPhoneForDisplay(
                                                          formData.phoneNumber
                                                      )
                                                    : "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Store Information Card */}
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                            <FaUpload className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Store Information
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Business details
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Store Name
                                            </label>
                                            <p className="text-gray-900 font-medium">
                                                {formData.storeName || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Business Type
                                            </label>
                                            <p className="text-gray-900 font-medium">
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
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-500">
                                                Store Address
                                            </label>
                                            <p className="text-gray-900 font-medium whitespace-pre-line">
                                                {formData.storeAddress +
                                                    ", " +
                                                    formData.storeCity +
                                                    ", " +
                                                    formData.storeState || "-"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verification Information Card */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                        <FaCamera className="text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Verification Details
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Identity verification
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Verification Type
                                                </label>
                                                <p className="text-gray-900 font-medium">
                                                    {formData.verificationType
                                                        ? verificationTypes.find(
                                                              (t) =>
                                                                  t.id ===
                                                                  formData.verificationType
                                                          )?.name
                                                        : "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <div className="flex-1">
                                                <label className="text-sm font-medium text-gray-500">
                                                    Document
                                                </label>
                                                <p className="text-gray-900 font-medium mb-2">
                                                    {formData.verificationImage
                                                        ? formData
                                                              .verificationImage
                                                              .name
                                                        : "No document uploaded"}
                                                </p>
                                                {imagePreview && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Verification document"
                                                            className="max-h-32 rounded-lg border border-gray-300 shadow-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            {/* Edit Information Card */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-start">
                                    <FaExclamationTriangle className="text-blue-600 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 mb-2">
                                            Need to make changes?
                                        </h4>
                                        <p className="text-blue-700 text-sm mb-4">
                                            If any information is incorrect, you
                                            can go back to previous steps to
                                            edit your details.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm"
                                        >
                                            Edit Information
                                        </button>
                                    </div>
                                </div>
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
