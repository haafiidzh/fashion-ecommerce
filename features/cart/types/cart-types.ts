import { Product } from "@/features/products/types/product-types";

export type CartItem = {
    id: number;
    cart_id: number;
    product_id: number;
    quantity: number;
    created_at: Date | string;
    updated_at: Date | string;
    products: Product;
};

export type Cart = {
    id: number;
    user_id: number;
    created_at: Date | string;
    updated_at: Date | string;
    cart_items: CartItem[];
};

export type CartState = {
    cart: Cart | null;
    loading: boolean;
    error: string | null;
};