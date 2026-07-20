import { useState } from "react";

import { authService } from "../Services/authService";
import { useToast } from "@/Components/Ui/Toast";

export const useResetLink = () => {
    const [isLoading, setIsLoading] = useState(false);

    //hooks
    const { showToast } = useToast();

    const resetLink = async (data) => {
        const { email } = data;

        try {
            setIsLoading(true);
            const response = await authService.resetLink(email);

            if (response.status == 200) {
                showToast(response.data.message, "success", 5000);
            }
        } catch (error) {
            showToast(error.response.data.message, "error", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return { resetLink, isLoading };
};
