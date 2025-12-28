"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProductDetailPage from "@/features/products/landing/components/product-detail-page";
import { productApi } from "@/features/products/services/product-service";
import { CustomerLayout } from "@/components/layout";

interface ProductPageProps {
    params: Promise<{ id: string; slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { id, slug } = await params;
                const productId = parseInt(id);

                if (isNaN(productId)) {
                    router.push("/404");
                    return;
                }

                const data = await productApi.getProductById(productId);

                if (data.slug !== slug) {
                    router.replace(`/products/${productId}/${data.slug}`);
                    return;
                }

                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (status !== "loading") {
            fetchProduct();
        }
    }, [params, router, status]);

    if (status === "loading" || isLoading) {
        return (
            <CustomerLayout>
                <div className="flex justify-center items-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                </div>
            </CustomerLayout>
        );
    }

    if (!product) {
        return (
            <CustomerLayout>
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout>
            <ProductDetailPage product={product} />
        </CustomerLayout>
    );
}