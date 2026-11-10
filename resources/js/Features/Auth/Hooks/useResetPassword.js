import { useState } from "react";

import { useToast } from "@/Components/Ui/Toast";
import { authService } from "../Services/authService";

import { router } from "@inertiajs/react";

export const useResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false);

    // hooks
    const { toast } = useToast();

    const resetPass = async (data) => {
        const { token, email, password, password_confirmation, passValid } = data;

        try {
            setIsLoading(true);

            // ✅ 使用 resetEmail 而不是 email
            // if (!email || !token) {
            //     toast(
            //         "Invalid reset link. Please request a new one.",
            //         "error",
            //         5000,
            //     );
            //     return;
            // }

            // if (!passValid.status) {
            //     toast(
            //         "Please create a password that meets all requirements.",
            //         "warning",
            //         5000,
            //     );
            //     setShowReq(true);
            //     return;
            // }

            // if (password !== password_confirmation) {
            //     toast("Passwords do not match. Please try again.", "error");
            //     return;
            // }

            // // ✅ 使用 resetEmail 和 resetToken
            const response = await authService.resetPassword(
                token,
                email,
                password,
                password_confirmation,
            );

            if (response.status == 200) {
                toast(
                    "Password updated successfully! Redirect to login page in 5 seconds",
                    "success",
                    5000,
                );
                setTimeout(() => {
                    router.visit('login');
                }, 5000);
            }
        } catch (error) {
            toast(error.response?.data?.message, "error", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPass, isLoading };
};
