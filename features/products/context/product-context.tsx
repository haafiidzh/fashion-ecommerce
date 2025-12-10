'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { productApi } from '@/data/products';
import { Product, ProductState, ProductFormData } from '../types/product-types';

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
};

type ProductAction =
    | { type: 'FETCH_PRODUCTS_REQUEST' }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string }
    | { type: 'CREATE_PRODUCT_REQUEST' }
    | { type: 'CREATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'CREATE_PRODUCT_FAILURE'; payload: string }
    | { type: 'UPDATE_PRODUCT_REQUEST' }
    | { type: 'UPDATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'UPDATE_PRODUCT_FAILURE'; payload: string }
    | { type: 'DELETE_PRODUCT_REQUEST' }
    | { type: 'DELETE_PRODUCT_SUCCESS'; payload: number }
    | { type: 'DELETE_PRODUCT_FAILURE'; payload: string }
    | { type: 'CLEAR_ERROR' };

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
    switch (action.type) {
        case 'FETCH_PRODUCTS_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_PRODUCTS_SUCCESS':
            return { ...state, loading: false, products: action.payload };
        case 'FETCH_PRODUCTS_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_PRODUCT_REQUEST':
            return { ...state, loading: true, error: null };
        case 'CREATE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: [...state.products, action.payload],
            };
        case 'CREATE_PRODUCT_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_PRODUCT_REQUEST':
            return { ...state, loading: true, error: null };
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
            };
        case 'UPDATE_PRODUCT_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'DELETE_PRODUCT_REQUEST':
            return { ...state, loading: true, error: null };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                loading: false,
                products: state.products.filter((product) => product.id !== action.payload),
            };
        case 'DELETE_PRODUCT_FAILURE':
            return { ...state, loading: false, error: action.payload };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
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
    fetchProducts: async () => {},
    createProduct: async () => {},
    updateProduct: async () => {},
    deleteProduct: async () => {},
    clearError: () => {},
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(productReducer, initialState);

    const fetchProducts = async () => {
        dispatch({ type: 'FETCH_PRODUCTS_REQUEST' });
        try {
            const products = await productApi.getProducts();
            dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
        } catch (error) {
            dispatch({
                type: 'FETCH_PRODUCTS_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const createProduct = async (data: ProductFormData) => {
        dispatch({ type: 'CREATE_PRODUCT_REQUEST' });
        try {
            const product = await productApi.createProduct(data);
            dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: product });
        } catch (error) {
            dispatch({
                type: 'CREATE_PRODUCT_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const updateProduct = async (id: number, data: ProductFormData) => {
        dispatch({ type: 'UPDATE_PRODUCT_REQUEST' });
        try {
            const product = await productApi.updateProduct(id, data);
            dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: product });
        } catch (error) {
            dispatch({
                type: 'UPDATE_PRODUCT_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const deleteProduct = async (id: number) => {
        dispatch({ type: 'DELETE_PRODUCT_REQUEST' });
        try {
            await productApi.deleteProduct(id);
            dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });
        } catch (error) {
            dispatch({
                type: 'DELETE_PRODUCT_FAILURE',
                payload: error instanceof Error ? error.message : 'An unknown error occurred',
            });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
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