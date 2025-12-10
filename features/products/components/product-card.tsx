'use client';

import React from 'react';
import { Product } from "@/features/products/types/product-types";

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    onDelete?: (id: number) => void;
    onView?: (id: number) => void;
}

export default function ProductCard({
                                        product,
                                        onEdit,
                                        onDelete,
                                        onView
                                    }: ProductCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatPrice = (price?: string) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(parseInt(price));
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    Category: {product.category?.name || 'N/A'}
                </p>
                <p className="text-lg font-medium text-gray-900 mb-4">
                    {formatPrice(product.price)}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                    Created on {formatDate(product.created_at)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Last updated: {formatDate(product.updated_at)}
                </p>

                <div className="flex justify-between">
                    <div className="flex space-x-2">
                        {onView && (
                            <button
                                onClick={() => onView(product.id)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                                View
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => onEdit(product)}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(product.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};