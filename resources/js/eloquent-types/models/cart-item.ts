import { Product } from "./product";

export interface CartItem {
    id: number;
    product_id: string;
    selected_quantity: number;
    selected_variant: {
        price: string;
        quantity: number;
        variant_id: string;
        combination?: string;
        variant_combination?: {
            Colors?: string;
            Size?: string;
        };
        variant_key?: string;
    } | null;
    product: Product;
    created_at?: string;
    updated_at?: string;
}
