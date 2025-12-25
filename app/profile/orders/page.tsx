"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomerLayout } from "@/components/layout";
import { Package, ChevronDown, ChevronUp, Check } from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

const dummyOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 450000,
    trackingNumber: "JNE123456789",
    shippingAddress: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
    items: [
      {
        id: 1,
        name: "Classic White T-Shirt",
        quantity: 2,
        price: 150000,
      },
      {
        id: 2,
        name: "Denim Jeans",
        quantity: 1,
        price: 350000,
      },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    date: "2024-01-20",
    status: "processing",
    total: 280000,
    shippingAddress: "Jl. Gatot Subroto No. 45, Jakarta Selatan, DKI Jakarta 12930",
    items: [
      {
        id: 3,
        name: "Summer Dress",
        quantity: 1,
        price: 280000,
      },
    ],
  },
];

const orderStatuses = [
  { key: "pending", label: "Order Placed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <CustomerLayout
        breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "Orders" }]}
      >
        <div className="max-w-[1240px] mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const getStatusIndex = (status: string) => {
    return orderStatuses.findIndex((s) => s.key === status);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <CustomerLayout
      breadcrumbs={[{ label: "Profile", href: "/profile" }, { label: "My Orders" }]}
    >
      <div className="max-w-[1240px] mx-auto px-4 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">My Orders</h1>

        <div className="space-y-4">
          {dummyOrders.map((order) => {
            const isExpanded = expandedOrder === order.id;
            const currentStatusIndex = getStatusIndex(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-black/10 overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-black/5 transition-colors"
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order.id)
                  }
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-black">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-black/60">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-black" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-black" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-black/60">
                      {order.items.length} item(s)
                    </p>
                    <p className="text-lg font-bold text-black">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                {/* Order Details (Collapsible) */}
                {isExpanded && (
                  <div className="border-t border-black/10">
                    {/* Order Status Timeline */}
                    <div className="p-6 bg-black/5">
                      <h4 className="text-sm font-semibold text-black mb-4">
                        Order Status
                      </h4>
                      <div className="relative">
                        <div className="flex justify-between">
                          {orderStatuses.map((statusItem, index) => {
                            const isCompleted = index <= currentStatusIndex;
                            const isCurrent = index === currentStatusIndex;

                            return (
                              <div
                                key={statusItem.key}
                                className="flex flex-col items-center flex-1 relative"
                              >
                                {/* Connector Line */}
                                {index < orderStatuses.length - 1 && (
                                  <div
                                    className={`absolute top-4 left-1/2 w-full h-0.5 ${
                                      isCompleted
                                        ? "bg-black"
                                        : "bg-black/20"
                                    }`}
                                    style={{ zIndex: 0 }}
                                  />
                                )}

                                {/* Status Circle */}
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                                    isCompleted
                                      ? "bg-black text-white"
                                      : "bg-white border-2 border-black/20"
                                  }`}
                                >
                                  {isCompleted && (
                                    <Check className="h-4 w-4" />
                                  )}
                                </div>

                                {/* Status Label */}
                                <p
                                  className={`text-xs mt-2 text-center ${
                                    isCurrent
                                      ? "font-semibold text-black"
                                      : isCompleted
                                      ? "text-black/80"
                                      : "text-black/40"
                                  }`}
                                >
                                  {statusItem.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h4 className="text-sm font-semibold text-black mb-4">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-3 border-b border-black/10 last:border-0"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-black/5 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-black/40" />
                              </div>
                              <div>
                                <p className="font-medium text-black">
                                  {item.name}
                                </p>
                                <p className="text-sm text-black/60">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-black">
                              {formatCurrency(item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="p-6 bg-black/5 border-t border-black/10">
                      <h4 className="text-sm font-semibold text-black mb-2">
                        Shipping Address
                      </h4>
                      <p className="text-sm text-black/80 mb-4">
                        {order.shippingAddress}
                      </p>
                      {order.trackingNumber && (
                        <div>
                          <h4 className="text-sm font-semibold text-black mb-2">
                            Tracking Number
                          </h4>
                          <p className="text-sm text-black/80 font-mono">
                            {order.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CustomerLayout>
  );
}
