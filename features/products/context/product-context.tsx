'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { productApi } from '../services/product-service';
import { Product, ProductState, ProductFormData } from '../types/product-types';
import { toast } from 'sonner';

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

type ProductAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'CREATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'UPDATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'DELETE_PRODUCT_SUCCESS'; payload: number }
    | { type: 'RESET_STATE' };

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload, error: null };
        case 'CREATE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: [...state.products, action.payload],
                error: null,
            };
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                error: null,
            };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: state.products.filter((product) => product.id !== action.payload),
                error: null,
            };
        case 'RESET_STATE':
            return { ...initialState };
        default:
            return state;
    }
};

const ProductContext = createContext<{
    state: ProductState;
    fetchProducts: () => Promise<void>;
    createProduct: (data: ProductFormData) => Promise<void>;
    updateProduct: (id: number, data: ProductFormData) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    clearError: () => void;
}>({
    state: initialState,
    fetchProducts: async () => { },
    createProduct: async () => { },
    updateProduct: async () => { },
    deleteProduct: async () => { },
    clearError: () => { },
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(productReducer, initialState);

    const fetchProducts = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const products = await productApi.getProducts();
            dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
        } catch (error) {
            console.error('Failed to fetch products:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memuat produk' });
            toast.error('Gagal memuat produk');
        }
    };

    const createProduct = async (data: ProductFormData) => {
        try {
            const product = await productApi.createProduct(data);
            dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: product });
            toast.success('Produk berhasil dibuat');
        } catch (error) {
            console.error('Failed to create product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal membuat produk' });
            toast.error('Gagal membuat produk');
            throw error;
        }
    };

    const updateProduct = async (id: number, data: ProductFormData) => {
        try {
            const product = await productApi.updateProduct(id, data);
            dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: product });
            toast.success('Produk berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memperbarui produk' });
            toast.error('Gagal memperbarui produk');
            throw error;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            await productApi.deleteProduct(id);
            dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });
            toast.success('Produk berhasil dihapus');
        } catch (error) {
            console.error('Failed to delete product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal menghapus produk' });
            toast.error('Gagal menghapus produk');
            throw error;
        }
    };

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <ProductContext.Provider
            value={{
                state,
                fetchProducts,
                createProduct,
                updateProduct,
                deleteProduct,
                clearError,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};