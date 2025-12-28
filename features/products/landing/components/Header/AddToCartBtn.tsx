"use client";

import { useSession } from "next-auth/react";
import { useCart } from "@/features/cart/context/cart-context";
import { useRouter } from "next/navigation";
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
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = async () => {
        if (!session?.user?.id) {
            router.push("/login");
            return;
        }

        const userId = parseInt(session.user.id);

        try {
            await addToCart(userId, data.id, data.quantity);
        } catch (error) {
            console.error("Gagal menambahkan ke keranjang:", error);
        }
    };

    return (
        <button
            type="button"
            className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
            onClick={handleAddToCart}
        >
            Tambah ke Keranjang
        </button>
    );
};

export default AddToCartBtn;