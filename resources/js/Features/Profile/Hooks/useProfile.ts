import { useRef, useState } from "react";

import { usePage } from "@inertiajs/react";

import Swal from "sweetalert2";

import {
    loadingModal,
    confirmationModal,
    successModal,
    errorModal,
} from "@/Components/HelperFunction/AlertMessage";

import { ProfileServices } from "../Services/ProfileServices";

import { User } from "@/eloquent-types/models";

// FIXED: Handle image upload with proper preview
export const useProfile = () => {
    const { auth } = usePage<{ auth: { user: User } }>().props;

    // Enhanced user data
    const [userData, setUserData] = useState<User>(auth.user);
    const BASE_URL = (
        import.meta as ImportMeta & {
            env: { VITE_BASE_URL: string };
        }
    ).env.VITE_BASE_URL;

    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [imgPreview, setImgPreview] = useState(null);
    const [formData, setFormData] = useState<User>({
        ...auth.user,
        profileImageFile: null,
    });

    const fileInputRef = useRef(null);

    // FIXED: Enhanced helper function to get proper image URL
    // get profile image preview url func
    const imgPreviewUrl = (imagePath) => {
        // If no image path, return default image
        if (!imagePath) {
            return "/image/user.png";
        }

        // If it's already a full URL or data URL, return as is
        if (imagePath.startsWith("http")) {
            return imagePath;
        }

        // For any other case, try with storage prefix
        const fullUrl = `${BASE_URL}${imagePath}`;

        return fullUrl;
    };

    // Update profile image func
    const imgUpdate = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        // Validate file type
        if (!file.type.startsWith("image/")) {
            errorModal(
                "Invalid File",
                "Please select a valid image file (JPEG, PNG, etc.)",
            );
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            errorModal("File Too Large", "Image size should be less than 5MB");
            return;
        }

        reader.onload = () => {
            const preview = reader.result;
            if (typeof preview !== "string") {
                errorModal(
                    "Error",
                    "Unable to preview the selected image. Please try another file.",
                );
                return;
            }

            // Set preview immediately with data URL
            setImgPreview(preview);

            // Update form data with file for upload
            setFormData((prev) => ({
                ...prev,
                profileImageFile: file,
                profile_image: preview,
            }));
        };
        reader.onerror = () => {
            console.error("Error reading file");
            errorModal(
                "Error",
                "Error reading image file. Please try another image.",
            );
        };
        reader.readAsDataURL(file);
    };

    // FIXED: Handle save with proper image handling
    const infoUpdate = async () => {
        try {
            setIsLoading(true);

            // Show loading alert
            loadingModal(
                "Updating Profile",
                "Please wait while we save your changes...",
            );

            // Create FormData for all fields
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("zip_code", formData.zip_code);
            formDataToSend.append("_method", "PATCH");

            // Append the actual file if it exists
            if (formData.profileImageFile) {
                formDataToSend.append(
                    "profile_image",
                    formData.profileImageFile,
                );
            }

            // Call update profile API services
            const response =
                await ProfileServices.updateProfile(formDataToSend);

            Swal.close();

            if (response.data.success) {
                const updatedUser = response.data.user;

                // FIXED: Handle the server response properly
                // The server returns both profile_image (path) and profile_image_url (full URL)
                let finalImageUrl = null;

                if (updatedUser.profile_image_url) {
                    // Use the full URL provided by server
                    finalImageUrl = updatedUser.profile_image_url;
                } else if (updatedUser.profile_image) {
                    // Convert path to full URL
                    finalImageUrl = imgPreviewUrl(updatedUser.profile_image);
                }

                // Update all states with the new data
                setUserData(updatedUser);
                setFormData({
                    ...updatedUser,
                    profileImageFile: null,
                });

                // Set the image preview to the final URL
                if (finalImageUrl) {
                    setImgPreview(finalImageUrl);
                } else {
                    // If no image, set to default
                    setImgPreview("/image/user.png");
                }

                setIsEditing(false);

                // Clear the file object since it's been uploaded
                setFormData((prev) => ({
                    ...prev,
                    profileImageFile: null,
                }));

                // Show success message
                successModal(
                    "Success!",
                    "Your profile has been updated successfully.",
                );
            }
        } catch (error) {
            console.error("❌ Error updating profile:", error);

            // Close any existing loading alerts
            Swal.close();

            if (error.response?.data) {
                console.error("Server response:", error.response.data);
                errorModal(
                    "Update Failed",
                    error.response.data.message ||
                        "Failed to update profile. Please try again.",
                );
            } else {
                errorModal(
                    "Update Failed",
                    "Error updating profile. Please check your connection and try again.",
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    // FIXED: Handle cancel with proper image reset
    const discardUpdate = () => {
        // Show confirmation if there are unsaved changes
        const hasChanges =
            formData.name !== userData.name ||
            formData.email !== userData.email ||
            formData.phone !== userData.phone ||
            formData.address !== userData.address ||
            formData.city !== userData.city ||
            formData.zip_code !== userData.zip_code ||
            formData.profileImageFile;

        if (hasChanges) {
            confirmationModal(
                "Discard Changes?",
                "You have unsaved changes. Are you sure you want to discard them?",
                "Yes, Discard",
                "Continue Editing",
            ).then((result) => {
                if (result.isConfirmed) {
                    resetForm();
                }
            });
        } else {
            resetForm();
        }
    };

    // Reset form after update func
    const resetForm = () => {
        setFormData({
            ...userData,
            profileImageFile: null,
        });
        // Reset to the current user's profile image
        setImgPreview(imgPreviewUrl(userData.profile_image));
        setIsEditing(false);

        // Clear any selected file
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return {
        imgPreviewUrl,
        imgUpdate,
        infoUpdate,
        discardUpdate,
        imgPreview,
        formData,
        setFormData,
        userData,
        fileInputRef,
        isLoading,
        isEditing,
    };
};
