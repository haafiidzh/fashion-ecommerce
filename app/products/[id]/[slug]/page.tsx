import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import ProductDetailPage from "@/features/products/landing/components/product-detail-page";
import { productApi } from "@/features/products/services/product-service";

interface ProductPageProps {
    params: Promise<{ id: string; slug: string }>;
}

export async function generateMetadata(
    { params }: ProductPageProps
): Promise<Metadata> {
    const { id } = await params;
    try {
        const product = await productApi.getProductById(parseInt(id));
        return {
            title: product.name,
            description: `Beli ${product.name} dengan harga terbaik`,
        };
    } catch (error) {
        return {
            title: "Produk Tidak Ditemukan",
            description: "Produk yang Anda cari tidak ditemukan",
        };
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id, slug } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
        notFound();
    }

    try {
        const product = await productApi.getProductById(productId);

        if (product.slug !== slug) {
            redirect(`/products/${productId}/${product.slug}`);
        }

        return (
            <ProductDetailPage product={product} />)
    } catch (error) {
        notFound();
    }
}