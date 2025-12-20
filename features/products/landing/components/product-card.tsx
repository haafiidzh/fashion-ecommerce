import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/features/products/types/product-types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";

const ProductCard = ({ data }: { data: Product }) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const imagesArray = Array.isArray(data.images) ? data.images : [];

    const mainImage = imagesArray.length > 0
        ? imagesArray[0].url
        : "/placeholder-product.jpg";

    return (
        <Link href={`/products/${data.id}/${data.slug || ''}`} className="group">
            <div className="relative overflow-hidden rounded-[13px] sm:rounded-[20px] mb-3.5">
                <div className="bg-[#F0EEED] w-full h-[295px] sm:h-[400px] flex items-center justify-center">
                    <Image
                        src={mainImage}
                        alt={data.name}
                        width={295}
                        height={400}
                        className="object-cover group-hover:scale-110 transition-all duration-500"
                    />
                </div>
            </div>
            <h3
                className={cn([
                    integralCF.className,
                    "text-base sm:text-lg mb-1.5 capitalize line-clamp-1",
                ])}
            >
                {data.name}
            </h3>
            <div className="flex items-center mb-1.5">
                <Rating
                    initialValue={4.5}
                    allowFraction
                    SVGclassName="inline-block"
                    emptyClassName="fill-gray-50"
                    size={16}
                    readonly
                />
                <span className="text-black text-xs ml-1">
                    4.5<span className="text-black/60">/5</span>
                </span>
            </div>
            <p className="font-bold text-lg sm:text-xl">
                {formatPrice(data.price || 0)}
            </p>
        </Link>
    );
};

export default ProductCard;