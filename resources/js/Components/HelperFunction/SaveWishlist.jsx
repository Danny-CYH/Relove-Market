import axios from "axios";
import Swal from "sweetalert2";
import { GetWishlist } from "./GetWishlist";

// Function to save to wishlist
export async function SaveWishlist(productId, selectedVariant = null, auth) {
    try {
        if (!auth.user) {
            Swal.fire({
                title: "Login Required",
                text: "You need to log in to add items to your wishlist.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Go to Login",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = route("login");
                }
            });
            return false;
        }

        const requestData = {
            product_id: productId,
        };

        if (selectedVariant) {
            let variantCombination = selectedVariant.variant_combination;
            if (typeof variantCombination === "string") {
                try {
                    variantCombination = JSON.parse(variantCombination);
                } catch (error) {
                    console.error("Error parsing variant combination:", error);
                    variantCombination = {
                        Colors: selectedVariant.variant_key,
                    };
                }
            }

            requestData.selected_variant = {
                variant_id: selectedVariant.variant_id,
                variant_combination: variantCombination,
                price: selectedVariant.price || selectedVariant.variant_price,
                quantity:
                    selectedVariant.quantity || selectedVariant.stock_quantity,
            };
        }

        const response = await axios.post(route("store-wishlist"), requestData);

        if (response.status === 200) {
            Swal.fire({
                title: "Added to Wishlist!",
                text: "This item has been successfully added to your wishlist.",
                icon: "success",
                confirmButtonText: "OK",
                timer: 4000,
                timerProgressBar: true,
            });

            await GetWishlist(productId);
            return true;
        }
    } catch (error) {
        console.error("💥 Error in save_wishlist:", error);

        if (error.response?.status === 401) {
            Swal.fire({
                title: "Session Expired",
                text: "Your session has expired. Please log in again.",
                icon: "warning",
                confirmButtonText: "Login",
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = route("login");
                }
            });
            return false;
        }

        Swal.fire({
            title: "Error",
            text: "Failed to add product to wishlist. Please try again.",
            icon: "error",
            confirmButtonText: "OK",
        });

        return false;
    }
}
