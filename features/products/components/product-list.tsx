'use client';

import React, { useState } from 'react';
import ProductModal from './product-modal';
import { Product, ProductFormData } from '@/features/products/types/product-types';
import { useProduct } from '../context/product-context';
import ProductDataTable from "@/features/products/components/product-data-table";

interface ProductListProps {
    onNavigateToDetail?: (id: number) => void;
}

export default function ProductList({ onNavigateToDetail }: ProductListProps) {
    const { state, createProduct, updateProduct, deleteProduct, clearError } = useProduct();
    const { products, loading, error } = state;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateProduct = async (data: ProductFormData) => {
        setIsSubmitting(true);
        try {
            await createProduct(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateProduct = async (data: ProductFormData) => {
        if (!editingProduct) return;

        setIsSubmitting(true);
        try {
            await updateProduct(editingProduct.id, data);
            setEditingProduct(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating product:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(id);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCreateNewProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleViewProduct = (id: number) => {
        if (onNavigateToDetail) {
            onNavigateToDetail(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Products</h2>
                <button
                    onClick={handleCreateNewProduct}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Product
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
                <ProductDataTable
                    data={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                    onView={handleViewProduct}
                />
            )}

            {!loading && products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No products found.</p>
                    <button
                        onClick={handleCreateNewProduct}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Product
                    </button>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
                isLoading={isSubmitting}
            />
        </div>
    );
};