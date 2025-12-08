'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { categoryApi } from '@/data/categories';
import { Category, CategoryState, CategoryFormData } from '../types/category-types';

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

type CategoryAction =
    | { type: 'FETCH_CATEGORIES_REQUEST' }
    | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
    | { type: 'FETCH_CATEGORIES_FAILURE'; payload: string }
    | { type: 'CREATE_CATEGORY_REQUEST' }
    | { type: 'CREATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'CREATE_CATEGORY_FAILURE'; payload: string }
    | { type: 'UPDATE_CATEGORY_REQUEST' }
    | { type: 'UPDATE_CATEGORY_SUCCESS'; payload: Category }
    | { type: 'UPDATE_CATEGORY_FAILURE'; payload: string }
    | { type: 'DELETE_CATEGORY_REQUEST' }
    | { type: 'DELETE_CATEGORY_SUCCESS'; payload: number }
    | { type: 'DELETE_CATEGORY_FAILURE'; payload: string }
    | { type: 'CLEAR_ERROR' };

const categoryReducer = (state: CategoryState, action: CategoryAction): CategoryState => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'FETCH_CATEGORIES_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_CATEGORY_REQUEST':
            return { ...state, loading: true, error: null };
        case 'CREATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: [...state.categories, action.payload],
            };
        case 'CREATE_CATEGORY_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_CATEGORY_REQUEST':
            return { ...state, loading: true, error: null };
        case 'UPDATE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.map((category) =>
                    category.id === action.payload.id ? action.payload : category
                ),
            };
        case 'UPDATE_CATEGORY_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_CATEGORY_REQUEST':
            return { ...state, loading: true, error: null };
        case 'DELETE_CATEGORY_SUCCESS':
            return {
                ...state,
                loading: false,
                categories: state.categories.filter((category) => category.id !== action.payload),
            };
        case 'DELETE_CATEGORY_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
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
    fetchCategories: async () => {},
    createCategory: async () => {},
    updateCategory: async () => {},
    deleteCategory: async () => {},
    clearError: () => {},
});

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, initialState);

    const fetchCategories = async () => {
        dispatch({ type: 'FETCH_CATEGORIES_REQUEST' });
        try {
            const categories = await categoryApi.getCategories();
            dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
        } catch (error) {
            dispatch({
                type: 'FETCH_CATEGORIES_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const createCategory = async (name: string) => {
        dispatch({ type: 'CREATE_CATEGORY_REQUEST' });
        try {
            const category = await categoryApi.createCategory(name);
            dispatch({ type: 'CREATE_CATEGORY_SUCCESS', payload: category });
        } catch (error) {
            dispatch({
                type: 'CREATE_CATEGORY_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const updateCategory = async (id: number, name: string) => {
        dispatch({ type: 'UPDATE_CATEGORY_REQUEST' });
        try {
            const category = await categoryApi.updateCategory(id, name);
            dispatch({ type: 'UPDATE_CATEGORY_SUCCESS', payload: category });
        } catch (error) {
            dispatch({
                type: 'UPDATE_CATEGORY_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const deleteCategory = async (id: number) => {
        dispatch({ type: 'DELETE_CATEGORY_REQUEST' });
        try {
            await categoryApi.deleteCategory(id);
            dispatch({ type: 'DELETE_CATEGORY_SUCCESS', payload: id });
        } catch (error) {
            dispatch({
                type: 'DELETE_CATEGORY_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
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
};

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error('useCategory must be used within a CategoryProvider');
    }
    return context;
};