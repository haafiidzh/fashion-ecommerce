"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type TxStatus = "pending" | "success" | "failed";

type TxDetail = {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: TxStatus;
  createdAt: string;
  paidAt?: string;
  metadata: Record<string, string>;
};

const DUMMY_TXS: Record<string, TxDetail> = {
  "TX-9001": {
    id: "TX-9001",
    orderId: "ORD-1004",
    method: "VA BCA",
    amount: 2150000,
    status: "success",
    createdAt: "2025-12-13 16:19",
    paidAt: "2025-12-13 16:20",
    metadata: {
      bank: "BCA",
      vaNumber: "3901 1234 5678 9012",
      reference: "BCA-REF-778812",
    },
  },
  "TX-9002": {
    id: "TX-9002",
    orderId: "ORD-1003",
    method: "Stripe Card",
    amount: 890000,
    status: "pending",
    createdAt: "2025-12-14 11:41",
    metadata: {
      cardBrand: "VISA",
      last4: "4242",
      intentId: "pi_3Qxx_dummy",
    },
  },
  "TX-9003": {
    id: "TX-9003",
    orderId: "ORD-1002",
    method: "QRIS",
    amount: 399000,
    status: "failed",
    createdAt: "2025-12-14 10:04",
    metadata: {
      provider: "Midtrans",
      reason: "Expired",
      qrisRef: "QR-20251214-001",
    },
  },
  "TX-9004": {
    id: "TX-9004",
    orderId: "ORD-1001",
    method: "COD",
    amount: 1250000,
    status: "pending",
    createdAt: "2025-12-14 09:13",
    metadata: {
      note: "Bayar saat barang diterima",
    },
  },
};

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const tx = DUMMY_TXS[id];

  if (!tx) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Transaction tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Dummy data hanya tersedia untuk TX-9001 sampai TX-9004.
          </p>
          <div className="mt-4">
            <Link
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              href="/dashboard/transactions"
            >
              ← Kembali ke Transactions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
              Transaction Detail
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {tx.id} • dibuat {tx.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TxStatusBadge status={tx.status} />
            <Link
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              href="/dashboard/transactions"
            >
              Kembali
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Summary">
            <KeyValue label="Amount" value={formatIDR(tx.amount)} />
            <KeyValue label="Method" value={tx.method} />
            <KeyValue label="Paid At" value={tx.paidAt ?? "-"} />
          </Card>

          <Card title="Order">
            <KeyValue label="Order ID" value={tx.orderId} />
            <div className="mt-3">
              <Link
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                href={`/dashboard/orders/${encodeURIComponent(tx.orderId)}`}
              >
                Lihat order detail →
              </Link>
            </div>
          </Card>

          <Card title="Metadata">
            {Object.entries(tx.metadata).map(([k, v]) => (
              <KeyValue key={k} label={k} value={v} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <div className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
        {title}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="text-sm text-neutral-800 dark:text-neutral-200">{value}</div>
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

function TxStatusBadge({ status }: { status: TxStatus }) {
  const styles: Record<TxStatus, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  };

  const label: Record<TxStatus, string> = {
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


