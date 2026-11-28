import Swal from "sweetalert2";

export function AlertMessage(icon, title, text, confirmButtonText = "OK") {
    return Swal.fire({
        icon,
        title,
        text,
        confirmButtonText,
        confirmButtonColor: "#059669",
        customClass: {
            popup: "rounded-2xl backdrop-blur-lg bg-white/95",
            confirmButton:
                "px-4 py-2 rounded-lg font-medium bg-emerald-600 hover:bg-emerald-700 transition-all",
        },
    });
}

export const confirmationModal = (
    title,
    text,
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
) => {
    return Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText,
        cancelButtonText,
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
            cancelButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};

export const loadingModal = (title, text = "") => {
    return Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export const successModal = (title, text, confirmButtonText = "OK") => {
    return Swal.fire({
        title,
        text,
        icon: "success",
        confirmButtonText,
        confirmButtonColor: "#3085d6",
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};

export const errorModal = (title, text, confirmButtonText = "OK") => {
    return Swal.fire({
        title,
        text,
        icon: "error",
        confirmButtonText,
        confirmButtonColor: "#d33",
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};
