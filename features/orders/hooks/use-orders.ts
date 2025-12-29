'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { orderApi } from "@/data/orders";
import type { Order } from "@/features/orders/types/order-types";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is admin by calling user-role API
      let isAdmin = false;
      if (session?.user?.email) {
        try {
          const roleResponse = await fetch('/api/user-role');
          if (roleResponse.ok) {
            const roleData = await roleResponse.json();
            isAdmin = roleData.isAdmin || false;
          }
        } catch (roleError) {
          console.warn("Failed to check user role:", roleError);
        }
      }

      // Use admin API if user is admin, otherwise use regular API
      const data = isAdmin
        ? await orderApi.getAdminOrders()
        : await orderApi.getOrders();

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
    if (session !== undefined) { // Wait for session to be determined
      fetchOrders();
    }
  }, [session]);

  const clearError = () => setError(null);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    clearError,
  };
};

