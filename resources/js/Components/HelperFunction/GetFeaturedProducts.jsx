import axios from "axios";

export async function GetFeaturedProducts(
    setLoadingFeatured,
    setFeaturedProducts,
    setCarouselProducts,
) {
    try {
        setLoadingFeatured(true);
        const response = await axios.get(route("get-featured-products"));

        const products = response.data.featured_products || [];
        setFeaturedProducts(products);
        setCarouselProducts(products);
    } catch (error) {
        console.log(error);
        setFeaturedProducts([]);
        setCarouselProducts([]);
    } finally {
        setLoadingFeatured(false);
    }
}
