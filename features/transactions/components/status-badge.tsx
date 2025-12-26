"use client";

import type { TransactionStatus } from "@/features/transactions/types/transaction-types";

const styles: Record<TransactionStatus, string> = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
};

const label: Record<TransactionStatus, string> = {
  pending: "Pending",
  success: "Success",
};

export function TxStatusBadge({ status }: { status: TransactionStatus }) {
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
