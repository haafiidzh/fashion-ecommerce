'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { productApi } from '@/features/products/services/product-service';
import { categoryApi } from '@/features/categories/services/category-service';
import { Product } from '@/features/products/types/product-types';
import { toast } from 'sonner';
import { Category } from "@/features/categories/types/category-types";

export interface ShopFilters {
    category?: string;
    size?: string;
    color?: string;
    priceRange?: [number, number];
    dressStyle?: string;
    sortBy?: string;
}

export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export interface ShopState {
    products: Product[];
    filteredProducts: Product[];
    categories: Category[];
    loading: boolean;
    categoriesLoading: boolean;
    error: string | null;
    categoriesError: string | null;
    filters: ShopFilters;
    pagination: PaginationState;
}

type ShopAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_CATEGORIES_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_CATEGORIES_ERROR'; payload: string | null }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'FETCH_CATEGORIES_SUCCESS'; payload: Category[] }
    | { type: 'SET_FILTERS'; payload: ShopFilters }
    | { type: 'SET_PAGINATION'; payload: Partial<PaginationState> }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'RESET_FILTERS' }
    | { type: 'RESET_STATE' };

const initialState: ShopState = {
    products: [],
    filteredProducts: [],
    categories: [],
    loading: false,
    categoriesLoading: false,
    error: null,
    categoriesError: null,
    filters: {
        sortBy: 'most-popular',
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 0,
    },
};

const getProductPrice = (product: Product): number => {
    if (product.price) return product.price;

    const variants = (product as any).product_variants;
    if (!variants || variants.length === 0) return 0;

    const prices = variants
        .map((v: any) => v.price)
        .filter((p: number | null) => p !== null && p !== undefined);

    return prices.length > 0 ? Math.min(...prices) : 0;
};

const shopReducer = (state: ShopState, action: ShopAction): ShopState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_CATEGORIES_LOADING':
            return { ...state, categoriesLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_CATEGORIES_ERROR':
            return { ...state, categoriesError: action.payload, categoriesLoading: false };
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload, error: null };
        case 'FETCH_CATEGORIES_SUCCESS':
            return { ...state, categoriesLoading: false, categories: action.payload, categoriesError: null };
        case 'SET_FILTERS':
            const newFilters = { ...state.filters, ...action.payload };
            const filtered = applyFilters(state.products, newFilters);
            const totalPages = Math.ceil(filtered.length / state.pagination.itemsPerPage);

            return {
                ...state,
                filters: newFilters,
                filteredProducts: filtered,
                pagination: {
                    ...state.pagination,
                    totalItems: filtered.length,
                    totalPages,
                    currentPage: 1,
                },
            };
        case 'SET_PAGINATION':
            return {
                ...state,
                pagination: { ...state.pagination, ...action.payload },
            };
        case 'SET_PAGE':
            return {
                ...state,
                pagination: { ...state.pagination, currentPage: action.payload },
            };
        case 'RESET_FILTERS':
            return {
                ...state,
                filters: { sortBy: 'most-popular' },
                pagination: { ...state.pagination, currentPage: 1 },
            };
        case 'RESET_STATE':
            return { ...initialState };
        default:
            return state;
    }
};

const applyFilters = (products: Product[], filters: ShopFilters): Product[] => {
    let filtered = [...products];

    if (filters.category) {
        filtered = filtered.filter(product =>
            product.product_category?.name.toLowerCase() === filters.category?.toLowerCase()
        );
    }

    if (filters.size) {
        filtered = filtered.filter((product: any) => {
            if (!product.product_variants) return false;

            return product.product_variants.some((v: any) =>
                v.variants?.name === 'Ukuran' && v.name === filters.size
            );
        });
    }

    if (filters.color) {
        filtered = filtered.filter((product: any) => {
            if (!product.product_variants) return false;

            return product.product_variants.some((v: any) =>
                v.variants?.name === 'Warna' && v.name === filters.color
            );
        });
    }

    if (filters.priceRange) {
        filtered = filtered.filter(product => {
            const price = getProductPrice(product);
            return price >= filters.priceRange![0] && price <= filters.priceRange![1];
        });
    }

    switch (filters.sortBy) {
        case 'low-price':
            filtered.sort((a, b) => getProductPrice(a) - getProductPrice(b));
            break;
        case 'high-price':
            filtered.sort((a, b) => getProductPrice(b) - getProductPrice(a));
            break;
        case 'most-popular':
        default:
            break;
    }

    return filtered;
};

const ShopContext = createContext<{
    state: ShopState;
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    setFilters: (filters: Partial<ShopFilters>) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
    clearError: () => void;
}>({
    state: initialState,
    fetchProducts: async () => { },
    fetchCategories: async () => { },
    setFilters: () => { },
    setPage: () => { },
    resetFilters: () => { },
    clearError: () => { },
});

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(shopReducer, initialState);

    const fetchProducts = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const products = await productApi.getProducts();
            dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
            dispatch({ type: 'SET_FILTERS', payload: state.filters });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memuat produk' });
            toast.error('Gagal memuat produk');
        }
    };

    const fetchCategories = async () => {
        dispatch({ type: 'SET_CATEGORIES_LOADING', payload: true });
        try {
            const categories = await categoryApi.getCategories();
            dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', payload: categories });
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            dispatch({ type: 'SET_CATEGORIES_ERROR', payload: 'Gagal memuat kategori' });
            toast.error('Gagal memuat kategori');
        }
    };

    const setFilters = (filters: Partial<ShopFilters>) => {
        dispatch({ type: 'SET_FILTERS', payload: filters });
    };

    const setPage = (page: number) => {
        dispatch({ type: 'SET_PAGE', payload: page });
    };

    const resetFilters = () => {
        dispatch({ type: 'RESET_FILTERS' });
    };

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null });
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    return (
        <ShopContext.Provider
            value={{
                state,
                fetchProducts,
                fetchCategories,
                setFilters,
                setPage,
                resetFilters,
                clearError,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};