'use client';

import React from 'react';
import { Category, CategoryFormData } from "@/features/categories/types/category-types";

interface CategoryFormProps {
    category?: Category;
    onSubmit: (data: CategoryFormData) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export default function CategoryForm({
                                         category,
                                         onSubmit,
                                         onCancel,
                                         isLoading = false
                                     }: CategoryFormProps) {
    const [formData, setFormData] = React.useState<CategoryFormData>({
        name: category?.name || '',
    });

    React.useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
            });
        }
    }, [category]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
                {category ? 'Edit Category' : 'Create New Category'}
            </h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : (category ? 'Update' : 'Create')}
                    </button>
                </div>
            </form>
        </div>
    );
};
