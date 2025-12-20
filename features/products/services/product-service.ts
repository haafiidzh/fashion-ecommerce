import apiClient from '@/lib/api-client';
import { Product } from '../types/product-types';

export const productApi = {
    getProducts: async (filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
    }): Promise<Product[]> => {
        const params = new URLSearchParams();

        if (filters?.category) params.append('category', filters.category);
        if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
        if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);

        const response = await apiClient.get(`/products?${params.toString()}`);
        return response.data;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (productData: {
        name: string;
        price: number;
        category_id: number;
        images?: any[];
    }): Promise<Product> => {
        const response = await apiClient.post('/products', productData);
        return response.data;
    },

    updateProduct: async (id: number, productData: {
        name?: string;
        price?: number;
        category_id?: number;
        images?: any[];
    }): Promise<Product> => {
        const response = await apiClient.put(`/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    }
};