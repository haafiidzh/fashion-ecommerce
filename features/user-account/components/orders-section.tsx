"use client";

import { useState } from "react";
import { Order } from "../types/account-types";
import OrderStepper from "./order-stepper";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";

interface OrdersSectionProps {
  orders: Order[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-neutral-100 text-neutral-800";
  }
};

export default function OrdersSection({ orders }: OrdersSectionProps) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
        <p className="text-neutral-500">No orders yet</p>
      </div>
    );
  }

  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrder === order.id;

        return (
          <div
            key={order.id}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all"
          >
            {/* Order Header - Always Visible */}
            <button
              onClick={() => toggleOrder(order.id)}
              className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-neutral-50"
            >
              <div className="flex flex-1 items-center gap-6">
                {/* Order ID */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-neutral-500">
                    Order ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold text-black">
                    {order.order_uuid}
                  </p>
                </div>

                {/* Amount */}
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-neutral-500">Amount</p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatCurrency(Number(order.total_amount))}
                  </p>
                </div>

                {/* Date */}
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-neutral-500">Date</p>
                  <p className="mt-1 text-sm font-medium text-black">
                    {new Date(order.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Expand Icon */}
              <div className="ml-4">
                {isExpanded ? (
                  <IconChevronUp className="h-5 w-5 text-neutral-400" />
                ) : (
                  <IconChevronDown className="h-5 w-5 text-neutral-400" />
                )}
              </div>
            </button>

            {/* Order Details - Expandable */}
            {isExpanded && (
              <div className="border-t border-neutral-200 bg-neutral-50 p-6">
                {/* Mobile Info */}
                <div className="mb-6 grid gap-4 sm:hidden">
                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      Total Amount
                    </p>
                    <p className="mt-1 text-lg font-semibold text-black">
                      {formatCurrency(Number(order.total_amount))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      Order Date
                    </p>
                    <p className="mt-1 text-sm font-medium text-black">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Note */}
                {order.note && (
                  <div className="mb-6 rounded-xl bg-white p-4">
                    <p className="text-xs font-medium text-neutral-500">Note</p>
                    <p className="mt-1 text-sm text-black">{order.note}</p>
                  </div>
                )}

                {/* Order Tracking */}
                <div className="rounded-xl bg-white p-6">
                  <h4 className="mb-4 text-sm font-bold text-black">
                    Order Tracking
                  </h4>
                  <OrderStepper order={order} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
