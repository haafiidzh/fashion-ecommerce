"use client";

import { useMemo, useState } from "react";

type TxStatus = "pending" | "success" | "failed";

export default function TransactionsPages() {
  const txs = [
    {
      id: "TX-9001",
      orderId: "ORD-1004",
      method: "VA BCA",
      amount: 2150000,
      status: "success" as const,
      paidAt: "2025-12-13 16:20",
    },
    {
      id: "TX-9002",
      orderId: "ORD-1003",
      method: "Stripe Card",
      amount: 890000,
      status: "pending" as const,
      paidAt: "-",
    },
    {
      id: "TX-9003",
      orderId: "ORD-1002",
      method: "QRIS",
      amount: 399000,
      status: "failed" as const,
      paidAt: "-",
    },
    {
      id: "TX-9004",
      orderId: "ORD-1001",
      method: "COD",
      amount: 1250000,
      status: "pending" as const,
      paidAt: "-",
    },
  ];

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | TxStatus>("all");
  const [method, setMethod] = useState<"all" | string>("all");

  const methods = useMemo(() => {
    const uniq = Array.from(new Set(txs.map((t) => t.method)));
    return uniq.sort((a, b) => a.localeCompare(b));
  }, [txs]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return txs.filter((t) => {
      const matchesStatus = status === "all" ? true : t.status === status;
      const matchesMethod = method === "all" ? true : t.method === method;
      const matchesQuery = query
        ? `${t.id} ${t.orderId} ${t.method}`.toLowerCase().includes(query)
        : true;
      return matchesStatus && matchesMethod && matchesQuery;
    });
  }, [txs, q, status, method]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Transactions
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            List transaksi (dummy data)
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 md:flex-row md:items-end md:justify-between">
          <div className="grid w-full gap-3 md:grid-cols-4">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Search (TX / Order / Method)
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="contoh: TX-9001 atau ORD-1004 atau BCA"
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "all" | TxStatus)}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-neutral-500 dark:text-neutral-400">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:ring-neutral-700"
              >
                <option value="all">All</option>
                {methods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-200 md:col-span-4">
              <span>{filtered.length} transactions</span>
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setStatus("all");
                  setMethod("all");
                }}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Paid At
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filtered.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      <a
                        href={`/dashboard/transactions/${encodeURIComponent(tx.id)}`}
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {tx.id}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {tx.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {tx.method}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {formatIDR(tx.amount)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <TxStatusBadge status={tx.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {tx.paidAt}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={`/dashboard/transactions/${encodeURIComponent(tx.id)}`}
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

function TxStatusBadge({ status }: { status: "pending" | "success" | "failed" }) {
  const styles: Record<typeof status, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  };

  const label: Record<typeof status, string> = {
    pending: "Pending",
    success: "Success",
    failed: "Failed",
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


