import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/features/products/types/product-types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

const ProductHeader = ({ data }: { data: Product }) => {
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

    const gallery = imagesArray.length > 1
        ? imagesArray.slice(1).map(img => img.url)
        : [];

    const productData = {
        id: data.id,
        title: data.name,
        srcUrl: mainImage,
        gallery: gallery,
        price: data.price || 0,
        rating: 4.5,
        discount: {
            percentage: 0,
            amount: 0,
        },
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <PhotoSection data={productData} />
                </div>
                <div>
                    <h1
                        className={cn([
                            integralCF.className,
                            "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 capitalize",
                        ])}
                    >
                        {data.name}
                    </h1>
                    <div className="flex items-center mb-3 sm:mb-3.5">
                        <Rating
                            initialValue={productData.rating}
                            allowFraction
                            SVGclassName="inline-block"
                            emptyClassName="fill-gray-50"
                            size={25}
                            readonly
                        />
                        <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
                            {productData.rating.toFixed(1)}
                            <span className="text-black/60">/5</span>
                        </span>
                    </div>
                    <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
                        <span className="font-bold text-black text-2xl sm:text-[32px]">
                            {formatPrice(productData.price)}
                        </span>
                    </div>
                    <p className="text-sm sm:text-base text-black/60 mb-5">
                        Produk berkualitas tinggi yang sempurna untuk berbagai kesempatan. Terbuat dari bahan yang nyaman dan berkualitas.
                    </p>
                    <hr className="h-[1px] border-t-black/10 mb-5" />
                    <ColorSelection />
                    <hr className="h-[1px] border-t-black/10 my-5" />
                    <SizeSelection />
                    <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
                    <AddToCardSection data={productData} />
                </div>
            </div>
        </>
    );
};

export default ProductHeader;