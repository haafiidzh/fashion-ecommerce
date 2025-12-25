"use client";

import { Order } from "../types/account-types";
import { IconCheck, IconClock, IconTruck, IconX } from "@tabler/icons-react";

interface OrderStepperProps {
  order: Order;
}

const getStepStatus = (
  currentStatus: Order["status"],
  step: number
): "completed" | "current" | "pending" | "cancelled" => {
  if (currentStatus === "cancelled") return "cancelled";

  const statusOrder = ["pending", "processing", "shipped", "completed"];
  const currentIndex = statusOrder.indexOf(currentStatus);

  if (step < currentIndex) return "completed";
  if (step === currentIndex) return "current";
  return "pending";
};

export default function OrderStepper({ order }: OrderStepperProps) {
  const steps = [
    { label: "Order Placed", icon: IconClock },
    { label: "Processing", icon: IconClock },
    { label: "Shipped", icon: IconTruck },
    { label: "Completed", icon: IconCheck },
  ];

  if (order.status === "cancelled") {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <IconX className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">
              Order Cancelled
            </p>
            <p className="text-sm text-red-700 dark:text-red-300">
              This order has been cancelled
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const status = getStepStatus(order.status, index);
        const StepIcon = step.icon;

        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  status === "completed"
                    ? "bg-green-500"
                    : status === "current"
                      ? "bg-blue-500"
                      : "bg-neutral-200 dark:bg-neutral-700"
                }`}
              >
                <StepIcon
                  className={`h-5 w-5 ${
                    status === "completed" || status === "current"
                      ? "text-white"
                      : "text-neutral-400"
                  }`}
                />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-12 w-0.5 ${
                    status === "completed"
                      ? "bg-green-500"
                      : "bg-neutral-200 dark:bg-neutral-700"
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <p
                className={`font-medium ${
                  status === "completed" || status === "current"
                    ? "text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-500 dark:text-neutral-400"
                }`}
              >
                {step.label}
              </p>
              {status === "current" && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  In progress
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
