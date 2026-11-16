import { homeServices } from "../Services/homeServices";
import { useState } from "react";

export const useImageSearch = () => {
    const [imageResults, setImageResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchImageSearch = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await homeServices.imageSearch(FormData);

            setImageResults(response.data || []);
        } catch (error) {
            console.error("Image search failed:", error);
            setImageResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchImageSearch, imageResults, isLoading };
};
