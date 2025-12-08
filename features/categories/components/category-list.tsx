'use client';

import React, { useState } from 'react';
import CategoryModal from './category-modal';
import { Category, CategoryFormData } from '@/features/categories/types/category-types';
import { useCategory } from '../context/category-context';
import CategoryDataTable from "@/features/categories/components/category-data-table";

interface CategoryListProps {
    onNavigateToDetail?: (id: number) => void;
}

export default function CategoryList({ onNavigateToDetail }: CategoryListProps) {
    const { state, createCategory, updateCategory, deleteCategory, clearError } = useCategory();
    const { categories, loading, error } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateCategory = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        try {
            await createCategory(data.name);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateCategory = async (data: CategoryFormData) => {
        if (!editingCategory) return;

        setIsSubmitting(true);
        try {
            await updateCategory(editingCategory.id, data.name);
            setEditingCategory(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id);
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleCreateNewCategory = () => {
        setEditingCategory(null);
        setIsModalOpen(true);
    };

    const handleViewCategory = (id: number) => {
        if (onNavigateToDetail) {
            onNavigateToDetail(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <button
                    onClick={handleCreateNewCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Category
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                    <button
                        onClick={clearError}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <CategoryDataTable
                    data={categories}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                    onView={handleViewCategory}
                />
            )}

            {!loading && categories.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No categories found.</p>
                    <button
                        onClick={handleCreateNewCategory}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Category
                    </button>
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
                isLoading={isSubmitting}
            />
        </div>
    );
};