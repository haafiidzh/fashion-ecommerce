"use client";

import React from "react";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import CartCounter from "@/features/cart/components/CartCounter";
import { Button } from "@/components/ui/button";
import { useCart } from "../context/cart-context";
import { CartItem } from "../types/cart-types";

type ProductCardProps = {
  data: CartItem;
  userId: number;
};

const ProductCard = ({ data, userId }: ProductCardProps) => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const product = data.products;
  const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
  const productImage = product.images && Array.isArray(product.images) && product.images.length > 0
    ? (product.images[0] as { url?: string }).url || "/placeholder-image.jpg"
    : "/placeholder-image.jpg";
  const productPrice = product.price || 0;

  const currentQuantity = React.useMemo(() => {
    if (data && 'quantity' in data) {
      if (typeof data.quantity === 'number') {
        return data.quantity > 0 ? data.quantity : 1;
      } else if (typeof data.quantity === 'string') {
        const parsed = parseInt(data.quantity, 10);
        return parsed > 0 ? parsed : 1;
      } else {
        const num = Number(data.quantity);
        return num > 0 ? num : 1;
      }
    }
    return 1;
  }, [data]);

  const handleRemove = () => {
    removeFromCart(userId, data.product_id);
  };

  const handleIncrease = () => {
    const newQuantity = currentQuantity + 1;
    updateQuantity(userId, data.product_id, newQuantity);
  };

  const handleDecrease = () => {
    if (currentQuantity > 1) {
      const newQuantity = currentQuantity - 1;
      updateQuantity(userId, data.product_id, newQuantity);
    } else {
      handleRemove();
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <Link
        href={`/shop/product/${product.id}/${productSlug}`}
        className="bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden"
      >
        <Image
          src={productImage}
          width={124}
          height={124}
          className="rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500"
          alt={product.name}
          priority
        />
      </Link>
      <div className="flex w-full self-stretch flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/shop/product/${product.id}/${productSlug}`}
            className="text-black font-bold text-base xl:text-xl"
          >
            {product.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 md:h-9 md:w-9"
            onClick={handleRemove}
          >
            <IconTrash className="text-xl md:text-2xl text-red-600" />
          </Button>
        </div>
        {product.product_category && (
          <div className="-mt-1">
            <span className="text-black text-xs md:text-sm mr-1">Category:</span>
            <span className="text-black/60 text-xs md:text-sm">
              {product.product_category.name}
            </span>
          </div>
        )}
        <div className="flex items-center flex-wrap justify-between mt-auto">
          <div className="flex items-center space-x-[5px] xl:space-x-2.5">
            <span className="font-bold text-black text-xl xl:text-2xl">
              ${productPrice}
            </span>
          </div>
          <CartCounter
            initialValue={currentQuantity}
            onAdd={handleIncrease}
            onRemove={handleDecrease}
            isZeroDelete
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;