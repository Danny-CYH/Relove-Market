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
