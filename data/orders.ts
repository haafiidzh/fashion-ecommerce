import apiClient from "@/lib/api-client";
import type { Order } from "@/features/orders/types/order-types";

export const orderApi = {
  async getOrders(): Promise<Order[]> {
    const response = await apiClient.get("/orders");
    return response.data.data as Order[];
  },
};

