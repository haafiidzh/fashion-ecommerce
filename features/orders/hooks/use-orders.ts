'use client';

import { useEffect, useState } from "react";
import { orderApi } from "@/data/orders";
import type { Order } from "@/features/orders/types/order-types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch orders from backend"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const clearError = () => setError(null);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    clearError,
  };
};

