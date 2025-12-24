"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type OrderStatus = "pending" | "processing" | "shipped" | "completed" | "cancelled";

type OrderDetail = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shipping: {
    address: string;
    note?: string;
    courier: string;
    trackingNo?: string;
  };
  items: Array<{
    sku: string;
    name: string;
    variant?: string;
    qty: number;
    price: number;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    grandTotal: number;
  };
  transaction?: {
    id: string;
    method: string;
    status: "pending" | "success" | "failed";
  };
};

const DUMMY_ORDERS: Record<string, OrderDetail> = {
  "ORD-1001": {
    id: "ORD-1001",
    status: "pending",
    createdAt: "2025-12-14 09:12",
    customer: { name: "Athala Naufal Pratama", email: "athala@example.com", phone: "0812-1111-2222" },
    shipping: {
      address: "Jl. Sudirman No. 10, Jakarta Selatan, DKI Jakarta 12190",
      note: "Tolong bungkus rapi ya",
      courier: "JNE REG",
    },
    items: [
      { sku: "TSHIRT-001", name: "Basic Tee", variant: "Black / M", qty: 1, price: 199000 },
      { sku: "PANTS-014", name: "Chino Pants", variant: "Khaki / 32", qty: 1, price: 399000 },
      { sku: "CAP-002", name: "Logo Cap", variant: "Navy", qty: 1, price: 150000 },
    ],
    totals: {
      subtotal: 748000,
      shipping: 25000,
      discount: 0,
      grandTotal: 773000,
    },
    transaction: { id: "TX-9004", method: "COD", status: "pending" },
  },
  "ORD-1002": {
    id: "ORD-1002",
    status: "processing",
    createdAt: "2025-12-14 10:03",
    customer: { name: "Haifdz", email: "haifdz@example.com", phone: "0813-8888-9999" },
    shipping: {
      address: "Jl. Asia Afrika No. 1, Bandung, Jawa Barat 40111",
      courier: "SiCepat BEST",
      trackingNo: "SICEPAT-ABCD-1234",
    },
    items: [{ sku: "HOODIE-007", name: "Oversized Hoodie", variant: "Grey / L", qty: 1, price: 399000 }],
    totals: {
      subtotal: 399000,
      shipping: 20000,
      discount: 20000,
      grandTotal: 399000,
    },
    transaction: { id: "TX-9003", method: "QRIS", status: "failed" },
  },
  "ORD-1003": {
    id: "ORD-1003",
    status: "shipped",
    createdAt: "2025-12-14 11:40",
    customer: { name: "Iqmal", email: "iqmal@example.com", phone: "0812-3333-4444" },
    shipping: {
      address: "Jl. Tunjungan No. 20, Surabaya, Jawa Timur 60275",
      courier: "J&T EZ",
      trackingNo: "JNT-9922-8811",
    },
    items: [
      { sku: "SHOES-021", name: "Sneakers", variant: "White / 42", qty: 1, price: 650000 },
      { sku: "SOCK-003", name: "Crew Socks", variant: "White", qty: 2, price: 120000 },
    ],
    totals: {
      subtotal: 890000,
      shipping: 0,
      discount: 0,
      grandTotal: 890000,
    },
    transaction: { id: "TX-9002", method: "Stripe Card", status: "pending" },
  },
  "ORD-1004": {
    id: "ORD-1004",
    status: "completed",
    createdAt: "2025-12-13 16:18",
    customer: { name: "Eko", email: "eko@example.com", phone: "0812-5555-6666" },
    shipping: {
      address: "Jl. Malioboro No. 5, Yogyakarta, DI Yogyakarta 55271",
      courier: "AnterAja Same Day",
      trackingNo: "AA-7733-1122",
    },
    items: [
      { sku: "DRESS-010", name: "Summer Dress", variant: "Floral / M", qty: 1, price: 550000 },
      { sku: "BAG-004", name: "Mini Sling Bag", variant: "Brown", qty: 1, price: 350000 },
      { sku: "SANDAL-006", name: "Strap Sandals", variant: "Beige / 39", qty: 1, price: 450000 },
      { sku: "ACCESS-011", name: "Hair Clip Set", variant: "Gold", qty: 1, price: 150000 },
      { sku: "TOP-018", name: "Ribbed Top", variant: "Cream / M", qty: 1, price: 250000 },
    ],
    totals: {
      subtotal: 1750000,
      shipping: 40000,
      discount: 0,
      grandTotal: 1790000,
    },
    transaction: { id: "TX-9001", method: "VA BCA", status: "success" },
  },
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);
  const order = DUMMY_ORDERS[id];

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h1 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Order tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Dummy data hanya tersedia untuk ORD-1001 sampai ORD-1004.
          </p>
          <div className="mt-4">
            <Link className="text-sm text-blue-600 hover:underline dark:text-blue-400" href="/dashboard/orders">
              ← Kembali ke Orders
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
              Order Detail
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {order.id} • dibuat {order.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} />
            <Link className="text-sm text-blue-600 hover:underline dark:text-blue-400" href="/dashboard/orders">
              Kembali
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Customer">
            <KeyValue label="Nama" value={order.customer.name} />
            <KeyValue label="Email" value={order.customer.email} />
            <KeyValue label="Phone" value={order.customer.phone} />
          </Card>

          <Card title="Shipping">
            <KeyValue label="Alamat" value={order.shipping.address} />
            <KeyValue label="Kurir" value={order.shipping.courier} />
            <KeyValue label="Resi" value={order.shipping.trackingNo ?? "-"} />
            <KeyValue label="Catatan" value={order.shipping.note ?? "-"} />
          </Card>

          <Card title="Payment">
            <KeyValue label="Transaction" value={order.transaction ? order.transaction.id : "-"} />
            <KeyValue label="Method" value={order.transaction ? order.transaction.method : "-"} />
            <KeyValue
              label="Status"
              value={
                order.transaction ? <TxStatusBadge status={order.transaction.status} /> : "-"
              }
            />
            {order.transaction?.id ? (
              <div className="mt-3">
                <Link
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  href={`/dashboard/transactions/${encodeURIComponent(order.transaction.id)}`}
                >
                  Lihat transaction detail →
                </Link>
              </div>
            ) : null}
          </Card>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="border-b border-neutral-200 p-4 dark:border-neutral-700">
            <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
              Items
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {order.items.map((it) => (
                  <tr key={it.sku}>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {it.sku}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {it.variant ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {it.qty}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {formatIDR(it.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                      {formatIDR(it.price * it.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-neutral-200 p-4 dark:border-neutral-700">
            <div className="ml-auto w-full max-w-sm space-y-2 text-sm">
              <Row label="Subtotal" value={formatIDR(order.totals.subtotal)} />
              <Row label="Shipping" value={formatIDR(order.totals.shipping)} />
              <Row label="Discount" value={`- ${formatIDR(order.totals.discount)}`} />
              <div className="my-2 border-t border-neutral-200 dark:border-neutral-700" />
              <Row
                label={<span className="font-semibold">Grand Total</span>}
                value={<span className="font-semibold">{formatIDR(order.totals.grandTotal)}</span>}
              />
            </div>
          </div>
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

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-neutral-600 dark:text-neutral-400">{label}</div>
      <div className="text-neutral-800 dark:text-neutral-200">{value}</div>
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
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

  const label: Record<OrderStatus, string> = {
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


