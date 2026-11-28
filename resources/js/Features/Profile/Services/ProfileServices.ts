import axios from "axios";
import { route } from "ziggy-js";

export const ProfileServices = {
    updateProfile: (formData) => {
        return axios.post(route("profile.info"), formData);
    },
};
