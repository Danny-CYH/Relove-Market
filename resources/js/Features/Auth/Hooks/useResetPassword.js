import { useState } from "react";

import { useToast } from "@/Components/Ui/Toast";
import { authService } from "../Services/authService";

export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);

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
            }
        } catch (error) {
            showToast(error.response?.data?.message, "error", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPass, isLoading };
};
