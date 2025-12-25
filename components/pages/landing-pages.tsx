"use client";

import Header from "@/features/landing/Header";
import Brands from "@/features/landing/Brands";
import ProductListSec from "@/features/products/components/product-list-sec";
import DressStyle from "@/features/landing/DressStyle";
import Reviews from "@/features/landing/Reviews";
import { useProduct } from "@/features/products/context/product-context";
import { Review } from "@/types/review.types";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicLayout } from "@/components/layout";

const reviewsData: Review[] = [
    { id: 1, user: "Sarah M.", content: "Kualitas produk sangat bagus dan pengiriman cepat! Sangat puas dengan belanja di sini.", rating: 5, date: "2023-10-27" },
    { id: 2, user: "John D.", content: "Pakaian yang saya beli pas dan sesuai dengan gambar. Recommended seller!", rating: 4.5, date: "2023-10-25" },
    { id: 3, user: "Maya P.", content: "Saya suka koleksi dress-nya. Stylish dan nyaman dipakai. Pasti akan belanja lagi.", rating: 5, date: "2023-10-24" },
    { id: 4, user: "Budi S.", content: "Harga terjangkau dengan kualitas yang tidak mengecewakan. Mantap!", rating: 4, date: "2023-10-22" },
    { id: 5, user: "Anita L.", content: "Pelayanan customer service sangat ramah dan membantu. Pengalaman berbelanja yang menyenangkan.", rating: 5, date: "2023-10-20" },
    { id: 6, user: "Rizky A.", content: "Produknya trendi dan selalu update. Saya jadi langganan di toko ini.", rating: 4.5, date: "2023-10-18" },
];

function LandingPageContent() {
    const { state: productState } = useProduct();

    if (productState.loading) {
        return (
            <PublicLayout>
                <Header />
                <Brands />
                <div className="my-[50px] sm:my-[72px]">
                    <div className="max-w-frame mx-auto px-4 xl:px-0">
                        <Skeleton className="h-12 w-1/3 mx-auto mb-8" />
                        <div className="flex space-x-4 overflow-hidden">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-[400px] w-[295px] flex-shrink-0 rounded-xl" />)}
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    const allProducts = productState.products;

    const newArrivalsData = allProducts.slice(0, 8);

    const topSellingData = allProducts.slice(8, 16);

    return (
        <PublicLayout>
            <Header />
            <Brands />
            <div className="my-[50px] sm:my-[72px] px-10 md:px-20">
                <ProductListSec
                    title="NEW ARRIVALS"
                    data={newArrivalsData}
                    viewAllLink="/shop#new-arrivals"
                />
                <div className="max-w-frame mx-auto px-4 xl:px-0">
                    <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
                </div>
                <div className="mb-[50px] sm:mb-20">
                    <ProductListSec
                        title="top selling"
                        data={topSellingData}
                        viewAllLink="/shop#top-selling"
                    />
                </div>
                <div className="mb-[50px] sm:mb-20">
                    <DressStyle />
                </div>
                <Reviews data={reviewsData} />
            </div>
        </PublicLayout>
    );
}

export default function LandingPages() {
    return (
        <LandingPageContent />
    );
}