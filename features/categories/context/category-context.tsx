'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { categoryApi } from '@/features/categories/services/category-service';
import { Category, CategoryState, CategoryFormData } from '../types/category-types';
import { toast } from 'sonner';

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

type CategoryAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
    | { type: 'CREATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'UPDATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'DELETE_CATEGORY_SUCCESS'; payload: number }
    | { type: 'RESET_STATE' };

const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'FETCH_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload, error: null };
        case 'CREATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],
                error: null,
            };
        case 'UPDATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.map((category) =>
                    category.id === action.payload.id ? action.payload : category
                ),
                error: null,
            };
        case 'DELETE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.filter((category) => category.id !== action.payload),
                error: null,
            };
        case 'RESET_STATE':
            return { ...initialState };
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
    clearError: () => void;
}>({
    state: initialState,
    fetchCategories: async () => { },
    createCategory: async () => { },
    updateCategory: async () => { },
    deleteCategory: async () => { },
    clearError: () => { },
});

type CategoryProviderProps = {
    children: ReactNode;
};

export function CategoryProvider({ children }: CategoryProviderProps) {
    const [state, dispatch] = useReducer(categoryReducer, initialState);

    const fetchCategories = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const categories = await categoryApi.getCategories();
            dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memuat kategori' });
            toast.error('Gagal memuat kategori');
        }
    };

    const createCategory = async (name: string) => {
        try {
            const category = await categoryApi.createCategory(name);
            dispatch({ type: 'CREATE_CATEGORY_SUCCESS', payload: category });
            toast.success('Kategori berhasil dibuat');
        } catch (error) {
            console.error('Failed to create category:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal membuat kategori' });
            toast.error('Gagal membuat kategori');
            throw error;
        }
    };

    const updateCategory = async (id: number, name: string) => {
        try {
            const category = await categoryApi.updateCategory(id, name);
            dispatch({ type: 'UPDATE_CATEGORY_SUCCESS', payload: category });
            toast.success('Kategori berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update category:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memperbarui kategori' });
            toast.error('Gagal memperbarui kategori');
            throw error;
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await categoryApi.deleteCategory(id);
            dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: id });
            toast.success('Kategori berhasil dihapus');
        } catch (error) {
            console.error('Failed to delete category:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal menghapus kategori' });
            toast.error('Gagal menghapus kategori');
            throw error;
        }
    };

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null });
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
                clearError,
            }}
        >
            {children}
        </CategoryContext.Provider>
    );
}

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};