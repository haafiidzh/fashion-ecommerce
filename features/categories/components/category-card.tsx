'use client';

import React from 'react';
import {Category} from "@/features/categories/types/category-types";
import {formatDate} from "@/lib/utils";

interface CategoryCardProps {
    category: Category;
    onEdit?: (category: Category) => void;
    onDelete?: (id: number) => void;
    onView?: (id: number) => void;
}

export default function CategoryCard({
                                         category,
                                         onEdit,
                                         onDelete,
                                         onView
                                     }: CategoryCardProps) {

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Created on {formatDate(category.created_at)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Last updated: {formatDate(category.updated_at)}
                </p>

                <div className="flex justify-between">
                    <div className="flex space-x-2">
                        {onView && (
                            <button
                                onClick={() => onView(category.id)}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            >
                                View
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => onEdit(category)}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            >
                                Edit
                            </button>
                        )}
                    </div>
                    {onDelete && (
                        <button
                            onClick={() => onDelete(category.id)}
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