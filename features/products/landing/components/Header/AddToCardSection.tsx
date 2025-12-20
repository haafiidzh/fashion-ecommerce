"use client";

import CartCounter from "@/components/ui/CartCounter";
import React from "react";
import AddToCartBtn from "./AddToCartBtn";
import { useProduct } from "@/features/products/context/product-context";

interface ProductCartData {
    id: number;
    title: string;
    srcUrl: string;
    price: number;
    discount: {
        percentage: number;
        amount: number;
    };
}

const AddToCardSection = ({ data }: { data: ProductCartData }) => {
    const { selection, setQuantity } = useProduct();

    return (
        <div className="fixed md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex items-center justify-between sm:justify-start md:justify-center">
            <CartCounter
                value={selection.quantity}
                onChange={setQuantity}
            />
            <AddToCartBtn data={{ ...data, quantity: selection.quantity }} />
        </div>
    );
};

export default AddToCardSection;