import { useState } from "react";

import { authService } from "../Services/authService";

import { useToast } from "@/Components/Ui/Toast";

import { router } from "@inertiajs/react";

export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { showToast } = useToast();

    const login = async (data) => {
        const { email, password } = data;

        if (!email || !password) {
            showToast("Please fill in all fields", "error", 5000);
            return;
        }

        try {
            setIsLoading(true);

            const response = await authService.login({
                email: email,
                password: password,
            });

            if (response.status == 200) {
                router.visit("/relove-market");
            }
        } catch (error) {
            showToast(error.response.data.message, "error", 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading };
};
