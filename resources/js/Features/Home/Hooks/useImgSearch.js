import { homeServices } from "../Services/homeServices";
import { useState } from "react";

export const useImgSearch = () => {
    const [imgResults, setImgResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchImgSearch = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await homeServices.imageSearch(FormData);

            setImgResults(response.data || []);
        } catch (error) {
            console.error("Image search failed:", error);
            setImgResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchImgSearch, imgResults, isLoading };
};
