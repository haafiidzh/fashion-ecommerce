"use client";

import ProductCard from "@/features/cart/components/ProductCart";
import { Button } from "@/components/ui/button";
import { cn, currencyFormat } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { IconBasket } from "@tabler/icons-react";
import { useCart } from "@/features/cart/context/cart-context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CustomerLayout } from "@/components/layout";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state, fetchCart } = useCart();
  const { cart, loading } = state;
  const hasFetched = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (status === "authenticated" && session?.user?.id && !hasFetched.current && !loading) {
      const userId = parseInt(session.user.id);
      hasFetched.current = true;
      fetchCart(userId);
    }
    
    if (session?.user?.id && hasFetched.current) {
      const currentUserId = parseInt(session.user.id);
      if (cart && cart.user_id !== currentUserId) {
        hasFetched.current = false;
      }
    }
  }, [status, session?.user?.id, loading, cart, fetchCart, router]);

  const totalPrice = cart?.cart_items.reduce((total, item) => {
    const price = item.products.price || 0;
    const quantity = typeof item.quantity === 'number' 
      ? item.quantity 
      : (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity)) || 0;
    return total + price * quantity;
  }, 0) || 0;

  const adjustedTotalPrice = totalPrice;

  if (status === "loading" || loading) {
    return (
      <CustomerLayout breadcrumbs={[{ label: "Cart" }]}>
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <div className="flex justify-center items-center mt-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout breadcrumbs={[{ label: "Cart" }]}>
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        <h2
          className={cn([
            integralCF.className,
            "font-bold text-[32px] md:text-[40px] uppercase mb-5 md:mb-6",
          ])}
        >
          your cart
        </h2>
        {cart && cart.cart_items.length > 0 ? (
          <div className="flex flex-col lg:flex-row space-y-5 lg:space-y-0 lg:space-x-5 items-start">
            <div className="w-full p-3.5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
              {cart.cart_items.map((item, idx, arr) => (
                <React.Fragment key={item.id}>
                  <ProductCard 
                    data={item} 
                    userId={parseInt(session?.user?.id || "0")} 
                  />
                  {arr.length - 1 !== idx && (
                    <hr className="border-t-black/10" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="w-full lg:max-w-[505px] p-5 md:px-6 flex-col space-y-4 md:space-y-6 rounded-[20px] border border-black/10">
              <h6 className="text-xl md:text-2xl font-bold text-black">
                Order Summary
              </h6>
              <div className="flex flex-col space-y-5">
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black/60">Subtotal</span>
                  <span className="md:text-xl font-bold">{currencyFormat(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black/60">
                    Delivery Fee
                  </span>
                  <span className="md:text-xl font-bold">Free</span>
                </div>
                <hr className="border-t-black/10" />
                <div className="flex items-center justify-between">
                  <span className="md:text-xl text-black">Total</span>
                  <span className="text-xl md:text-2xl font-bold">
                    {currencyFormat(adjustedTotalPrice)}
                  </span>
                </div>
              </div>
              <Button
                type="button"
                className="text-sm md:text-base font-medium bg-black rounded-full w-full py-4 h-[54px] md:h-[60px] group"
              >
                Go to Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center flex-col text-gray-300 mt-32">
            <IconBasket className="text-6xl" />
            <span className="block mb-4">Your shopping cart is empty.</span>
            <Button className="rounded-full w-24" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}