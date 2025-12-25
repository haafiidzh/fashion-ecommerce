"use client";

import { useRouter } from "next/navigation";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import { TransactionDataTable } from "./transaction-data-table";

export function TransactionList() {
  const router = useRouter();
  const { transactions, loading, error } = useTransactions();

  const handleView = (id: number) => {
    router.push(`/dashboard/transactions/${encodeURIComponent(id)}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          Transactions
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          List transactions from backend
        </p>
        {loading && (
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Loading transactions...
          </p>
        )}
        {error && !loading && (
          <p className="mt-1 text-xs text-red-500">
            Failed to load transactions: {error}
          </p>
        )}
      </div>

      {!loading && transactions.length === 0 && !error ? (
        <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No data transactions.
        </div>
      ) : (
        <TransactionDataTable data={transactions} onView={handleView} />
      )}
    </div>
  );
}
