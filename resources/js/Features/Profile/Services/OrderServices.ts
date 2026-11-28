import axios from "axios";
import { route } from "ziggy-js";

export const OrderServices = {
    orderHistory: () => {
        return axios.get(route("list-orders"));
    },

    orderReceiveConfirmation: (orderId: string) => {
        return axios.post(route("confirm-delivery", orderId));
    },
};
