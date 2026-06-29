import axios from "axios";
import { useEffect, useState } from "react";

export function useFeaturedProducts() {
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [carouselProducts, setCarouselProducts] = useState([]);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                setLoadingFeatured(true);
                // ✅ 加上 await
                const response = await axios.get("/get-featured-products");

                const products = response.data.featured_products || [];
                setCarouselProducts(products);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
                setCarouselProducts([]);
            } finally {
                setLoadingFeatured(false);
            }
        };

        fetchFeaturedProducts(); // 调用内部异步函数
    }, []); // 空依赖数组 = 只在组件挂载时执行一次

    return { carouselProducts, loadingFeatured };
}
