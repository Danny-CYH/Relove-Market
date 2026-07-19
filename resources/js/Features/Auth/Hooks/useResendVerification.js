import { useState } from "react";
import { authService } from "../Services/authService";

export const useResendVefication = () => {
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    const resendEmail = async (email) => {
        try {
            const res = await authService.resendVerification(email);
            if (res.status === 200) {
                setShowVerifyModal(false);
                showToast(
                    "A new verification link has been sent.",
                    "success",
                    4000,
                );
                return { success: true };
            }
        } catch (err) {
            showToast(
                "Failed to send verification email. Please try again.",
                "error",
                5000,
            );
            return { success: false };
        }
    };

    // ✅ 关闭验证 Modal
    const closeVerifyModal = () => {
        setShowVerifyModal(false);
    };

    return { resendEmail, closeVerifyModal };
};
