import { useState } from "react";

import { authService } from "../Services/authService";

import { useToast } from "@/Components/Ui/Toast";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();

    const login = async (data) => {
        const { email, password } = data;

        try {
            setIsLoading(true);

            const response = await authService.login({
                email: email,
                password: password,
            });

            if (response.status == 200) {
                setTimeout(() => {
                    window.location.href = "/relove-market";
                }, 2000);
            }
        } catch (error) {
            setIsLoading(false);
            showToast(error.response.data.message, "error", 5000);
        }
    };

    return { login, isLoading };
};
