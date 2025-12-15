"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Permission } from "../types/permission-types";
import { Button } from "@/components/ui/button";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

export default function PermissionTable({
  data,
  onDelete,
  onEdit,
  onDetail,
}: {
  data: Permission[];
  onDelete: (id: number) => void;
  onEdit: (isEdit: boolean, data: any) => void;
  onDetail: (id: number) => void;
}) {
  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "id",
      header: "No",
      cell: ({ row }) => (
        <div className="font-medium">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "guard",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Guard
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("guard")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <IconDots className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => onDetail(permission.id)}
                className="cursor-pointer"
              >
                <IconEye className="w-4 h-4" /> Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onEdit(true, permission)}
                className="cursor-pointer"
              >
                <IconEdit className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(permission.id)}
                className="cursor-pointer"
              >
                <IconTrash className="w-4 h-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} searchKey="name" />;
}