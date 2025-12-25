"use client";

import { useMemo, useState } from "react";
import { useOrders } from "@/features/orders/hooks/use-orders";

type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";

export default function OrdersPages() {
  const { orders, loading, error } = useOrders();

  const formattedOrders = orders.map(order => ({
    id: order.id,
    customer: order.customer,
    items: order.items,
    total: order.total,
    status: order.status,
    createdAt: new Date(order.createdAt).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }));

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return formattedOrders.filter((o) => {
      const matchesStatus = status === "all" ? true : o.status === status;
      const matchesQuery = query
        ? `${o.id} ${o.customer}`.toLowerCase().includes(query)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [formattedOrders, q, status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Orders
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            List orders from database
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row md:items-end md:justify-between">
          <div className="grid w-full gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Search (Order ID / Customer)
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="contoh: ORD-1002 atau Jane"
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "all" | OrderStatus)}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Result
              </label>
              <div className="h-10 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                <div className="flex h-full items-center justify-between">
                  <span>{filtered.length} orders</span>
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      setStatus("all");
                    }}
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-neutral-600 dark:text-neutral-400">Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filtered.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      <a
                        href={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {order.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {formatIDR(order.total)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {order.createdAt}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`/dashboard/orders/${encodeURIComponent(order.id)}`}
                        className="text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusBadge({
  status,
}: {
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
}) {
  const styles: Record<typeof status, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    processing:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    shipped:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  };

  const label: Record<typeof status, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      ].join(" ")}
    >
      {label[status]}
    </span>
  );
}


