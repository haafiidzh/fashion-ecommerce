"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/context/cart-context";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { state } = useCart();
  const { cart } = state;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && (!cart || cart.cart_items.length === 0)) {
      router.push("/cart");
      return;
    }
  }, [status, cart, router]);

  // Calculate total from cart items
  const subtotal = cart?.cart_items.reduce((total, item) => {
    const price = item.products.price || 0;
    const quantity = typeof item.quantity === 'number'
      ? item.quantity
      : (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity)) || 0;
    return total + price * quantity;
  }, 0) || 0;

  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const totalAmount = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!session?.user?.id || !cart) return;

    setIsProcessing(true);

    try {
      // Create order data from actual cart items
      const orderData = {
        user_id: parseInt(session.user.id),
        total_amount: totalAmount,
        items: cart.cart_items.map(item => ({
          product_id: item.product_id,
          name: item.products.name,
          quantity: typeof item.quantity === 'number'
            ? item.quantity
            : (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity)) || 0,
          price: item.products.price || 0,
        })),
        shipping_address: {
          fullName: "Test User",
          phone: "08123456789",
          province: "DKI Jakarta",
          city: "Jakarta",
          district: "Jakarta Pusat",
          village: "Gambir",
          postalCode: "10110",
          address: "Jl. Test No. 123",
        },
        payment_method: "bank_transfer",
      };

      console.log('Creating order from cart:', orderData);

      // Create order via API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create order');
      }

      console.log('Order created successfully, redirecting to account...');
      alert("Pesanan berhasil dibuat! Anda akan diarahkan ke halaman akun untuk melihat pesanan.");
      router.push("/account");

    } catch (error) {
      console.error('Checkout error:', error);
      alert("Gagal membuat pesanan: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading" || !cart) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="max-w-md mx-auto">
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.cart_items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.products.name} (x{item.quantity})</span>
                <span>Rp {((item.products.price || 0) * (typeof item.quantity === 'number'
                  ? item.quantity
                  : (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : Number(item.quantity)) || 0)).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rp {shippingFee.toLocaleString()}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Memproses..." : "Buat Pesanan"}
        </button>
      </div>
    </div>
  );
}