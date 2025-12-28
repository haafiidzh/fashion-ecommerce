"use client";

import { useProduct } from "@/features/products/context/product-context";
import React from "react";

interface ProductCartData {
    id: number;
    title: string;
    srcUrl: string;
    price: number;
    discount: {
        percentage: number;
        amount: number;
    };
    quantity: number;
}

const AddToCartBtn = ({ data }: { data: ProductCartData }) => {
    const { selection, addToCart } = useProduct();

    return (
        <button
            type="button"
            className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
            onClick={() =>
                addToCart({
                    id: data.id,
                    name: data.title,
                    srcUrl: data.srcUrl,
                    price: data.price,
                    attributes: [selection.sizeSelection, selection.colorSelection.name],
                    discount: data.discount,
                    quantity: data.quantity,
                })
            }
        >
            Tambah ke Keranjang
        </button>
    );
};

export default AddToCartBtn;