import { useState } from "react";
import { useToast } from "@/Components/Ui/Toast";
import { authService } from "../Services/authService";

export const useRegister = () => {
    const { showToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [verifyEmailModal, setVerifyEmailModal] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState("");

    const register = async (data) => {
        const { name, email, password, password_confirmation } = data;

        try {
            setLoading(true);

            const res = await authService.register({
                name,
                email,
                password,
                password_confirmation,
            });

            if (res.status === 200) {
                setVerifyEmail(email);
                setVerifyEmailModal(true);

                showToast("Account created successfully", "success", 5000);
            }
        } catch (err) {
            const msg = err.response?.data?.message;
            showToast(msg, "error", 5000);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        verifyEmailModal,
        verifyEmail,
        setVerifyEmail,
        register,
    };
};
