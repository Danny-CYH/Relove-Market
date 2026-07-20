import { useToast } from "@/Components/Ui/Toast";
import { authService } from "../Services/authService";

export const useResetPassword = ({ setIsLoading, setShowResetModal }) => {
    // hooks
    const { showToast } = useToast();

    const resetPass = async (data) => {
        const { token, email, password, password_confirmation } = data;

        // ✅ 使用 resetEmail 而不是 email
        if (!email || !token) {
            showToast(
                "Invalid reset link. Please request a new one.",
                "error",
                5000,
            );
            return;
        }

        if (!password || !password_confirmation) {
            showToast("Please fill in all password fields", "warning", 5000);
            return;
        }

        if (password !== password_confirmation) {
            showToast("Passwords do not match. Please try again.", "error");
            return;
        }

        try {
            setIsLoading(true);

            // ✅ 使用 resetEmail 和 resetToken
            const response = await authService.resetPassword(
                token,
                email,
                password,
                password_confirmation,
            );

            if (response.status == 200) {
                showToast(
                    "Password updated successfully! Redirect to login page in 5 seconds",
                    "success",
                    5000,
                );
                setShowResetModal(false);

                setTimeout(() => {
                    window.location.href = "/login";
                }, 5000);
            }
        } catch (error) {
            showToast(error.response?.data?.message, "error", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPass };
};
