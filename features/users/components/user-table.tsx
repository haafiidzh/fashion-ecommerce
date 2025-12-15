"use client";

import { User } from "../types/user-types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";

export default function UserTable({
  data,
  onDelete,
  onEdit,
  onDetail,
}: {
  data: User[];
  onDelete: (id: number) => void;
  onEdit: (isEdit: boolean, data: any) => void;
  onDetail: (id: number) => void;
}) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";
    return new Intl.DateTimeFormat("id-ID").format(d);
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: "No",
      cell: ({ row }) => (
        <div className="font-medium">{row.index + 1}</div>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const gender = row.getValue("gender") as string;
        return <div>{gender === "male" ? "Male" : "Female"}</div>;
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => (
        <div className="text-sm text-neutral-500">
          {formatDate(row.getValue("created_at") as any)}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="cursor-pointer">
                <IconDots className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => onDetail(user.id)}
                className="cursor-pointer"
              >
                <IconEye className="w-4 h-4" /> Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onEdit(true, user)}
                className="cursor-pointer"
              >
                <IconEdit className="w-4 h-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onDelete(user.id)}
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

  return <DataTable columns={columns} data={data} searchKey="username" />;
}