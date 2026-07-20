import { authService } from "../Services/authService";

import { useToast } from "@/Components/Ui/Toast";

export const useLogin = ({ setIsLoading }) => {
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
                setTimeout(() => {
                    window.location.href = "/relove-market";
                }, 1000);
            }
        } catch (error) {
            setIsLoading(false);
            showToast(error.response.data.message, "error", 5000);
        }
    };

    return { login };
};
