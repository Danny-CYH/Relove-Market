import { homeServices } from "../Services/homeServices";
import { useState, useCallback } from "react";

export const useFlashSale = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [flashSale, setFlashSale] = useState([]);

    const fetchFlashSale = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await homeServices.flashSale();

            setFlashSale(response.data.flashSaleProducts || []);
        } catch (error) {
            console.log(error);
            setFlashSale([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { fetchFlashSale, isLoading, flashSale };
};
