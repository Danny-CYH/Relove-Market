import { homeServices } from "../Services/homeServices";
import {useState} from "react";

export const useVisionSearch = () => {
    const [visionResults, setVisionResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVisionSearch = async (FormData) => {
        try {
            const response = await homeServices.visionSearch(FormData);

            setVisionResults(response.data || []);
        } catch (error) {
            console.error("Image search failed:", error);
            setVisionResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchVisionSearch, visionResults, isLoading };
};
