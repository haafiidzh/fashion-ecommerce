import apiClient from "@/lib/api-client";
import { Cart } from "../types/cart-types";

export const cartApi = {
  getCart: async (userId: number): Promise<Cart> => {
    const response = await apiClient.get(`/cart/${userId}`);
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error fetching cart");
    }
    return res.data;
  },

  addToCart: async (
    userId: number,
    productId: number,
    quantity: number = 1
  ): Promise<Cart> => {
    const response = await apiClient.post(`/cart/${userId}`, {
      productId,
      quantity,
    });
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error adding item to cart");
    }
    return res.data;
  },

  removeFromCart: async (
    userId: number,
    productId: number
  ): Promise<Cart | null> => {
    const response = await apiClient.delete(`/cart/${userId}`, {
      data: { productId },
    });
    const res = response.data;
    if (!res || !res.success) {
      throw new Error(res?.message || "Error removing item from cart");
    }
    return res.data;
  },

  clearCart: async (userId: number): Promise<void> => {
    const response = await apiClient.delete(`/cart/${userId}`);
    const res = response.data;
    if (!res || !res.success) {
      throw new Error(res?.message || "Error clearing cart");
    }
  },

  updateCartItemQuantity: async (
    userId: number,
    productId: number,
    quantity: number
  ): Promise<Cart> => {
    const response = await apiClient.put(`/cart/${userId}`, {
      productId,
      quantity,
    });
    const res = response.data;
    if (!res || !res.success || !res.data) {
      throw new Error(res?.message || "Error updating cart item quantity");
    }
    return res.data;
  },
};
