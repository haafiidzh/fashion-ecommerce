"use client";

import { AccountSection, Order } from "../types/account-types";
import {
  IconUser,
  IconMapPin,
  IconLock,
  IconShoppingBag,
} from "@tabler/icons-react";
import OrderStepper from "./order-stepper";

interface AccountSidebarProps {
  activeSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
}

export default function AccountSidebar({
  activeSection,
  onSectionChange,
}: AccountSidebarProps) {
  const menuItems = [
    { id: "info" as AccountSection, label: "Basic Information", icon: IconUser },
    { id: "address" as AccountSection, label: "Address", icon: IconMapPin },
    { id: "password" as AccountSection, label: "Password", icon: IconLock },
    { id: "orders" as AccountSection, label: "Orders", icon: IconShoppingBag },
  ];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-2">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
