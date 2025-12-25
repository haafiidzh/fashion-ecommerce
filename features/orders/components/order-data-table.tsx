"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/data-table";
import type { Order } from "@/features/orders/types/order-types";
import { StatusBadge } from "./status-badge";

interface OrderDataTableProps {
  data: Order[];
  onView?: (id: string) => void;
}

export function OrderDataTable({ data, onView }: OrderDataTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleString("id-ID");
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => {
        const id = row.getValue<string>("id");
        return (
          <button
            type="button"
            onClick={() => onView?.(id)}
            className="font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {id}
          </button>
        );
      },
    },
    {
      accessorKey: "customer",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div className="font-medium">{row.getValue("customer") as string}</div>
        );
      },
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("items") as number}</div>;
      },
    },
    {
      accessorKey: "total",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const total = row.getValue<number>("total");
        return <div className="font-medium">{formatIDR(total)}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<any>("status");
        return <StatusBadge status={status} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const createdAt = row.getValue<string>("createdAt");
        return (
          <div className="text-sm text-gray-500 dark:text-neutral-400">
            {formatDate(createdAt)}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Copy order ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onView?.(order.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} searchKey="customer" />;
}
