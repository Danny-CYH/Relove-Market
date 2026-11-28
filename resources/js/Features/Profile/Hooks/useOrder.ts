import { useState } from "react";

import {
    successModal,
    errorModal,
    confirmationModal,
} from "@/Components/HelperFunction/AlertMessage";

import { OrderServices } from "../Services/OrderServices";

// Fetch order history from API
export const useOrder = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [activeTab, setActiveTab] = useState("profile");

    const [pastOrder, setPastOrder] = useState([]);
    const [, setOrderId] = useState("");
    const [latestOrderId, setLatestOrderId] = useState(null);

    const [orderSuccessModal, setOrderSuccessModal] = useState(false);

    // get order history func
    const fetchPastOrder = async () => {
        try {
            setIsLoading(true);
            const response = await OrderServices.orderHistory();

            setPastOrder(response.data || []);
        } catch (error) {
            console.error("Error fetching order history:", error);
            errorModal(
                "Error",
                "Failed to load order history. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Order Receive Confirmations func
    const orderReceiveConfirmation = async (orderId: string) => {
        // SweetAlert Confirmation Popup
        const result = await confirmationModal(
            "Confirm Delivery?",
            "Have you received your order in good condition? The order will be considered as completed by the seller.",
            "Yes, I have received it",
            "Cancel",
        );

        // If user cancels, stop the function
        if (!result.isConfirmed) {
            return false;
        }

        try {
            setOrderId(orderId);
            setLatestOrderId(orderId);

            const response =
                await OrderServices.orderReceiveConfirmation(orderId);

            if (response.data.success) {
                // Update the order in local state
                setPastOrder((prevOrders) =>
                    prevOrders.map((order) =>
                        order.order_id === orderId
                            ? {
                                  ...order,
                                  order_status: "Completed",
                                  commission_amount:
                                      response.data.order?.commission_amount,
                                  seller_amount:
                                      response.data.order?.seller_amount,
                                  completed_at:
                                      response.data.order?.completed_at,
                              }
                            : order,
                    ),
                );

                // SweetAlert Success Popup
                await successModal(
                    "Delivery Confirmed!",
                    "Payment has been released to the seller.",
                );
            }

            errorModal(
                "Error",
                response.data.message || "Failed to confirm delivery.",
            );
            return false;
        } catch (error) {
            console.error("Error confirming delivery:", error);

            // SweetAlert Error Popup
            errorModal(
                "Error",
                error.response?.data?.message
                    ? error.response.data.message
                    : "Failed to confirm delivery. Please try again.",
            );
            return false;
        } finally {
            setOrderId(null);
            setLatestOrderId(null);
        }
    };

    // highlight the recent order in the list func
    const recentOrder = (orderId: string) => {
        if (orderId) {
            // Find the recent order in the order history
            const recentOrder = pastOrder.find(
                (order) => order.order_id == orderId,
            );

            if (recentOrder) {
                // You can implement scrolling to the order or highlighting it
                const orderElement = document.getElementById(
                    `order-${recentOrder.order_id}`,
                );
                if (orderElement) {
                    orderElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                    orderElement.classList.add(
                        "bg-green-50",
                        "border",
                        "border-green-200",
                    );

                    // Remove highlight after 3 seconds
                    setTimeout(() => {
                        orderElement.classList.remove(
                            "bg-green-50",
                            "border",
                            "border-green-200",
                        );
                    }, 3000);
                }
            }
        }
    };

    // Func for determine the success order modal should be show up or not
    const orderPlaced = (show_order_success, payment_success) => {
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const showOrderSuccess = urlParams.get("show_order_success");
        const orderId = urlParams.get("order_id");
        const paymentSuccess = urlParams.get("payment_success");

        // Check if any success condition is met
        if (showOrderSuccess === "true" || paymentSuccess === "true") {
            // Set active tab to orders
            setActiveTab("orders");

            // Store the order ID and show modal
            setOrderId(orderId);
            setOrderSuccessModal(true);

            // Clean up the URL - remove the parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            console.log("🧹 URL cleaned:", cleanUrl);
        }

        if (show_order_success || payment_success) {
            setActiveTab("orders");
            setOrderId(orderId || null);
            setOrderSuccessModal(true);
        }
    };

    return {
        fetchPastOrder,
        orderReceiveConfirmation,
        recentOrder,
        orderPlaced,
        pastOrder,
        orderSuccessModal,
        activeTab,
        setActiveTab,
        latestOrderId,
        isLoading,
    };
};
