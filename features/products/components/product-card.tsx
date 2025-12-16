import React from "react";
import Image from "next/image";
import Link from "next/link";
import {Product} from "@/features/products/types/product-types";
import Rating from "@/components/ui/Rating";

const generateRandomRating = () => Math.floor(Math.random() * 2) + 3.5;
const generateRandomDiscount = () => {
    const rand = Math.random();
    if (rand < 0.5) return {percentage: 0, amount: 0};
    if (rand < 0.8) return {percentage: Math.floor(Math.random() * 30) + 10, amount: 0};
    return {percentage: 0, amount: Math.floor(Math.random() * 50) + 10};
};


type ProductCardProps = {
    data: Product;
};

const ProductCard = ({data}: ProductCardProps) => {
    const rating = generateRandomRating();
    const discount = generateRandomDiscount();

    const imageUrl = data.images && data.images.length > 0 ? data.images[0].url : '/placeholder-image.png';
    const imageAlt = data.images && data.images.length > 0 ? data.images[0].alt : data.name;

    const productSlug = data.slug || data.name.toLowerCase().replace(/ /g, '-');

    return (
        <Link
            href={`/shop/product/${data.id}/${productSlug}`}
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
                {discount.percentage > 0 ? (
                    <span className="font-bold text-black text-xl xl:text-2xl">
            {`Rp. ${Math.round(
                data.price - (data.price * discount.percentage) / 100
            )}`}
          </span>
                ) : discount.amount > 0 ? (
                    <span className="font-bold text-black text-xl xl:text-2xl">
            {`Rp. ${data.price - discount.amount}`}
          </span>
                ) : (
                    <span className="font-bold text-black text-xl xl:text-2xl">
            ${data.price}
          </span>
                )}
                {discount.percentage > 0 && (
                    <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            ${data.price}
          </span>
                )}
                {discount.amount > 0 && (
                    <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
            ${data.price}
          </span>
                )}
                {discount.percentage > 0 ? (
                    <span
                        className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
            {`-${discount.percentage}%`}
          </span>
                ) : (
                    discount.amount > 0 && (
                        <span
                            className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              {`-$${discount.amount}`}
            </span>
                    )
                )}
            </div>
        </Link>
    );
};

export default ProductCard;