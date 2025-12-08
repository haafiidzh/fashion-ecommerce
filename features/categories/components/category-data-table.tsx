"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Category } from "@/features/categories/types/category-types"
import { DataTable } from "@/components/ui/data-table"

interface CategoryDataTableProps {
    data: Category[]
    onEdit: (category: Category) => void
    onDelete: (id: number) => void
    onView: (id: number) => void
}

export default function CategoryDataTable({ data, onEdit, onDelete, onView }: CategoryDataTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const columns: ColumnDef<Category>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }) => {
                return <div className="font-medium">{row.getValue("id")}</div>
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="font-medium">{row.getValue("name")}</div>
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            cell: ({ row }) => {
                return <div className="text-sm text-gray-500">{formatDate(row.getValue("created_at"))}</div>
            },
        },
        {
            accessorKey: "updated_at",
            header: "Updated At",
            cell: ({ row }) => {
                return <div className="text-sm text-gray-500">{formatDate(row.getValue("updated_at"))}</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const category = row.original

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
                                onClick={() => navigator.clipboard.writeText(category.id.toString())}
                            >
                                Copy category ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onView(category.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit category
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(category.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete category
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    return (
        <DataTable columns={columns} data={data} searchKey="name" />
    )
}