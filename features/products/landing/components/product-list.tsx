import React from "react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import ProductCard from "./product-card";
import { Product } from "@/features/products/types/product-types";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type ProductListProps = {
    title: string;
    data: Product[];
    viewAllLink?: string;
    isLoading?: boolean;
};

const ProductList = ({ title, data, viewAllLink, isLoading = false }: ProductListProps) => {
    return (
        <section className="max-w-frame mx-auto text-center">
            <motion.h2
                initial={{ y: "100px", opacity: 0 }}
                whileInView={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={cn([
                    integralCF.className,
                    "text-[32px] md:text-5xl mb-8 md:mb-14 capitalize",
                ])}
            >
                {title}
            </motion.h2>
            <motion.div
                initial={{ y: "100px", opacity: 0 }}
                whileInView={{ y: "0", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
            >
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full mb-6 md:mb-9"
                >
                    <CarouselContent className="mx-4 xl:mx-0 space-x-4 sm:space-x-5">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, index) => (
                                <CarouselItem
                                    key={`skeleton-${index}`}
                                    className="w-full max-w-[198px] sm:max-w-[295px] pl-0"
                                >
                                    <div className="space-y-3">
                                        <Skeleton className="h-[295px] w-full rounded-lg" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </CarouselItem>
                            ))
                        ) : data.length > 0 ? (
                            data.map((product) => (
                                <CarouselItem
                                    key={product.id}
                                    className="w-full max-w-[198px] sm:max-w-[295px] pl-0"
                                >
                                    <ProductCard data={product} />
                                </CarouselItem>
                            ))
                        ) : (
                            <div className="w-full text-center py-8">
                                <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                            </div>
                        )}
                    </CarouselContent>
                </Carousel>
                {viewAllLink && (
                    <div className="w-full px-4 sm:px-0 text-center">
                        <Link
                            href={viewAllLink}
                            className="w-full inline-block sm:w-[218px] px-[54px] py-4 border rounded-full hover:bg-black hover:text-white text-black transition-all font-medium text-sm sm:text-base border-black/10"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                )}
            </motion.div>
        </section>
    );
};

export default ProductList;