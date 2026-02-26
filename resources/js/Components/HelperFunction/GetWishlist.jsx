// Function to get wishlist status
export const GetWishlist = async (product_id) => {
    try {
        const response = await axios.get(route("get-wishlist", product_id));
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return null;
    }
};
