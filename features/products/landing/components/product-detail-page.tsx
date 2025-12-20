"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/features/products/types/product-types";
import BreadcrumbProduct from "./BreadcrumbProduct";
import ProductHeader from "./Header";
import ProductTabs from "./Tabs";
import ProductList from "./product-list";
import { productApi } from "@/features/products/services/product-service";
import { useProduct } from "../../context/product-context";

interface ProductDetailPageProps {
    product: Product;
}

const ProductDetailPageContent = ({ product }: ProductDetailPageProps) => {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoadingRelated, setIsLoadingRelated] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const products = await productApi.getProducts();
                const filtered = products
                    .filter(p => p.category_id === product.category_id && p.id !== product.id)
                    .slice(0, 8);
                setRelatedProducts(products);
                console.log("Related products:", filtered);
            } catch (err) {
                console.error("Failed to fetch related products:", err);
                setError("Failed to load related products");
            } finally {
                setIsLoadingRelated(false);
            }
        };

        fetchRelatedProducts();
    }, [product.category_id, product.id]);

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500 mb-4">{error}</p>
            </div>
        );
    }

    return (
        <main>
            <div className="max-w-frame mx-auto px-4 xl:px-0">
                <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
                <BreadcrumbProduct title={product.name} />
                <section className="mb-11">
                    <ProductHeader data={product} />
                </section>
                <ProductTabs />
            </div>
            <div className="mb-[50px] sm:mb-20">
                <ProductList
                    title="Produk Terkait"
                    data={relatedProducts}
                    isLoading={isLoadingRelated}
                />
            </div>
        </main>
    );
};

const ProductDetailPage = ({ product }: ProductDetailPageProps) => {
    return (
        <ProductDetailPageContent product={product} />
    );
};

export default ProductDetailPage;