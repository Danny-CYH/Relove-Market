import axios from "axios";

export async function GetFlashSaleProducts(
    setLoadingFlashSale,
    setFlashSaleProducts,
) {
    try {
        setLoadingFlashSale(true);
        const response = await axios.get(route("get-flash-sale-products"));

        setFlashSaleProducts(response.data.flashSaleProducts || []);
    } catch (error) {
        console.log(error);
        setFlashSaleProducts([]);
    } finally {
        setLoadingFlashSale(false);
    }
}
