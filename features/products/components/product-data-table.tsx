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
import { Product } from "@/features/products/types/product-types"
import { DataTable } from "@/components/ui/data-table"

interface ProductDataTableProps {
    data: Product[]
    onEdit: (product: Product) => void
    onEditWithError?: (product: Product) => void
    onDelete: (id: number) => void
    onView: (id: number) => void
}

export default function ProductDataTable({ data, onEdit, onEditWithError, onDelete, onView }: ProductDataTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }

    const formatPrice = (price?: number) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format((price));
    }

    const columns: ColumnDef<Product>[] = [
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
            accessorKey: "product_category.name",
            header: "Category",
            cell: ({ row }) => {
                const product = row.original
                return <div className="font-medium">{product.product_category?.name || 'N/A'}</div>
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                return <div className="font-medium">{formatPrice(row.getValue("price"))}</div>
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
                const product = row.original

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
                                onClick={() => navigator.clipboard.writeText(product.id.toString())}
                            >
                                Copy product ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onView(product.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(product)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit product
                            </DropdownMenuItem>
                            {onEditWithError && (
                                <DropdownMenuItem
                                    onClick={() => onEditWithError(product)}
                                    className="text-orange-600"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit (Test Error)
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={() => onDelete(product.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete product
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