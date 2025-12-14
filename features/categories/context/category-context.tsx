'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { categoryApi } from '@/features/categories/services/category-service';
import { Category, CategoryState, CategoryFormData } from '../types/category-types';
import { toast } from 'sonner';

const initialState: CategoryState = {
    categories: [],
    loading: false,
};

type CategoryAction =
    | { type: 'FETCH_CATEGORIES_REQUEST' }
    | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
    | { type: 'CREATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'UPDATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'DELETE_CATEGORY_SUCCESS'; payload: number };

const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'CREATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],
            };
        case 'UPDATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.map((category) =>
                    category.id === action.payload.id ? action.payload : category
                ),
            };
        case 'DELETE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.filter((category) => category.id !== action.payload),
            };
        default:
            return state;
    }
};

const CategoryContext = createContext<{
    state: CategoryState;
    fetchCategories: () => Promise<void>;
    createCategory: (name: string) => Promise<void>;
    updateCategory: (id: number, name: string) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;
}>({
    state: initialState,
    fetchCategories: async () => {},
    createCategory: async () => {},
    updateCategory: async () => {},
    deleteCategory: async () => {},
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);

    const fetchCategories = async () => {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        try {
            const categories = await categoryApi.getCategories();
            dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Gagal memuat kategori');
        }
    };

    const createCategory = async (name: string) => {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        try {
            const category = await categoryApi.createCategory(name);
            dispatch({ type: 'CREATE_CATEGORY_SUCCESS', payload: category });
            toast.success('Kategori berhasil dibuat');
        } catch (error) {
            console.error('Failed to create category:', error);
            toast.error('Gagal membuat kategori');
        }
    };

    const updateCategory = async (id: number, name: string) => {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        try {
            const category = await categoryApi.updateCategory(id, name);
            dispatch({ type: 'UPDATE_CATEGORY_SUCCESS', payload: category });
            toast.success('Kategori berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update category:', error);
            toast.error('Gagal memperbarui kategori');
        }
    };

    const deleteCategory = async (id: number) => {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        try {
            await categoryApi.deleteCategory(id);
            dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: id });
            toast.success('Kategori berhasil dihapus');
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Gagal menghapus kategori');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <CategoryContext.Provider
            value={{
                state,
                fetchCategories,
                createCategory,
                updateCategory,
                deleteCategory,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};