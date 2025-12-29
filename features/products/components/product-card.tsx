import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/features/products/types/product-types";
import Rating from "@/components/ui/Rating";
import { useSession } from "next-auth/react";
import { useCart } from "@/features/cart/context/cart-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconShoppingCart } from "@tabler/icons-react";
import { toast } from "sonner";

const generateRandomRating = () => Math.floor(Math.random() * 2) + 3.5;

type ProductCardProps = {
    data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
    const rating = generateRandomRating();
    const { data: session } = useSession();
    const { addToCart } = useCart();
    const router = useRouter();

    let imageUrl = '/placeholder-image.png';
    let imageAlt = data.name;

    if (data.images) {
        if (Array.isArray(data.images) && data.images.length > 0) {
            if (typeof data.images[0] === 'string') {
                imageUrl = data.images[0];
            } else if (typeof data.images[0] === 'object') {
                imageUrl = (data.images[0] as any).url || imageUrl;
            }
        }
        else if (typeof data.images === 'string') {
            try {
                const parsed = JSON.parse(data.images);
                imageUrl = parsed[0]?.url || imageUrl;
            } catch (e) { }
        }
    }

    const formatPrice = (price: number | null) => {
        if (!price) return 'Rp 0';
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);
    };

    let displayPrice = formatPrice(data.price || 0);
    const variants = (data as any).product_variants;

    if (!data.price && variants && variants.length > 0) {
        const prices = variants
            .map((v: any) => v.price)
            .filter((p: number | null) => p !== null && p !== undefined);

        if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice === maxPrice) {
                displayPrice = formatPrice(minPrice);
            } else {
                displayPrice = `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
            }
        }
    }

    const productSlug = data.slug || data.name.toLowerCase().replace(/ /g, '-');

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation to product detail page
        e.stopPropagation(); // Stop event bubbling

        if (!session?.user?.id) {
            router.push("/login");
            return;
        }

        const userId = parseInt(session.user.id);

        try {
            await addToCart(userId, data.id, 1);
            toast.success("Produk berhasil ditambahkan ke keranjang");

            // Redirect to cart page after successful add to cart
            router.push("/cart");
        } catch (error) {
            console.error("Gagal menambahkan ke keranjang:", error);
            toast.error("Gagal menambahkan produk ke keranjang");
        }
    };

    return (
        <div className="flex flex-col items-start aspect-auto group relative">
            <Link
                href={`/products/${data.id}/${productSlug}`}
                className="flex flex-col items-start aspect-auto"
            >
                <div
                    className="bg-[#F0EEED] rounded-[13px] lg:rounded-[20px] w-full lg:max-w-[295px] aspect-square mb-2.5 xl:mb-4 overflow-hidden relative">
                    <Image
                        src={imageUrl}
                        width={295}
                        height={298}
                        className="rounded-md w-full h-full object-contain hover:scale-110 transition-all duration-500"
                        alt={imageAlt}
                        priority
                    />
                    {/* Add to Cart Button Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-[13px] lg:rounded-[20px] flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="bg-white text-black hover:bg-white/90 shadow-lg"
                        >
                            <IconShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                        </Button>
                    </div>
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
                <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-black text-xl xl:text-2xl">
                        {displayPrice}
                    </span>
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        variant="outline"
                        className="md:hidden bg-black text-white hover:bg-black/90 border-black"
                    >
                        <IconShoppingCart className="w-4 h-4" />
                    </Button>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;