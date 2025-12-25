import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type TxDetail = {
  id: string;
  orderId: string;
  method: string;
  amount: number;
  status: "pending" | "success";
  createdAt: string;
  paidAt?: string;
  tracking_number?: string;
  metadata: Record<string, string>;
};

async function getTransactionDetail(txId: string): Promise<TxDetail | null> {
  try {
    const cleanId = txId.replace(/^TX-/, '');
    const numericId = parseInt(cleanId);

    if (isNaN(numericId)) return null;

    const transaction = await prisma.transactions.findUnique({
      where: { id: numericId },
      include: {
        orders: true
      }
    });

    if (!transaction) return null;

    return {
      id: `TX-${transaction.id}`,
      orderId: transaction.orders.order_uuid,
      method: transaction.payment_method?.toString() || "Unknown",
      amount: Number(transaction.total_amount),
      status: transaction.transaction_status || "pending",
      createdAt: transaction.created_at.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      paidAt: transaction.transaction_status === "success" ?
        transaction.created_at.toLocaleString('id-ID', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }) : undefined,
      tracking_number: transaction.tracking_number || undefined,
      metadata: {
        order_uuid: transaction.orders.order_uuid,
        total_amount: transaction.total_amount.toString(),
        payment_method: transaction.payment_method?.toString() || "Unknown",
        tracking_number: transaction.tracking_number || "Not available"
      }
    };
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return null;
  }
}

export default async function TransactionDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const transaction = await getTransactionDetail(id);

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Transaction not found
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Transaction with ID {id} not found in database.
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
              {transaction.id} • dibuat {transaction.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <TxStatusBadge status={transaction.status} />
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
            <KeyValue label="Amount" value={formatIDR(transaction.amount)} />
            <KeyValue label="Method" value={transaction.method} />
            <KeyValue label="Paid At" value={transaction.paidAt ?? "-"} />
          </Card>

          <Card title="Order">
            <KeyValue label="Order ID" value={transaction.orderId} />
            <div className="mt-3">
              <Link
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                href={`/dashboard/orders/${encodeURIComponent(transaction.orderId)}`}
              >
                Lihat order detail →
              </Link>
            </div>
          </Card>

          <Card title="Metadata">
            {Object.entries(transaction.metadata).map(([k, v]) => (
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

function TxStatusBadge({ status }: { status: "pending" | "success" }) {
  const styles: Record<"pending" | "success", string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  };

  const label: Record<"pending" | "success", string> = {
    pending: "Pending",
    success: "Success",
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


