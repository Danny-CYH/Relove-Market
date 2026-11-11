import axios from "axios";
import { route } from "ziggy-js";

export const homeServices = {
    visionSearch: (formData) => {
        return axios.post(route("camera-search"), formData);
    },

    flashSale: () => {
        return axios.get(route("get-flash-sale-products"));
    },
};
