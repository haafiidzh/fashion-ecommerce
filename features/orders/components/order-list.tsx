"use client";

import { useRouter } from "next/navigation";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { OrderDataTable } from "./order-data-table";

export function OrderList() {
  const router = useRouter();
  const { orders, loading, error } = useOrders();

  const handleView = (id: string) => {
    router.push(`/dashboard/orders/${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Orders
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          List orders from backend
        </p>
        {loading && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Loading orders...
          </p>
        )}
        {error && !loading && (
          <p className="mt-1 text-xs text-red-500">
            Failed to load orders: {error}
          </p>
        )}
      </div>

      {!loading && orders.length === 0 && !error ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No data orders.
        </div>
      ) : (
        <OrderDataTable data={orders} onView={handleView} />
      )}
    </div>
  );
}
