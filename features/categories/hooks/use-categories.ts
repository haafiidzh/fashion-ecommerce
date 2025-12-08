'use client';

import { useState, useEffect } from 'react';
import { categoryApi } from '@/data/categories';
import {Category, CategoryFormData} from "@/features/categories/types/category-types";

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await categoryApi.getCategories();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const createCategory = async (data: CategoryFormData): Promise<Category> => {
        try {
            const newCategory = await categoryApi.createCategory(data.name);
            setCategories(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category');
            throw err;
        }
    };

    const updateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
        try {
            const updatedCategory = await categoryApi.updateCategory(id, data.name);
            setCategories(prev =>
                prev.map(category =>
                    category.id === id ? updatedCategory : category
                )
            );
            return updatedCategory;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update category');
            throw err;
        }
    };

    const deleteCategory = async (id: number): Promise<void> => {
        try {
            await categoryApi.deleteCategory(id);
            setCategories(prev => prev.filter(category => category.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete category');
            throw err;
        }
    };

    const clearError = () => setError(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        clearError,
    };
};

export const useCategoryById = (id: number): Category | null => {
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await categoryApi.getCategoryById(id);
                setCategory(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch category');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCategory();
        }
    }, [id]);

    return category;
};