// src/components/common/ProductCard.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {Product} from "@/features/products/types/product-types";
import Rating from "@/components/ui/Rating";

const generateRandomRating = () => Math.floor(Math.random() * 2) + 3.5;

type ProductCardProps = {
    data: Product;
};

const ProductCard = ({data}: ProductCardProps) => {
    const rating = generateRandomRating();

    const imageUrl = data.images && data.images.length > 0 ? data.images[0].url : '/placeholder-image.png';
    const imageAlt = data.images && data.images.length > 0 ? data.images[0].alt : data.name;

    const productSlug = data.slug || data.name.toLowerCase().replace(/ /g, '-');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link
            href={`/products/${data.id}/${productSlug}`}
            className="flex flex-col items-start aspect-auto"
        >
            <div
                className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden">
                <Image
                    src={imageUrl}
                    width={295}
                    height={298}
                    className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
                    alt={imageAlt}
                    priority
                />
            </div>
            <strong className="text-black xl:text-xl">{data.name}</strong>
            <div className="flex items-end mb-1 xl:mb-2">
                <Rating
                    initialValue={rating}
                    allowFraction
                    SVGclassName="inline-block"
                    emptyClassName="fill-gray-50"
                    size={19}
                    readonly
                />
                <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {rating.toFixed(1)}
                    <span className="text-black/60">/5</span>
        </span>
            </div>
            <div className="flex items-center space-x-[5px] xl:space-x-2.5">
                <span className="font-bold text-black text-xl xl:text-2xl">
                    {formatPrice(data.price || 0)}
                </span>
            </div>
        </Link>
    );
};

export default ProductCard;